import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyPointRequests } from '../api/point'
import { getMe } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import type { PointRequest } from '../types'

const STATUS_LABEL: Record<string, string> = {
  PENDING: '대기',
  APPROVED: '승인',
  REJECTED: '거절',
}
const STATUS_COLOR: Record<string, string> = {
  PENDING: '#f39c12',
  APPROVED: '#27ae60',
  REJECTED: '#e74c3c',
}

export default function MyPointsPage() {
  const { user, setUser } = useAuthStore()
  const [requests, setRequests] = useState<PointRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMyPointRequests(), getMe()])
      .then(([reqs, me]) => {
        setRequests(reqs)
        setUser(me)
      })
      .finally(() => setLoading(false))
  }, [setUser])

  if (loading) return <p>로딩 중...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0 }}>포인트</h2>
          <p style={{ color: '#666', marginTop: 4 }}>보유 포인트: <strong>{user?.point.toLocaleString()}P</strong></p>
        </div>
        <Link to="/my/points/request" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '8px 20px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            충전 요청
          </button>
        </Link>
      </div>
      <h3>충전 요청 내역</h3>
      {requests.length === 0 && <p style={{ color: '#888' }}>충전 요청 내역이 없습니다.</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
            <th style={th}>금액</th>
            <th style={th}>상태</th>
            <th style={th}>요청일</th>
            <th style={th}>처리일</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={td}>{r.amount.toLocaleString()}P</td>
              <td style={td}>
                <span style={{ color: STATUS_COLOR[r.status], fontWeight: 600 }}>{STATUS_LABEL[r.status]}</span>
              </td>
              <td style={td}>{new Date(r.requestedAt).toLocaleDateString('ko-KR')}</td>
              <td style={td}>{r.processedAt ? new Date(r.processedAt).toLocaleDateString('ko-KR') : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const th: React.CSSProperties = { padding: '10px 8px', fontSize: 13, color: '#888' }
const td: React.CSSProperties = { padding: '12px 8px', fontSize: 14 }
