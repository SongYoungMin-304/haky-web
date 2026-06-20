import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ loginId: '', password: '', name: '', role: 'USER' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signup(form)
      navigate('/login')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 mb-3">
            <span className="text-blue-500 font-black text-5xl leading-none">H</span>
            <span className="font-black text-4xl text-slate-900 leading-none">HAKY</span>
          </div>
          <p className="text-slate-500 text-sm">하키 클래스 플랫폼</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">회원가입</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">아이디</label>
              <input
                type="text"
                placeholder="사용할 아이디 입력"
                value={form.loginId}
                onChange={(e) => setForm({ ...form, loginId: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">이름</label>
              <input
                type="text"
                placeholder="실명 입력"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">역할</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="USER">일반 사용자</option>
                <option value="COACH">감독</option>
              </select>
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
              {loading ? '처리 중...' : '가입하기'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
