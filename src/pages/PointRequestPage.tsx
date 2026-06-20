import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPointRequest } from '../api/point'

const ACCOUNT = { bank: '국민은행', number: '123-456-789012', holder: '하키운영팀' }

export default function PointRequestPage() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const num = Number(amount)
    if (!num || num < 1) { setError('1 이상의 금액을 입력해주세요.'); return }
    setLoading(true)
    setError('')
    try {
      await createPointRequest(num)
      setSubmitted(true)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? '요청에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 480 }}>
        <h2>입금 안내</h2>
        <div style={{ background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 10, padding: 24, marginBottom: 20 }}>
          <p style={{ margin: '0 0 8px' }}><strong>은행:</strong> {ACCOUNT.bank}</p>
          <p style={{ margin: '0 0 8px' }}><strong>계좌번호:</strong> {ACCOUNT.number}</p>
          <p style={{ margin: '0 0 8px' }}><strong>예금주:</strong> {ACCOUNT.holder}</p>
          <p style={{ margin: 0, color: '#e74c3c', fontSize: 13 }}>입금 확인 후 관리자가 수동으로 포인트를 충전합니다.</p>
        </div>
        <button
          onClick={() => navigate('/my/points')}
          style={{ padding: '10px 24px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          내역 확인
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <h2 style={{ marginBottom: 24 }}>포인트 충전 요청</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: 14, color: '#555' }}>충전할 금액 (원 = 포인트)</label>
        <input
          type="number"
          placeholder="예: 10000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={1}
          required
          style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
        />
        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: '10px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 15 }}>
          {loading ? '처리 중...' : '요청하기'}
        </button>
      </form>
    </div>
  )
}
