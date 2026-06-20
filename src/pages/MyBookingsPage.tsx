import { useEffect, useState } from 'react'
import { cancelBooking, getMyBookings } from '../api/booking'
import type { Booking } from '../types'

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const load = () =>
    getMyBookings()
      .then(setBookings)
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleCancel = async (id: number) => {
    if (!window.confirm('신청을 취소하시겠습니까? 포인트가 환불됩니다.')) return
    await cancelBooking(id)
    load()
  }

  if (loading) return <p>로딩 중...</p>

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>내 신청 내역</h2>
      {bookings.length === 0 && <p style={{ color: '#888' }}>신청한 클래스가 없습니다.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bookings.map((b) => (
          <div key={b.id} style={{ border: '1px solid #e0e0e0', borderRadius: 10, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{b.classTitle}</p>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: '#666' }}>결제 포인트: {b.usedPoint.toLocaleString()}P</p>
              <p style={{ margin: 0, fontSize: 12, color: '#999' }}>신청일: {new Date(b.bookedAt).toLocaleDateString('ko-KR')}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: b.status === 'CONFIRMED' ? '#27ae60' : '#999' }}>
                {b.status === 'CONFIRMED' ? '신청 완료' : '취소됨'}
              </span>
              {b.status === 'CONFIRMED' && (
                <button
                  onClick={() => handleCancel(b.id)}
                  style={{ padding: '6px 14px', border: '1px solid #e74c3c', background: 'white', color: '#e74c3c', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
                >
                  취소
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
