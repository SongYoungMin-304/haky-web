import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createClass, getClass, updateClass } from '../api/hakyClass'

export default function ClassFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    schedule: '',
    capacity: 10,
    pointCost: 1000,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      getClass(Number(id)).then((c) => {
        setForm({
          title: c.title,
          description: c.description,
          schedule: c.schedule.slice(0, 16),
          capacity: c.capacity,
          pointCost: c.pointCost,
        })
      })
    }
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { ...form, schedule: new Date(form.schedule).toISOString() }
      if (isEdit) {
        await updateClass(Number(id), payload)
      } else {
        await createClass(payload)
      }
      navigate('/coach/classes')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? '저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h2 style={{ marginBottom: 24 }}>{isEdit ? '클래스 수정' : '클래스 등록'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label style={labelStyle}>제목
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={inputStyle} />
        </label>
        <label style={labelStyle}>설명
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </label>
        <label style={labelStyle}>일정
          <input type="datetime-local" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} required style={inputStyle} />
        </label>
        <label style={labelStyle}>정원 (명)
          <input type="number" value={form.capacity} min={1} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} required style={inputStyle} />
        </label>
        <label style={labelStyle}>포인트 비용
          <input type="number" value={form.pointCost} min={1} onChange={(e) => setForm({ ...form, pointCost: Number(e.target.value) })} required style={inputStyle} />
        </label>
        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 15 }}>
            {loading ? '저장 중...' : isEdit ? '수정하기' : '등록하기'}
          </button>
          <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, padding: '10px', background: 'white', color: '#555', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', fontSize: 15 }}>
            취소
          </button>
        </div>
      </form>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14, color: '#555' }
const inputStyle: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
