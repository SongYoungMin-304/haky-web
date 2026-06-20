import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createBooking } from '../api/booking'
import { getClass } from '../api/hakyClass'
import { getMe } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import type { HakyClass } from '../types'

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [hakyClass, setHakyClass] = useState<HakyClass | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getClass(Number(id))
      .then(setHakyClass)
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    if (!hakyClass) return
    if (user.point < hakyClass.pointCost) {
      navigate('/my/points/request')
      return
    }
    setBooking(true)
    setMessage('')
    try {
      await createBooking(hakyClass.id)
      const updated = await getMe()
      setUser(updated)
      setMessage('신청이 완료되었습니다!')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setMessage(msg ?? '신청에 실패했습니다.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <p>로딩 중...</p>
  if (!hakyClass) return <p>클래스를 찾을 수 없습니다.</p>

  return (
    <div style={{ maxWidth: 640 }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', marginBottom: 16 }}>
        ← 목록으로
      </button>
      <h2>{hakyClass.title}</h2>
      <p style={{ color: '#666' }}>감독: {hakyClass.coachName}</p>
      <p style={{ color: '#555', lineHeight: 1.6 }}>{hakyClass.description}</p>
      <div style={{ display: 'flex', gap: 32, margin: '20px 0', flexWrap: 'wrap' }}>
        <div>
          <p style={{ color: '#888', fontSize: 12, margin: '0 0 4px' }}>일정</p>
          <p style={{ margin: 0, fontWeight: 600 }}>{new Date(hakyClass.schedule).toLocaleString('ko-KR')}</p>
        </div>
        <div>
          <p style={{ color: '#888', fontSize: 12, margin: '0 0 4px' }}>정원</p>
          <p style={{ margin: 0, fontWeight: 600 }}>{hakyClass.capacity}명</p>
        </div>
        <div>
          <p style={{ color: '#888', fontSize: 12, margin: '0 0 4px' }}>포인트</p>
          <p style={{ margin: 0, fontWeight: 600, color: '#1a1a2e' }}>{hakyClass.pointCost.toLocaleString()}P</p>
        </div>
      </div>
      {user?.role === 'USER' && (
        <>
          {user.point < hakyClass.pointCost && (
            <p style={{ color: '#e74c3c', fontSize: 14 }}>
              포인트가 부족합니다. (보유: {user.point.toLocaleString()}P)
            </p>
          )}
          <button
            onClick={handleBook}
            disabled={booking}
            style={{
              padding: '12px 32px',
              background: '#1a1a2e',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            {booking ? '처리 중...' : user.point < hakyClass.pointCost ? '포인트 충전하기' : '신청하기'}
          </button>
        </>
      )}
      {!user && (
        <button
          onClick={() => navigate('/login')}
          style={{ padding: '12px 32px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer' }}
        >
          로그인 후 신청
        </button>
      )}
      {message && (
        <p style={{ marginTop: 12, color: message.includes('완료') ? '#27ae60' : '#e74c3c' }}>{message}</p>
      )}
    </div>
  )
}
