import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Auth check via session token
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate session
    const { data: userData, error: authError } = await supabase
      .rpc('validate_session', { token: authToken })

    if (authError || !userData || userData.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = userData[0]
    
    const body = await request.json()
    const { 
      target_type, // 'topic' or 'post'
      target_id, 
      vote_type // 'up' or 'down'
    } = body

    // Get user info for voter info
    const voter_name = user.full_name || user.email?.split('@')[0] || 'Anonim Kullanıcı'

    // Validation
    if (!target_type || !target_id || !vote_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['topic', 'post'].includes(target_type)) {
      return NextResponse.json({ error: 'Invalid target_type' }, { status: 400 })
    }

    if (!['up', 'down'].includes(vote_type)) {
      return NextResponse.json({ error: 'Invalid vote_type' }, { status: 400 })
    }

    // Check if user already voted on this item
    const { data: existingVote, error: voteCheckError } = await supabase
      .from('forum_votes')
      .select('id, vote_type')
      .eq('target_type', target_type)
      .eq('target_id', target_id)
      .eq('voter_id', user.user_id)
      .maybeSingle()

    if (voteCheckError) {
      console.error('Vote check error:', voteCheckError)
      return NextResponse.json({ error: 'Failed to check existing vote' }, { status: 500 })
    }

    let voteChange = 0
    let action = ''

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // User is removing their vote
        const { error: deleteError } = await supabase
          .from('forum_votes')
          .delete()
          .eq('id', existingVote.id)

        if (deleteError) {
          console.error('Vote delete error:', deleteError)
          return NextResponse.json({ error: 'Failed to remove vote' }, { status: 500 })
        }

        voteChange = vote_type === 'up' ? -1 : 1
        action = 'removed'
      } else {
        // User is changing their vote
        const { error: updateError } = await supabase
          .from('forum_votes')
          .update({ 
            vote_type,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingVote.id)

        if (updateError) {
          console.error('Vote update error:', updateError)
          return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 })
        }

        voteChange = vote_type === 'up' ? 2 : -2 // From down to up = +2, from up to down = -2
        action = 'changed'
      }
    } else {
      // User is voting for the first time
      const { error: insertError } = await supabase
        .from('forum_votes')
        .insert({
          target_type,
          target_id,
          vote_type,
          voter_name,
          voter_ip: null,
          voter_id: user.user_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Vote insert error:', insertError)
        return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 })
      }

      voteChange = vote_type === 'up' ? 1 : -1
      action = 'added'
    }

    // Update the target item's vote score
    const table = target_type === 'topic' ? 'forum_topics' : 'forum_posts'
    const { data: updated, error: updateError } = await supabase
      .from(table)
      .update({ 
        vote_score: await getNewVoteScore(supabase, table, target_id, voteChange)
      })
      .eq('id', target_id)
      .select('vote_score')
      .single()

    if (updateError) {
      console.error('Score update error:', updateError)
      return NextResponse.json({ error: 'Failed to update vote score' }, { status: 500 })
    }

    return NextResponse.json({
      action,
      vote_change: voteChange,
      new_score: updated.vote_score
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Auth check via session token
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate session
    const { data: userData, error: authError } = await supabase
      .rpc('validate_session', { token: authToken })

    if (authError || !userData || userData.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = userData[0]
    
    const { searchParams } = new URL(request.url)
    const target_type = searchParams.get('target_type')
    const target_id = searchParams.get('target_id')

    if (!target_type || !target_id) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('forum_votes')
      .select('vote_type')
      .eq('target_type', target_type)
      .eq('target_id', target_id)
      .eq('voter_id', user.user_id)
      .maybeSingle()

    if (error) {
      console.error('Vote fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch vote' }, { status: 500 })
    }

    return NextResponse.json({
      has_voted: !!data,
      vote_type: data?.vote_type || null
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getNewVoteScore(supabase: any, table: string, target_id: string, change: number) {
  const { data, error } = await supabase
    .from(table)
    .select('vote_score')
    .eq('id', target_id)
    .single()

  if (error || !data) {
    return change // Fallback to just the change
  }

  return data.vote_score + change
} 