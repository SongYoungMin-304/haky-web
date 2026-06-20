import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPointRequest } from '../api/point'

const ACCOUNT = { bank: '국민은행', number: '123-456-789012', holder: '하키운영팀' }

export default function PointRequestPage() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const PRESETS = [10000, 30000, 50000, 100000]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const num = Number(amount)
    if (!num || num < 1) { setError('1 이상의 금액을 입력해주세요.'); return }
    setLoading(true)
    setError('')
    try {
      await createPointRequest(num)
      setSubmitted(true)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? '요청에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-6 text-white text-center">
            <p className="text-4xl mb-2">✓</p>
            <h2 className="text-xl font-black">요청 완료</h2>
            <p className="text-green-100 text-sm mt-1">아래 계좌로 입금 후 관리자 승인을 기다려주세요</p>
          </div>
          <div className="p-8">
            <div className="space-y-3 mb-6">
              {[
                { label: '은행', value: ACCOUNT.bank },
                { label: '계좌번호', value: ACCOUNT.number },
                { label: '예금주', value: ACCOUNT.holder },
                { label: '입금액', value: `${Number(amount).toLocaleString()}원` },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="font-semibold text-slate-900 text-sm">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 mb-6">
              입금 후 관리자 확인까지 다소 시간이 소요될 수 있습니다.
            </div>
            <button
              onClick={() => navigate('/my/points')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer text-sm"
            >
              내 포인트 확인
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-black text-slate-900 mb-6">포인트 충전</h1>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">금액 선택</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(String(p))}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer border ${
                    amount === String(p)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {p.toLocaleString()}원
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="직접 입력 (원)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Account info */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2">입금 계좌</p>
            <p className="text-sm font-bold text-slate-900">{ACCOUNT.bank} {ACCOUNT.number}</p>
            <p className="text-xs text-slate-500 mt-0.5">예금주: {ACCOUNT.holder}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !amount}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 cursor-pointer text-sm"
          >
            {loading ? '처리 중...' : '충전 요청하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
