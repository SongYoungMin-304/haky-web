import { useEffect, useState } from 'react'
import { cancelBooking, getMyBookings } from '../api/booking'
import { getMyApplications } from '../api/team'
import type { Booking, TeamApplication } from '../types'

type Tab = 'class' | 'team'

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  PENDING: { label: '검토 중', cls: 'bg-amber-50 text-amber-600' },
  APPROVED: { label: '승인됨', cls: 'bg-green-50 text-green-600' },
  REJECTED: { label: '거절됨', cls: 'bg-red-50 text-red-500' },
}

export default function MyBookingsPage() {
  const [tab, setTab] = useState<Tab>('class')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [applications, setApplications] = useState<TeamApplication[]>([])
  const [loading, setLoading] = useState(true)

  const loadAll = () => {
    setLoading(true)
    Promise.all([getMyBookings().then(setBookings), getMyApplications().then(setApplications)]).finally(
      () => setLoading(false),
    )
  }

  useEffect(() => {
    loadAll()
  }, [])

  const handleCancel = async (id: number) => {
    if (!window.confirm('신청을 취소하시겠습니까? 포인트가 환불됩니다.')) return
    await cancelBooking(id)
    loadAll()
  }

  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED')
  const cancelled = bookings.filter((b) => b.status === 'CANCELLED')

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-6">내 신청 내역</h1>

      {/* 탭 */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        <button
          onClick={() => setTab('class')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            tab === 'class' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          클래스 신청
        </button>
        <button
          onClick={() => setTab('team')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            tab === 'team' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          팀 신청
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'class' ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
              신청 완료 ({confirmed.length})
            </h2>
            {confirmed.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 text-center py-12 text-slate-400">
                <p className="text-4xl mb-3">🏒</p>
                <p className="text-sm">신청한 클래스가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {confirmed.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-slate-200 px-6 py-5 flex items-center justify-between shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{b.classTitle}</p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {b.usedPoint.toLocaleString()}P 사용 · {new Date(b.bookedAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        신청 완료
                      </span>
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

          {cancelled.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                취소됨 ({cancelled.length})
              </h2>
              <div className="space-y-3">
                {cancelled.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-slate-100 px-6 py-4 flex items-center justify-between opacity-60"
                  >
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
      ) : (
        <div>
          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 text-center py-12 text-slate-400">
              <p className="text-4xl mb-3">🏒</p>
              <p className="text-sm">신청한 팀이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((a) => {
                const badge = STATUS_LABEL[a.status]
                return (
                  <div
                    key={a.id}
                    className="bg-white rounded-2xl border border-slate-200 px-6 py-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900">{a.teamName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          연락처: {a.phone}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 break-words">{a.message}</p>
                        <p className="text-xs text-slate-400 mt-1.5">
                          {new Date(a.appliedAt).toLocaleDateString('ko-KR')} 신청
                          {a.processedAt && ` · ${new Date(a.processedAt).toLocaleDateString('ko-KR')} 처리`}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
