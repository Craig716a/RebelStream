export type LegalMediaMatch = {
  url: string
  title: string
  source: "Internet Archive"
  identifier: string
}

type ArchiveDoc = {
  identifier?: string
  title?: string
  description?: string
  rights?: string
}

type ArchiveFile = { name?: string; format?: string; size?: string }

const ARCHIVE_SEARCH = "https://archive.org/advancedsearch.php"
const ARCHIVE_METADATA = "https://archive.org/metadata"

function cleanTitle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
}

function isAllowedRights(doc: ArchiveDoc) {
  const rights = `${doc.rights ?? ""} ${doc.description ?? ""}`.toLowerCase()
  return /public domain|creative commons|cc0|no known copyright/.test(rights)
}

export async function findLegalArchiveVideo(title: string): Promise<LegalMediaMatch | null> {
  const query = encodeURIComponent(`title:"${title.replace(/"/g, "")}" AND mediatype:movies`)
  const searchResponse = await fetch(`${ARCHIVE_SEARCH}?q=${query}&fl[]=identifier&fl[]=title&rows=10&output=json`, { next: { revalidate: 3600 } })
  if (!searchResponse.ok) return null
  const search = (await searchResponse.json()) as { response?: { docs?: ArchiveDoc[] } }
  const requested = cleanTitle(title)

  for (const doc of search.response?.docs ?? []) {
    if (!doc.identifier || !doc.title || cleanTitle(doc.title) !== requested) continue
    const metadataResponse = await fetch(`${ARCHIVE_METADATA}/${encodeURIComponent(doc.identifier)}`, { next: { revalidate: 3600 } })
    if (!metadataResponse.ok) continue
    const metadata = (await metadataResponse.json()) as { metadata?: ArchiveDoc; files?: ArchiveFile[] }
    if (!isAllowedRights(metadata.metadata ?? doc)) continue
    const file = (metadata.files ?? []).find((item) => {
      const name = item.name?.toLowerCase() ?? ""
      return (item.format?.toLowerCase() === "mpeg4" || name.endsWith(".mp4")) && !name.includes("_h264_")
    })
    if (!file?.name) continue
    return {
      url: `https://archive.org/download/${encodeURIComponent(doc.identifier)}/${file.name.split("/").map(encodeURIComponent).join("/")}`,
      title: doc.title,
      source: "Internet Archive",
      identifier: doc.identifier,
    }
  }
  return null
}

const SAMPLE_MP4S = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://media.w3.org/2010/05/bunny/trailer.mp4",
]

export function sampleMediaUrl(id: number) {
  return SAMPLE_MP4S[Math.abs(id) % SAMPLE_MP4S.length]
}

export function legalMediaUnavailableMessage(title: string) {
  return `No verified public-domain or Creative Commons video was found for “${title}”. Paste a licensed direct MP4 or HLS URL below to play it.`
}
