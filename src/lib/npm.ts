import type { Scorecard } from "@/types"

const REGISTRY = 'https://registry.npmjs.org'
const DL_API = 'https://api.npmjs.org/downloads/point/last-week'

function formatISO(d?: string | number | Date | null) {
    if (!d) return null
    const dt = new Date(d)
    if (isNaN(dt.getTime())) return null
    return dt.toISOString()
}

export async function fetchScorecard(pkg: string): Promise<Scorecard> {
    const pkgName = pkg.trim()
    if (!pkgName) throw new Error('Package name is required')

    const [metaRes, dlRes] = await Promise.all([
        fetch('${REGISTRY}/${encodeURIComponent(pkgName)}'),
        fetch('${DL_API}/${encodeURIComponent(pkgName)}')
    ])

    if (!metaRes.ok) {
        const t = await metaRes.text()
        throw new Error('Registry error (${metaRes.status}): ${t}')
    }

    const meta = await metaRes.json()
    const distTags = meta['dist-tags'] || {}
    const latest: string | undefined = distTags.latest

    let license: string | null = null
    let dependencyCount: number | null = null
    let unpackedSize: number | null = null
    let lastPublish: string | null = null

    if (latest && meta.versions && meta.versions[latest]) {
        const v = meta.versions[latest]
        if(v.license) license = typeof v.license === 'string' ? v.license : (v.license.type ?? null)
        if(v.dependencies) dependencyCount = Object.keys(v.dependencies).length
        if(v.dist && typeof v.dist.unpackedSize === 'number') unpackedSize = v.dist.unpackedSize
    }

    
}