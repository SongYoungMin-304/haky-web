import { useEffect, useState } from 'react'
import { deleteClass, getClasses } from '../api/hakyClass'
import type { HakyClass } from '../types'

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<HakyClass[]>([])
  const [loading, setLoading] = useState(true)

  const load = () =>
    getClasses()
      .then(setClasses)
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm('클래스를 삭제하시겠습니까?')) return
    await deleteClass(id)
    load()
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-slate-900">클래스 관리</h1>
        <span className="text-sm text-slate-500">전체 {classes.length}개</span>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 text-center py-20 text-slate-400">
          <p className="text-5xl mb-4">🏒</p>
          <p className="font-medium">등록된 클래스가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 px-6 py-5 flex items-center justify-between shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {c.coachName} 감독
                  </span>
                </div>
                <p className="font-bold text-slate-900 truncate">{c.title}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {new Date(c.schedule).toLocaleString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  <span className="mx-2 text-slate-300">·</span>
                  정원 {c.capacity}명
                  <span className="mx-2 text-slate-300">·</span>
                  <span className="text-blue-600 font-semibold">{c.pointCost.toLocaleString()}P</span>
                </p>
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                className="ml-4 shrink-0 text-xs font-medium text-red-500 border border-red-200 hover:border-red-400 hover:bg-red-50 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer bg-transparent"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
