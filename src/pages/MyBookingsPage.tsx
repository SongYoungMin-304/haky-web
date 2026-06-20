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

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED')
  const cancelled = bookings.filter((b) => b.status === 'CANCELLED')

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-6">내 신청 내역</h1>

      <div className="space-y-6">
        {/* Active */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">신청 완료 ({confirmed.length})</h2>
          {confirmed.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 text-center py-12 text-slate-400">
              <p className="text-4xl mb-3">🏒</p>
              <p className="text-sm">신청한 클래스가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {confirmed.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-200 px-6 py-5 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-bold text-slate-900">{b.classTitle}</p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {b.usedPoint.toLocaleString()}P 사용 · {new Date(b.bookedAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">신청 완료</span>
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors cursor-pointer bg-transparent"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cancelled */}
        {cancelled.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">취소됨 ({cancelled.length})</h2>
            <div className="space-y-3">
              {cancelled.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-100 px-6 py-4 flex items-center justify-between opacity-60">
                  <div>
                    <p className="font-semibold text-slate-700 line-through">{b.classTitle}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {b.usedPoint.toLocaleString()}P 환불 · {new Date(b.cancelledAt!).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-slate-400">취소됨</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
