import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    const id = searchParams.get('id')
    const category_id = searchParams.get('category_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sort = searchParams.get('sort') || 'latest' // latest, popular, oldest

    // Eğer id varsa, tek topic döndür
    if (id) {
      const { data: topic, error } = await supabase
        .from('forum_topics')
        .select(`
          id,
          title,
          content,
          category_id,
          author_id,
          author_name,
          author_avatar,
          is_pinned,
          is_locked,
          view_count,
          reply_count,
          vote_score,
          created_at,
          updated_at,
          last_reply_at,
          forum_categories (
            id,
            name,
            color
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
      }

      // Bu tek topic için like ve dislike sayılarını hesapla
      const { data: voteCounts, error: voteError } = await supabase
        .from('forum_votes')
        .select('vote_type')
        .eq('target_type', 'topic')
        .eq('target_id', id)

      let enrichedTopic = topic
      if (!voteError && voteCounts) {
        const like_count = voteCounts.filter(vote => vote.vote_type === 'up').length
        const dislike_count = voteCounts.filter(vote => vote.vote_type === 'down').length
        
        enrichedTopic = {
          ...topic,
          like_count,
          dislike_count
        } as any
      }

      return NextResponse.json(enrichedTopic)
    }
    
    let query = supabase
      .from('forum_topics')
      .select(`
        id,
        title,
        content,
        category_id,
        author_id,
        author_name,
        author_avatar,
        is_pinned,
        is_locked,
        view_count,
        reply_count,
        vote_score,
        created_at,
        updated_at,
        last_reply_at,
        forum_categories (
          id,
          name,
          color
        )
      `)

    // Category filter
    if (category_id) {
      query = query.eq('category_id', category_id)
    }

    // Sorting
    switch (sort) {
      case 'popular':
        query = query.order('vote_score', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'latest':
      default:
        query = query.order('is_pinned', { ascending: false })
                     .order('last_reply_at', { ascending: false })
        break
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch forum topics' }, { status: 500 })
    }

    // Like ve dislike sayılarını hesapla
    let enrichedData = data
    if (data && data.length > 0) {
      const topicIds = data.map(topic => topic.id)
      
      // Her topic için like ve dislike sayılarını çek
      const { data: voteCounts, error: voteError } = await supabase
        .from('forum_votes')
        .select('target_id, vote_type')
        .eq('target_type', 'topic')
        .in('target_id', topicIds)

      if (!voteError && voteCounts) {
        enrichedData = data.map(topic => {
          const topicVotes = voteCounts.filter(vote => vote.target_id === topic.id)
          const like_count = topicVotes.filter(vote => vote.vote_type === 'up').length
          const dislike_count = topicVotes.filter(vote => vote.vote_type === 'down').length
          
          return {
            ...topic,
            like_count,
            dislike_count
          }
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
    const { title, content, category_id } = body

    // Get user info for author info
    const author_name = user.full_name || user.email?.split('@')[0] || 'Anonim Kullanıcı'
    const author_avatar = user.avatar_url || null

    // Validation
    if (!title || !content || !category_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (title.length < 5 || title.length > 200) {
      return NextResponse.json({ error: 'Title must be between 5 and 200 characters' }, { status: 400 })
    }

    if (content.length < 10 || content.length > 10000) {
      return NextResponse.json({ error: 'Content must be between 10 and 10000 characters' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('forum_topics')
      .insert({
        title,
        content,
        category_id,
        author_name,
        author_avatar,
        author_id: user.user_id,
        view_count: 0,
        reply_count: 0,
        vote_score: 0,
        is_pinned: false,
        is_locked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_reply_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 })
    }

    // Update category topic count
    await supabase.rpc('increment_topic_count', { category_id })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    const topic_id = searchParams.get('topic_id')
    const author_name = searchParams.get('author_name')

    if (!topic_id || !author_name) {
      return NextResponse.json({ error: 'Missing topic_id or author_name' }, { status: 400 })
    }

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
    const currentUserName = user.full_name || user.email?.split('@')[0] || 'Anonim Kullanıcı'

    // Check if user is the author
    if (currentUserName !== author_name) {
      return NextResponse.json({ error: 'You can only delete your own topics' }, { status: 403 })
    }

    // Get topic to check category for count update
    const { data: topic, error: topicError } = await supabase
      .from('forum_topics')
      .select('category_id')
      .eq('id', topic_id)
      .eq('author_name', author_name)
      .single()

    if (topicError || !topic) {
      return NextResponse.json({ error: 'Topic not found or not authorized' }, { status: 404 })
    }

    // Delete related votes first
    await supabase
      .from('forum_votes')
      .delete()
      .eq('target_type', 'topic')
      .eq('target_id', topic_id)

    // Delete related posts
    await supabase
      .from('forum_posts')
      .delete()
      .eq('topic_id', topic_id)

    // Delete the topic
    const { error } = await supabase
      .from('forum_topics')
      .delete()
      .eq('id', topic_id)
      .eq('author_name', author_name)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 })
    }

    // Update category topic count
    await supabase.rpc('decrement_topic_count', { category_id: topic.category_id })

    return NextResponse.json({ message: 'Topic deleted successfully' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 