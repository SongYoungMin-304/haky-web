import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getClasses } from '../api/hakyClass'
import type { HakyClass } from '../types'

export default function ClassListPage() {
  const [classes, setClasses] = useState<HakyClass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClasses()
      .then(setClasses)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>로딩 중...</p>

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>클래스 목록</h2>
      {classes.length === 0 && <p style={{ color: '#888' }}>등록된 클래스가 없습니다.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {classes.map((c) => (
          <Link key={c.id} to={`/classes/${c.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: 10,
                padding: 20,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.boxShadow = 'none')}
            >
              <h3 style={{ margin: '0 0 8px' }}>{c.title}</h3>
              <p style={{ color: '#666', fontSize: 13, margin: '0 0 12px' }}>감독: {c.coachName}</p>
              <p style={{ color: '#555', fontSize: 13, margin: '0 0 4px' }}>
                일정: {new Date(c.schedule).toLocaleString('ko-KR')}
              </p>
              <p style={{ color: '#555', fontSize: 13, margin: '0 0 12px' }}>
                정원: {c.capacity}명
              </p>
              <span
                style={{
                  background: '#1a1a2e',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {c.pointCost.toLocaleString()}P
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
