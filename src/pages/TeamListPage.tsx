import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { applyTeam, getMyApplications, getTeams } from '../api/team'
import { useAuthStore } from '../store/authStore'
import type { Team, TeamApplicationStatus } from '../types'

interface ApplyModal {
  team: Team
}

export default function TeamListPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ApplyModal | null>(null)
  const [form, setForm] = useState({ phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  // teamId → 신청 상태 맵
  const [appliedMap, setAppliedMap] = useState<Record<number, TeamApplicationStatus>>({})

  useEffect(() => {
    const fetches: Promise<void>[] = [getTeams().then(setTeams)]
    if (user?.role === 'USER') {
      fetches.push(
        getMyApplications().then((apps) => {
          const map: Record<number, TeamApplicationStatus> = {}
          apps.forEach((a) => {
            map[a.teamId] = a.status
          })
          setAppliedMap(map)
        }),
      )
    }
    Promise.all(fetches).finally(() => setLoading(false))
  }, [user])

  const openModal = (team: Team) => {
    if (!user) {
      navigate('/login')
      return
    }
    setForm({ phone: '', message: '' })
    setModal({ team })
  }

  const closeModal = () => setModal(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!modal) return
    setSubmitting(true)
    try {
      const result = await applyTeam(modal.team.id, form)
      setAppliedMap((prev) => ({ ...prev, [result.teamId]: result.status }))
      setModal(null)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      alert(msg ?? '신청에 실패했습니다.')
    } finally {
      setSubmitting(false)
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
    <>
      <div>
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 mb-8 text-white">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Hockey Team</p>
          <h1 className="text-3xl font-black mb-2">하키 팀에 합류하세요</h1>
          <p className="text-slate-400 text-sm">팀에 소속되어 체계적인 훈련을 받으세요</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            전체 팀 <span className="text-blue-500">{teams.length}</span>
          </h2>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-5xl mb-4">🏒</p>
            <p className="font-medium">등록된 팀이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {team.coachName} 감독
                  </span>
                  <span className="text-xs text-slate-400">멤버 {team.activeMemberCount}명</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2 flex-1">{team.name}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{team.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-lg font-black text-slate-900">
                    {team.monthlyPointCost.toLocaleString()}
                    <span className="text-sm font-semibold text-blue-500 ml-1">P/월</span>
                  </span>
                  {user?.role === 'USER' && (() => {
                    const status = appliedMap[team.id]
                    if (status === 'APPROVED')
                      return <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">멤버</span>
                    if (status === 'PENDING')
                      return <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">검토 중</span>
                    if (status === 'REJECTED')
                      return <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">거절됨</span>
                    return (
                      <button
                        onClick={() => openModal(team)}
                        className="text-xs font-semibold bg-slate-900 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        가입 신청
                      </button>
                    )
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 신청 모달 */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full w-fit mb-2">
                {modal.team.coachName} 감독
              </p>
              <h2 className="text-lg font-black text-slate-900">{modal.team.name} 가입 신청</h2>
              <p className="text-sm text-slate-500 mt-1">
                월 {modal.team.monthlyPointCost.toLocaleString()}P · 멤버 {modal.team.activeMemberCount}명
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  이름
                </label>
                <input
                  type="text"
                  value={user?.name ?? ''}
                  disabled
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  연락처 <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  신청 메시지 <span className="text-red-400">*</span>
                </label>
                <textarea
                  placeholder="간단한 자기소개나 지원 동기를 작성해주세요"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-slate-900 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 cursor-pointer text-sm"
                >
                  {submitting ? '신청 중...' : '신청하기'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-slate-300 text-slate-700 font-medium py-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-sm"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
