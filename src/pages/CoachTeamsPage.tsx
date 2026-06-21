import { useEffect, useState } from 'react'
import {
  approveApplication,
  createTeam,
  getApplications,
  getMyTeams,
  getTeamPaymentStatus,
} from '../api/team'
import type { Team, TeamApplication, TeamPaymentStatusResponse } from '../types'

type Tab = 'applications' | 'payments'

export default function CoachTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [tab, setTab] = useState<Tab>('applications')
  const [applications, setApplications] = useState<TeamApplication[]>([])
  const [paymentStatus, setPaymentStatus] = useState<TeamPaymentStatusResponse | null>(null)
  const [paymentYear, setPaymentYear] = useState(new Date().getFullYear())
  const [paymentMonth, setPaymentMonth] = useState(new Date().getMonth() + 1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', monthlyPointCost: 10000 })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    getMyTeams()
      .then((data) => {
        setTeams(data)
        if (data.length > 0) setSelectedTeamId(data[0].id)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedTeamId) return
    if (tab === 'applications') {
      getApplications(selectedTeamId).then(setApplications)
    } else {
      getTeamPaymentStatus(selectedTeamId, paymentYear, paymentMonth).then(setPaymentStatus)
    }
  }, [selectedTeamId, tab, paymentYear, paymentMonth])

  const handleApprove = async (applicationId: number) => {
    if (!selectedTeamId) return
    try {
      await approveApplication(selectedTeamId, applicationId)
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: 'APPROVED' as const } : a)),
      )
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      alert(msg ?? '처리에 실패했습니다.')
    }
  }

  const handleReject = async (applicationId: number) => {
    if (!selectedTeamId) return
    try {
      const { rejectApplication } = await import('../api/team')
      await rejectApplication(selectedTeamId, applicationId)
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: 'REJECTED' as const } : a)),
      )
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      alert(msg ?? '처리에 실패했습니다.')
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const newTeam = await createTeam(form)
      setTeams((prev) => [...prev, newTeam])
      setSelectedTeamId(newTeam.id)
      setShowCreateForm(false)
      setForm({ name: '', description: '', monthlyPointCost: 10000 })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      alert(msg ?? '팀 생성에 실패했습니다.')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-slate-900">내 팀 관리</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          + 팀 생성
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">새 팀 생성</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">팀 이름</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">팀 소개</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">월 정액 (포인트)</label>
              <input
                type="number"
                value={form.monthlyPointCost}
                onChange={(e) => setForm({ ...form, monthlyPointCost: Number(e.target.value) })}
                min={1}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                {creating ? '생성 중...' : '생성하기'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="border border-slate-300 text-slate-700 text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {teams.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-5xl mb-4">🏒</p>
          <p className="font-medium">생성한 팀이 없습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* 팀 목록 */}
          <div className="w-full md:w-56 flex-shrink-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">팀 선택</p>
            <div className="space-y-2">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    selectedTeamId === team.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-semibold truncate">{team.name}</p>
                  <p className="text-xs opacity-60 mt-0.5">멤버 {team.activeMemberCount}명</p>
                </button>
              ))}
            </div>
          </div>

          {/* 상세 패널 */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
              <button
                onClick={() => setTab('applications')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  tab === 'applications' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                가입 신청 관리
              </button>
              <button
                onClick={() => setTab('payments')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  tab === 'payments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                월별 결제 현황
              </button>
            </div>

            {tab === 'applications' && (
              <div>
                {applications.length === 0 ? (
                  <p className="text-slate-400 text-sm py-10 text-center">가입 신청이 없습니다.</p>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div key={app.id} className="p-4 bg-slate-50 rounded-xl space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-slate-900 text-sm">{app.userName}</p>
                              <span className="text-xs text-slate-400 font-mono">{app.phone}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 break-words">{app.message}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {new Date(app.appliedAt).toLocaleDateString('ko-KR')} 신청
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {app.status === 'PENDING' ? (
                              <>
                                <button
                                  onClick={() => handleApprove(app.id)}
                                  className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                >
                                  승인
                                </button>
                                <button
                                  onClick={() => handleReject(app.id)}
                                  className="text-xs font-semibold bg-white hover:bg-red-50 text-red-500 border border-red-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                >
                                  거절
                                </button>
                              </>
                            ) : (
                              <span
                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                                  app.status === 'APPROVED'
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-red-50 text-red-500'
                                }`}
                              >
                                {app.status === 'APPROVED' ? '승인됨' : '거절됨'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'payments' && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <select
                    value={paymentYear}
                    onChange={(e) => setPaymentYear(Number(e.target.value))}
                    className="px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {[2025, 2026, 2027].map((y) => (
                      <option key={y} value={y}>
                        {y}년
                      </option>
                    ))}
                  </select>
                  <select
                    value={paymentMonth}
                    onChange={(e) => setPaymentMonth(Number(e.target.value))}
                    className="px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m}월
                      </option>
                    ))}
                  </select>
                </div>

                {!paymentStatus || paymentStatus.members.length === 0 ? (
                  <p className="text-slate-400 text-sm py-10 text-center">활성 멤버가 없습니다.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                          <th className="pb-3 font-semibold">멤버</th>
                          <th className="pb-3 font-semibold">결제 상태</th>
                          <th className="pb-3 font-semibold">결제일</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paymentStatus.members.map((row) => (
                          <tr key={row.membershipId}>
                            <td className="py-3 font-medium text-slate-900">{row.userName}</td>
                            <td className="py-3">
                              {row.paymentStatus === null ? (
                                <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full font-semibold">
                                  미결제
                                </span>
                              ) : row.paymentStatus === 'PAID' ? (
                                <span className="text-xs px-2.5 py-1 bg-green-50 text-green-600 rounded-full font-semibold">
                                  완료
                                </span>
                              ) : (
                                <span className="text-xs px-2.5 py-1 bg-red-50 text-red-500 rounded-full font-semibold">
                                  포인트 부족
                                </span>
                              )}
                            </td>
                            <td className="py-3 text-slate-500 text-xs">
                              {row.paidAt ? new Date(row.paidAt).toLocaleDateString('ko-KR') : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
