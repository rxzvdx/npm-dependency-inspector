import type { Scorecard } from '@/types'

const REGISTRY = 'https://registry.npmjs.org'
const DL_API   = 'https://api.npmjs.org/downloads/point/last-week'
const PROXY    = 'https://cors.isomorphic-git.org/'

// helper: detect JSON
function isJson(res: Response) {
  return (res.headers.get('content-type') || '').includes('application/json')
}
async function getJsonOrThrow(res: Response) {
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${res.statusText}. Body: ${body.slice(0,160)}…`)
  }
  if (!isJson(res)) {
    const body = await res.text().catch(() => '')
    throw new Error(`Expected JSON, got ${(res.headers.get('content-type')||'unknown')} -> ${body.slice(0,160)}…`)
  }
  return res.json()
}
// try direct; if not JSON, retry via proxy
async function fetchJsonWithFallback(url: string) {
  try {
    const direct = await fetch(url, { mode: 'cors' })
    if (direct.ok && isJson(direct)) return direct.json()
    // read text solely to include in the error message
    const sample = await direct.text().catch(() => '')
    console.warn('Direct fetch returned non-JSON; falling back to proxy:', sample.slice(0,120))
    // fall through to proxy
  } catch (e) {
    console.warn('Direct fetch failed; falling back to proxy:', e)
  }
  const proxied = await fetch(PROXY + url, { mode: 'cors' })
  return getJsonOrThrow(proxied)
}

function iso(d?: string|number|Date|null) {
  if (!d) return null
  const x = new Date(d)
  return isNaN(x.getTime()) ? null : x.toISOString()
}

export async function fetchScorecard(pkg: string): Promise<Scorecard> {
  const raw = pkg.trim()
  if (!raw) throw new Error('Package name is required')

  // ✅ normalize for npm registry (case-insensitive lookups)
  const name = raw.toLowerCase()

  const meta = await fetchJsonWithFallback(`${REGISTRY}/${encodeURIComponent(name)}`)

  let weeklyDownloads: number | null = null
  try {
    const dl = await fetchJsonWithFallback(`${DL_API}/${encodeURIComponent(name)}`)
    if (typeof dl.downloads === 'number') weeklyDownloads = dl.downloads
  } catch {
    // keep downloads as null; not fatal
  }

  const latest: string | undefined = meta['dist-tags']?.latest
  const v = latest && meta.versions?.[latest]

  const license =
    v?.license ? (typeof v.license === 'string' ? v.license : v.license.type ?? null) : null
  const dependencyCount = v?.dependencies ? Object.keys(v.dependencies).length : null
  const unpackedSize = typeof v?.dist?.unpackedSize === 'number' ? v.dist.unpackedSize : null

  let lastPublish: string | null = null
  if (meta.time) lastPublish = iso(meta.time.modified || (latest ? meta.time[latest] : null))

  return {
    name: meta.name || name, // meta.name is already lowercase; fallback to normalized input
    version: latest || meta.version || 'unknown',
    license,
    weeklyDownloads,
    dependencyCount,
    unpackedSize,
    lastPublish,
  }
}

export function formatBytes(n?: number | null) {
  if (n == null) return '—'
  const u = ['B','KB','MB','GB','TB']
  let i = 0, v = n
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++ }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${u[i]}`
}
