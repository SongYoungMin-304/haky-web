import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteClass, getMyClasses } from '../api/hakyClass'
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

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-slate-900">내 클래스</h1>
        <Link to="/coach/classes/new">
          <button className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer">
            + 클래스 등록
          </button>
        </Link>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 text-center py-20 text-slate-400">
          <p className="text-5xl mb-4">🏒</p>
          <p className="font-medium mb-2">등록한 클래스가 없습니다.</p>
          <p className="text-sm">새 클래스를 등록해보세요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 px-6 py-5 flex items-center justify-between shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">{c.title}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {new Date(c.schedule).toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  <span className="mx-2 text-slate-300">·</span>
                  정원 {c.capacity}명
                  <span className="mx-2 text-slate-300">·</span>
                  <span className="text-blue-600 font-semibold">{c.pointCost.toLocaleString()}P</span>
                </p>
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <Link to={`/coach/classes/${c.id}/edit`}>
                  <button className="text-xs font-medium text-slate-700 border border-slate-300 hover:border-slate-500 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer bg-transparent">
                    수정
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-xs font-medium text-red-500 border border-red-200 hover:border-red-400 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer bg-transparent"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
