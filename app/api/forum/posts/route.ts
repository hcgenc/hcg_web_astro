import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    const topic_id = searchParams.get('topic_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sort = searchParams.get('sort') || 'oldest' // oldest, newest, popular
    
    if (!topic_id) {
      return NextResponse.json({ error: 'topic_id is required' }, { status: 400 })
    }

    let query = supabase
      .from('forum_posts')
      .select(`
        id,
        content,
        topic_id,
        parent_id,
        author_id,
        author_name,
        author_avatar,
        vote_score,
        is_edited,
        created_at,
        updated_at,
        replies:forum_posts!parent_id (
          id,
          content,
          author_name,
          author_avatar,
          vote_score,
          created_at
        )
      `)
      .eq('topic_id', topic_id)
      .is('parent_id', null) // Only top-level posts

    // Sorting
    switch (sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'popular':
        query = query.order('vote_score', { ascending: false })
        break
      case 'oldest':
      default:
        query = query.order('created_at', { ascending: true })
        break
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch forum posts' }, { status: 500 })
    }

    // Like ve dislike sayılarını hesapla
    let enrichedData = data
    if (data && data.length > 0) {
      const postIds = data.map(post => post.id)
      const replyIds = data.flatMap(post => post.replies ? post.replies.map(reply => reply.id) : [])
      const allPostIds = [...postIds, ...replyIds]
      
      // Her post ve reply için like ve dislike sayılarını çek
      const { data: voteCounts, error: voteError } = await supabase
        .from('forum_votes')
        .select('target_id, vote_type')
        .eq('target_type', 'post')
        .in('target_id', allPostIds)

      if (!voteError && voteCounts) {
        enrichedData = data.map(post => {
          const postVotes = voteCounts.filter(vote => vote.target_id === post.id)
          const like_count = postVotes.filter(vote => vote.vote_type === 'up').length
          const dislike_count = postVotes.filter(vote => vote.vote_type === 'down').length
          
          // Reply'ler için de like/dislike sayılarını hesapla
          let enrichedReplies = post.replies
          if (post.replies && post.replies.length > 0) {
            enrichedReplies = post.replies.map(reply => {
              const replyVotes = voteCounts.filter(vote => vote.target_id === reply.id)
              const reply_like_count = replyVotes.filter(vote => vote.vote_type === 'up').length
              const reply_dislike_count = replyVotes.filter(vote => vote.vote_type === 'down').length
              
              return {
                ...reply,
                like_count: reply_like_count,
                dislike_count: reply_dislike_count
              }
            })
          }
          
          return {
            ...post,
            like_count,
            dislike_count,
            replies: enrichedReplies
          } as any
        })
      }
    }

    return NextResponse.json({
      data: enrichedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    const { content, topic_id, parent_id } = body

    // Get user info for author info
    const author_name = user.full_name || user.email?.split('@')[0] || 'Anonim Kullanıcı'
    const author_avatar = user.avatar_url || null

    // Validation
    if (!content || !topic_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (content.length < 1 || content.length > 5000) {
      return NextResponse.json({ error: 'Content must be between 1 and 5000 characters' }, { status: 400 })
    }

    // Check if topic exists and is not locked
    const { data: topic, error: topicError } = await supabase
      .from('forum_topics')
      .select('id, is_locked')
      .eq('id', topic_id)
      .single()

    if (topicError || !topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    if (topic.is_locked) {
      return NextResponse.json({ error: 'Topic is locked' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        content,
        topic_id,
        parent_id: parent_id || null,
        author_name,
        author_avatar,
        author_id: user.user_id,
        vote_score: 0,
        is_edited: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    // Update topic reply count and last reply time
    await supabase.rpc('increment_reply_count', { topic_id })
    await supabase
      .from('forum_topics')
      .update({ last_reply_at: new Date().toISOString() })
      .eq('id', topic_id)

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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
    const post_id = searchParams.get('post_id')

    if (!post_id) {
      return NextResponse.json({ error: 'Missing post_id parameter' }, { status: 400 })
    }

    // Check if post exists and belongs to the user
    const { data: post, error: postError } = await supabase
      .from('forum_posts')
      .select('id, author_id, topic_id')
      .eq('id', post_id)
      .single()

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.author_id !== user.user_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete the post
    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', post_id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }

    // Update topic reply count
    await supabase.rpc('decrement_reply_count', { topic_id: post.topic_id })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 