/**
 * YouTube helpers: Data API v3 search (optional key) + noembed metadata (no key).
 */

const NOEMBED = 'https://noembed.com/embed'

/**
 * @returns {string | undefined}
 */
export function getYouTubeApiKey() {
  const k = import.meta.env.VITE_YOUTUBE_API_KEY
  return typeof k === 'string' && k.trim() ? k.trim() : undefined
}

/**
 * @param {string} videoId
 * @returns {Promise<{ videoId: string; title: string; channelTitle: string; thumbnailUrl: string }>}
 */
export async function fetchNoEmbedVideoMeta(videoId) {
  const watch = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`
  const res = await fetch(`${NOEMBED}?url=${encodeURIComponent(watch)}`)
  if (!res.ok) throw new Error(`noembed ${res.status}`)
  const j = await res.json()
  if (j.error) throw new Error(String(j.error))
  return {
    videoId,
    title: j.title ?? 'YouTube video',
    channelTitle: j.author_name ?? 'YouTube',
    thumbnailUrl: j.thumbnail_url ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  }
}

/**
 * @param {string} query
 * @param {number} [maxResults]
 * @returns {Promise<Array<{ videoId: string; title: string; channelTitle: string; thumbnailUrl: string; description: string }>>}
 */
export async function searchYouTubeVideos(query, maxResults = 6) {
  const key = getYouTubeApiKey()
  if (!key) throw new Error('NO_YOUTUBE_KEY')

  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    maxResults: String(Math.min(15, Math.max(1, maxResults))),
    q: query,
    key,
  })

  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`)
  if (!res.ok) {
    const err = await res.text().catch(() => '')
    throw new Error(`YouTube API ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  const items = data.items ?? []

  return items
    .map((it) => {
      const id = it.id?.videoId
      if (!id) return null
      const sn = it.snippet ?? {}
      const thumbs = sn.thumbnails ?? {}
      const thumb =
        thumbs.high?.url ?? thumbs.medium?.url ?? thumbs.default?.url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
      return {
        videoId: id,
        title: sn.title ?? 'Video',
        channelTitle: sn.channelTitle ?? 'YouTube',
        thumbnailUrl: thumb,
        description: sn.description ?? '',
      }
    })
    .filter(Boolean)
}
