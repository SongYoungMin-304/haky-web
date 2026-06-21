import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function roleLabel(role: string): string {
  if (role === 'COACH') return '(감독)'
  if (role === 'ADMIN') return '(관리자)'
  return ''
}

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const close = () => setMenuOpen(false)

  const displayName = user ? `${user.name}${roleLabel(user.role)}` : ''

  const navLinks = (
    <>
      {/* 팀·클래스 공개 링크는 USER와 미로그인 사용자만 */}
      {(!user || user.role === 'USER') && (
        <>
          <Link to="/teams" onClick={close} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            팀
          </Link>
          <Link to="/classes" onClick={close} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            클래스
          </Link>
        </>
      )}

      {user?.role === 'USER' && (
        <>
          <Link to="/my/teams" onClick={close} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            내 팀
          </Link>
          <Link to="/my/bookings" onClick={close} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            내 신청
          </Link>
          <Link to="/my/points" onClick={close} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            포인트
          </Link>
        </>
      )}

      {user?.role === 'COACH' && (
        <>
          <Link to="/coach/classes" onClick={close} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            내 클래스
          </Link>
          <Link to="/coach/teams" onClick={close} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            내 팀
          </Link>
        </>
      )}

      {user?.role === 'ADMIN' && (
        <>
          <Link to="/admin/points" onClick={close} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            포인트 관리
          </Link>
          <Link to="/admin/classes" onClick={close} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            클래스 관리
          </Link>
        </>
      )}
    </>
  )

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center">
          {/* Logo */}
          <Link to="/teams" className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-blue-400 font-black text-xl tracking-tight">H</span>
            <span className="font-bold text-base tracking-wide">HAKY</span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-5 ml-6">
            <div className="w-px h-4 bg-slate-700" />
            {navLinks}
          </div>

          {/* 우측 영역 */}
          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {user.name[0]}
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-200 leading-none font-medium">{displayName}</p>
                    <p className="text-xs font-semibold text-blue-400 mt-0.5">{user.point.toLocaleString()}P</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden md:block text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link to="/login" className="hidden md:block text-sm text-slate-300 hover:text-white font-medium transition-colors">
                로그인
              </Link>
            )}

            {/* 햄버거 버튼 (모바일) */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden flex flex-col gap-1.5 p-1.5 cursor-pointer"
              aria-label="메뉴"
            >
              <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* 모바일 드롭다운 메뉴 */}
        {menuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-4 flex flex-col gap-4">
            {navLinks}
            <div className="border-t border-slate-700 pt-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{displayName}</p>
                    <p className="text-xs text-blue-400">{user.point.toLocaleString()}P</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={close} className="text-sm text-slate-300 hover:text-white font-medium">
                  로그인
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-500 text-center text-xs py-4">
        © 2026 HAKY — Hockey Class Platform
      </footer>
    </div>
  )
}
