import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyClasses, deleteClass } from '../api/hakyClass'
import type { HakyClass } from '../types'

export default function CoachClassesPage() {
  const [classes, setClasses] = useState<HakyClass[]>([])
  const [loading, setLoading] = useState(true)

  const load = () =>
    getMyClasses()
      .then(setClasses)
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm('클래스를 삭제하시겠습니까?')) return
    await deleteClass(id)
    load()
  }

  if (loading) return <p>로딩 중...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>내 클래스</h2>
        <Link to="/coach/classes/new" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '8px 20px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            + 클래스 등록
          </button>
        </Link>
      </div>
      {classes.length === 0 && <p style={{ color: '#888' }}>등록한 클래스가 없습니다.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {classes.map((c) => (
          <div key={c.id} style={{ border: '1px solid #e0e0e0', borderRadius: 10, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{c.title}</p>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: '#666' }}>
                {new Date(c.schedule).toLocaleString('ko-KR')} · 정원 {c.capacity}명 · {c.pointCost.toLocaleString()}P
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to={`/coach/classes/${c.id}/edit`} style={{ textDecoration: 'none' }}>
                <button style={{ padding: '6px 14px', border: '1px solid #1a1a2e', background: 'white', color: '#1a1a2e', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                  수정
                </button>
              </Link>
              <button
                onClick={() => handleDelete(c.id)}
                style={{ padding: '6px 14px', border: '1px solid #e74c3c', background: 'white', color: '#e74c3c', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
