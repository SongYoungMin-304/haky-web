import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMe } from '../api/auth'
import { createBooking } from '../api/booking'
import { getClass } from '../api/hakyClass'
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
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    getClass(Number(id))
      .then(setHakyClass)
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    if (!hakyClass) return
    if (user.point < hakyClass.pointCost) { navigate('/my/points/request'); return }
    setBooking(true)
    setMessage('')
    try {
      await createBooking(hakyClass.id)
      const updated = await getMe()
      setUser(updated)
      setMessage('신청이 완료되었습니다!')
      setIsSuccess(true)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setMessage(msg ?? '신청에 실패했습니다.')
      setIsSuccess(false)
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!hakyClass) return <p className="text-slate-500">클래스를 찾을 수 없습니다.</p>

  const notEnoughPoint = user ? user.point < hakyClass.pointCost : false

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors cursor-pointer bg-transparent border-none"
      >
        ← 목록으로
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Header band */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-6 text-white">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">
            {hakyClass.coachName} 감독
          </p>
          <h1 className="text-2xl font-black">{hakyClass.title}</h1>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: '일정', value: new Date(hakyClass.schedule).toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
              { label: '정원', value: `${hakyClass.capacity}명` },
              { label: '포인트', value: `${hakyClass.pointCost.toLocaleString()}P` },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                <p className="font-bold text-slate-900 text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-semibold text-slate-800 mb-2 text-sm">클래스 소개</h3>
            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">{hakyClass.description}</p>
          </div>

          {/* Action */}
          {user?.role === 'USER' && (
            <div className="border-t border-slate-100 pt-6">
              {notEnoughPoint && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-700">
                  포인트가 부족합니다. (보유: {user.point.toLocaleString()}P / 필요: {hakyClass.pointCost.toLocaleString()}P)
                </div>
              )}
              <button
                onClick={handleBook}
                disabled={booking}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60 cursor-pointer text-sm"
              >
                {booking ? '처리 중...' : notEnoughPoint ? '포인트 충전하기' : `${hakyClass.pointCost.toLocaleString()}P로 신청하기`}
              </button>
              {message && (
                <p className={`mt-3 text-sm text-center font-medium ${isSuccess ? 'text-green-600' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
            </div>
          )}
          {!user && (
            <div className="border-t border-slate-100 pt-6">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors cursor-pointer text-sm"
              >
                로그인 후 신청
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
