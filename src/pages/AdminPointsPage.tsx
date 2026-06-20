import { useEffect, useState } from 'react'
import { approvePointRequest, getAllPointRequests, rejectPointRequest } from '../api/point'
import type { PointRequest, PointRequestStatus } from '../types'

const FILTERS: { value: PointRequestStatus | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'PENDING', label: '대기' },
  { value: 'APPROVED', label: '승인' },
  { value: 'REJECTED', label: '거절' },
]

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PENDING: { label: '대기', cls: 'bg-amber-100 text-amber-700' },
  APPROVED: { label: '승인', cls: 'bg-green-100 text-green-700' },
  REJECTED: { label: '거절', cls: 'bg-red-100 text-red-600' },
}

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

  const pending = requests.filter((r) => r.status === 'PENDING').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">포인트 충전 관리</h1>
          {pending > 0 && (
            <p className="text-sm text-amber-600 font-medium mt-1">대기 중인 요청 {pending}건</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer border ${
              filter === value
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-sm">요청 내역이 없습니다.</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-5 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {['사용자', '금액', '상태', '요청일', '처리'].map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
            <div className="divide-y divide-slate-100">
              {requests.map((r) => (
                <div key={r.id} className="grid grid-cols-5 px-6 py-4 items-center hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{r.userName}</p>
                    <p className="text-xs text-slate-400">{r.userId}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{r.amount.toLocaleString()}P</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${STATUS_MAP[r.status].cls}`}>
                    {STATUS_MAP[r.status].label}
                  </span>
                  <span className="text-xs text-slate-500">{new Date(r.requestedAt).toLocaleDateString('ko-KR')}</span>
                  <div>
                    {r.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={async () => { await approvePointRequest(r.id); load() }}
                          className="text-xs font-semibold bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-none"
                        >
                          승인
                        </button>
                        <button
                          onClick={async () => { await rejectPointRequest(r.id); load() }}
                          className="text-xs font-semibold bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-none"
                        >
                          거절
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
