import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMe } from '../api/auth'
import { getMyPointRequests } from '../api/point'
import { useAuthStore } from '../store/authStore'
import type { PointRequest } from '../types'

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PENDING: { label: '검토 중', cls: 'bg-amber-100 text-amber-700' },
  APPROVED: { label: '승인', cls: 'bg-green-100 text-green-700' },
  REJECTED: { label: '거절', cls: 'bg-red-100 text-red-600' },
}

export default function MyPointsPage() {
  const { user, setUser } = useAuthStore()
  const [requests, setRequests] = useState<PointRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMyPointRequests(), getMe()])
      .then(([reqs, me]) => { setRequests(reqs); setUser(me) })
      .finally(() => setLoading(false))
  }, [setUser])

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-slate-900">포인트</h1>
        <Link to="/my/points/request">
          <button className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer">
            + 충전 요청
          </button>
        </Link>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl p-7 text-white mb-6">
        <p className="text-slate-400 text-sm mb-1">보유 포인트</p>
        <p className="text-5xl font-black">
          {user?.point.toLocaleString()}
          <span className="text-blue-400 text-2xl ml-1 font-bold">P</span>
        </p>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">충전 요청 내역</h2>
        </div>
        {requests.length === 0 ? (
          <div className="text-center py-14 text-slate-400">
            <p className="text-4xl mb-3">💳</p>
            <p className="text-sm">충전 요청 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.map((r) => (
              <div key={r.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{r.amount.toLocaleString()}P</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(r.requestedAt).toLocaleDateString('ko-KR')}
                    {r.processedAt && ` → ${new Date(r.processedAt).toLocaleDateString('ko-KR')}`}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_MAP[r.status].cls}`}>
                  {STATUS_MAP[r.status].label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
