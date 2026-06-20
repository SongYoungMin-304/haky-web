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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 mb-8 text-white">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Hockey Class</p>
        <h1 className="text-3xl font-black mb-2">지금 바로 하키를 시작하세요</h1>
        <p className="text-slate-400 text-sm">전문 감독과 함께하는 체계적인 하키 클래스</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">전체 클래스 <span className="text-blue-500">{classes.length}</span></h2>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-5xl mb-4">🏒</p>
          <p className="font-medium">등록된 클래스가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((c) => (
            <Link key={c.id} to={`/classes/${c.id}`}>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {c.coachName} 감독
                  </span>
                  <span className="text-xs text-slate-400">
                    정원 {c.capacity}명
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2 flex-1">{c.title}</h3>
                <p className="text-sm text-slate-500 mb-4">
                  {new Date(c.schedule).toLocaleString('ko-KR', {
                    month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xl font-black text-slate-900">
                    {c.pointCost.toLocaleString()}
                    <span className="text-sm font-semibold text-blue-500 ml-1">P</span>
                  </span>
                  <span className="text-xs text-slate-400">→ 신청하기</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
