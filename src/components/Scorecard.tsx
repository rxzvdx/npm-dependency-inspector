import { formatBytes } from '@/lib/npm'
import type { Scorecard } from '@/types'

export default function ScorecardView({ data }: { data: Scorecard }) {
  return (
    <div className="grid">
      <KV k="Package" v={data.name} />
      <KV k="Current Version" v={data.version} />
      <KV k="License" v={data.license ?? '—'} />
      <KV k="Weekly Downloads" v={data.weeklyDownloads?.toLocaleString() ?? '—'} />
      <KV k="Dependencies" v={data.dependencyCount?.toString() ?? '—'} />
      <KV k="Unpacked Size" v={formatBytes(data.unpackedSize)} />
      <KV k="Last Publish" v={data.lastPublish ?? '—'} />
    </div>
  )
}

function KV({ k, v }: { k: string, v: string }) {
  return (
    <div className="tile kv">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
    </div>
  )
}