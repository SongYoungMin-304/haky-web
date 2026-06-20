import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMe, login } from '../api/auth'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ loginId: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token } = await login(form)
      localStorage.setItem('token', token)
      const user = await getMe()
      setAuth(token, user)
      navigate('/classes')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? '아이디 또는 비밀번호를 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 mb-3">
            <span className="text-blue-500 font-black text-5xl leading-none">H</span>
            <span className="font-black text-4xl text-slate-900 leading-none">HAKY</span>
          </div>
          <p className="text-slate-500 text-sm">하키 클래스 플랫폼</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">로그인</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">아이디</label>
              <input
                type="text"
                placeholder="아이디 입력"
                value={form.loginId}
                onChange={(e) => setForm({ ...form, loginId: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* Dev hint */}
          <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-1.5">테스트 계정 (아이디 / 비밀번호)</p>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 flex justify-between">
                <span>일반 사용자</span><span className="font-mono font-medium text-slate-600">1 / 1</span>
              </p>
              <p className="text-xs text-slate-400 flex justify-between">
                <span>감독</span><span className="font-mono font-medium text-slate-600">2 / 2</span>
              </p>
              <p className="text-xs text-slate-400 flex justify-between">
                <span>관리자</span><span className="font-mono font-medium text-slate-600">3 / 3</span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
