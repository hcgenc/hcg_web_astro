export async function fetchBlogPosts() {
  const res = await fetch('/api/blog-posts')
  return res.json()
}

export async function fetchBlogPost(slug: string) {
  const res = await fetch(`/api/blog-posts?slug=${encodeURIComponent(slug)}`)
  return res.json()
}

export async function fetchDailyShares() {
  const res = await fetch('/api/daily-shares')
  return res.json()
}
