import { useState } from 'react'
import ScorecardView from '@/components/Scorecard'
import { fetchScorecard } from '@/lib/npm'
import './index.css'
import { Scorecard } from '@/types'

export default function App() {
  const [pkg, setPkg] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)   
  const [data, setData] = useState<Scorecard | null>(null)

  // request id to ignore stale responses
  const [reqId, setReqId] = useState(0)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setData(null) // clear prior result 

    const myId = reqId + 1
    setReqId(myId)

    try {
      const res = await fetchScorecard(pkg)
      // only accept the latest response
      if (myId === reqId + 1) setData(res)
    } catch (err: unknown) {
      if (myId === reqId + 1) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        setData(null)
      }
    } finally {
      if (myId === reqId + 1) setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>NPM Package Dependency Inspector</h1>
        <p className="small">Enter a public NPM package name to view a quick scorecard.</p>
        <form onSubmit={onSubmit} className="inputRow" style={{ marginTop: 12 }}>
          <input
            type="text"
            placeholder="e.g. react, lodash, vite"
            value={pkg}
            onChange={(e) => setPkg(e.target.value)}
          />
          <button disabled={loading}>{loading ? 'Fetching…' : 'Inspect'}</button>
        </form>
        {error && <p className="error" style={{ marginTop: 12 }}>{error}</p>}
        {data && (
          <div style={{ marginTop: 16 }}>
            <ScorecardView data={data} />
          </div>
        )}
        <div className="footer">Sources: registry.npmjs.org • api.npmjs.org</div>
      </div>
    </div>
  )
}
