import { useEffect, useState } from 'react'
import { getMyApplications, getMyMemberships, getMyPaymentHistory, payMonthly } from '../api/team'
import { useAuthStore } from '../store/authStore'
import type { MyMembership, TeamApplication, TeamPayment } from '../types'

export default function MyTeamPage() {
  const { user, setUser } = useAuthStore()
  const [memberships, setMemberships] = useState<MyMembership[]>([])
  const [applications, setApplications] = useState<TeamApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [paying, setPaying] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [histories, setHistories] = useState<Record<number, TeamPayment[]>>({})
  const [histLoading, setHistLoading] = useState<number | null>(null)

  const load = async () => {
    setApiError(null)
    try {
      const [membershipsData, applicationsData] = await Promise.all([
        getMyMemberships(),
        getMyApplications(),
      ])
      setMemberships(membershipsData)
      setApplications(applicationsData.filter((a) => a.status !== 'APPROVED'))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setApiError(msg ?? '데이터를 불러오는데 실패했습니다.')
    }
  }

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const handlePay = async (teamId: number) => {
    setPaying(teamId)
    try {
      await payMonthly(teamId)
      const { getMe } = await import('../api/auth')
      getMe().then((u) => setUser(u))
      await load()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      alert(msg ?? '납부에 실패했습니다.')
    } finally {
      setPaying(null)
    }
  }

  const handleToggleHistory = async (teamId: number) => {
    if (expanded === teamId) {
      setExpanded(null)
      return
    }
    setExpanded(teamId)
    if (!histories[teamId]) {
      setHistLoading(teamId)
      getMyPaymentHistory(teamId)
        .then((data) => setHistories((prev) => ({ ...prev, [teamId]: data })))
        .finally(() => setHistLoading(null))
    }
  }

  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth() + 1

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-slate-900">내 팀</h1>
        {user && (
          <span className="text-sm text-slate-500">
            보유 포인트 <span className="font-bold text-blue-600">{user.point.toLocaleString()}P</span>
          </span>
        )}
      </div>

      {/* 소속 팀 (승인된 멤버십) */}
      {memberships.length > 0 && (
        <div className="mb-8 space-y-4">
          {memberships.map((m) => {
            const isPaid = m.thisMonthStatus === 'PAID'
            const isFailed = m.thisMonthStatus === 'FAILED'

            return (
              <div key={m.teamId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                          {m.coachName} 감독
                        </span>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                          활성 멤버
                        </span>
                      </div>
                      <h2 className="font-black text-slate-900 text-lg">{m.teamName}</h2>
                      <p className="text-sm text-slate-500 mt-0.5">
                        월 정액{' '}
                        <span className="font-semibold text-slate-700">{m.monthlyPointCost.toLocaleString()}P</span>
                        <span className="mx-2 text-slate-300">·</span>
                        {new Date(m.joinedAt).toLocaleDateString('ko-KR')} 가입
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-slate-400 mb-1.5">
                        {thisYear}년 {thisMonth}월 회비
                      </p>
                      {isPaid ? (
                        <span className="inline-block text-xs font-semibold bg-green-50 text-green-600 px-3 py-1.5 rounded-lg">
                          납부 완료
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePay(m.teamId)}
                          disabled={paying === m.teamId}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                            isFailed
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-slate-900 hover:bg-slate-700 text-white'
                          }`}
                        >
                          {paying === m.teamId
                            ? '처리 중...'
                            : isFailed
                              ? '재납부하기'
                              : '회비 납부하기'}
                        </button>
                      )}
                      {isPaid && m.thisMonthPaidAt && (
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(m.thisMonthPaidAt).toLocaleDateString('ko-KR')}
                        </p>
                      )}
                      {isFailed && (
                        <p className="text-xs text-red-400 mt-1">자동납부 실패 (포인트 부족)</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100">
                  <button
                    onClick={() => handleToggleHistory(m.teamId)}
                    className="w-full flex items-center justify-between px-6 py-3 text-sm text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="font-medium">납부 이력</span>
                    <span className="text-slate-400">{expanded === m.teamId ? '▲' : '▼'}</span>
                  </button>

                  {expanded === m.teamId && (
                    <div className="px-6 pb-4">
                      {histLoading === m.teamId ? (
                        <div className="flex justify-center py-6">
                          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : !histories[m.teamId] || histories[m.teamId].length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-6">납부 이력이 없습니다.</p>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                              <th className="pb-2 font-semibold">기간</th>
                              <th className="pb-2 font-semibold">금액</th>
                              <th className="pb-2 font-semibold">상태</th>
                              <th className="pb-2 font-semibold">납부일</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {histories[m.teamId].map((p) => (
                              <tr key={p.id}>
                                <td className="py-2.5 text-slate-700 font-medium">
                                  {p.year}년 {p.month}월
                                </td>
                                <td className="py-2.5 text-slate-700">{p.amount.toLocaleString()}P</td>
                                <td className="py-2.5">
                                  {p.status === 'PAID' ? (
                                    <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-semibold">
                                      완료
                                    </span>
                                  ) : (
                                    <span className="text-xs px-2 py-0.5 bg-red-50 text-red-500 rounded-full font-semibold">
                                      실패
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 text-slate-400 text-xs">
                                  {new Date(p.paidAt).toLocaleDateString('ko-KR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 신청 중인 팀 (PENDING / REJECTED) */}
      {applications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">신청 중인 팀</h2>
          <div className="space-y-3">
            {applications.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{a.teamName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(a.appliedAt).toLocaleDateString('ko-KR')} 신청
                  </p>
                </div>
                {a.status === 'PENDING' ? (
                  <span className="text-xs font-semibold bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg flex-shrink-0">
                    승인 대기 중
                  </span>
                ) : (
                  <span className="text-xs font-semibold bg-slate-100 text-slate-400 px-3 py-1.5 rounded-lg flex-shrink-0">
                    거절됨
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-4 text-red-600 text-sm">
          {apiError}
        </div>
      )}

      {!apiError && memberships.length === 0 && applications.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 text-center py-20 text-slate-400">
          <p className="text-5xl mb-4">🏒</p>
          <p className="font-medium">소속된 팀이 없습니다.</p>
          <p className="text-sm mt-1">팀 목록에서 가입 신청을 해보세요.</p>
        </div>
      )}
    </div>
  )
}
