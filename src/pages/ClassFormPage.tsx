import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createClass, getClass, updateClass } from '../api/hakyClass'

export default function ClassFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', schedule: '', capacity: 10, pointCost: 1000 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      getClass(Number(id)).then((c) => {
        setForm({ title: c.title, description: c.description, schedule: c.schedule.slice(0, 16), capacity: c.capacity, pointCost: c.pointCost })
      })
    }
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { ...form, schedule: new Date(form.schedule).toISOString() }
      if (isEdit) { await updateClass(Number(id), payload) } else { await createClass(payload) }
      navigate('/coach/classes')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? '저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-black text-slate-900 mb-6">{isEdit ? '클래스 수정' : '클래스 등록'}</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: '제목', key: 'title', type: 'text', placeholder: '클래스 이름을 입력하세요' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">클래스 소개</label>
            <textarea
              placeholder="클래스에 대한 설명을 입력하세요"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">일정</label>
            <input
              type="datetime-local"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">정원 (명)</label>
              <input
                type="number"
                value={form.capacity}
                min={1}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">포인트 비용</label>
              <input
                type="number"
                value={form.pointCost}
                min={1}
                onChange={(e) => setForm({ ...form, pointCost: Number(e.target.value) })}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 cursor-pointer text-sm"
            >
              {loading ? '저장 중...' : isEdit ? '수정하기' : '등록하기'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-slate-300 hover:border-slate-400 text-slate-600 font-semibold py-3 rounded-xl transition-colors cursor-pointer text-sm bg-transparent"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
