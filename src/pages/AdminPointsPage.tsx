import { useEffect, useState } from 'react'
import { approvePointRequest, getAllPointRequests, rejectPointRequest } from '../api/point'
import type { PointRequest, PointRequestStatus } from '../types'

const STATUS_LABEL: Record<string, string> = { PENDING: '대기', APPROVED: '승인', REJECTED: '거절' }
const STATUS_COLOR: Record<string, string> = { PENDING: '#f39c12', APPROVED: '#27ae60', REJECTED: '#e74c3c' }

export default function AdminPointsPage() {
  const [requests, setRequests] = useState<PointRequest[]>([])
  const [filter, setFilter] = useState<PointRequestStatus | ''>('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getAllPointRequests(filter || undefined)
      .then(setRequests)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filter])

  const handleApprove = async (id: number) => {
    await approvePointRequest(id)
    load()
  }
  const handleReject = async (id: number) => {
    await rejectPointRequest(id)
    load()
  }

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>포인트 충전 관리</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: '1px solid #ddd',
              cursor: 'pointer',
              background: filter === s ? '#1a1a2e' : 'white',
              color: filter === s ? 'white' : '#555',
              fontSize: 13,
            }}
          >
            {s === '' ? '전체' : STATUS_LABEL[s]}
          </button>
        ))}
      </div>
      {loading ? <p>로딩 중...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              {['사용자', '금액', '상태', '요청일', '처리'].map((h) => (
                <th key={h} style={{ padding: '10px 8px', fontSize: 13, color: '#888' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={td}>{r.userName}</td>
                <td style={td}>{r.amount.toLocaleString()}P</td>
                <td style={td}>
                  <span style={{ color: STATUS_COLOR[r.status], fontWeight: 600 }}>{STATUS_LABEL[r.status]}</span>
                </td>
                <td style={td}>{new Date(r.requestedAt).toLocaleDateString('ko-KR')}</td>
                <td style={td}>
                  {r.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleApprove(r.id)} style={{ padding: '4px 12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                        승인
                      </button>
                      <button onClick={() => handleReject(r.id)} style={{ padding: '4px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                        거절
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const td: React.CSSProperties = { padding: '12px 8px', fontSize: 14 }
