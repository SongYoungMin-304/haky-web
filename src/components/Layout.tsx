import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Nav */}
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-6">
          {/* Logo */}
          <Link to="/classes" className="flex items-center gap-2 mr-2">
            <span className="text-blue-400 font-black text-2xl tracking-tight">H</span>
            <span className="font-bold text-lg tracking-wide">HAKY</span>
          </Link>

          <div className="w-px h-5 bg-slate-700" />

          <Link to="/classes" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            클래스
          </Link>

          {user?.role === 'USER' && (
            <>
              <Link to="/my/bookings" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                내 신청
              </Link>
              <Link to="/my/points" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                포인트
              </Link>
            </>
          )}
          {user?.role === 'COACH' && (
            <Link to="/coach/classes" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
              내 클래스
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <>
              <Link to="/admin/points" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                포인트 관리
              </Link>
              <Link to="/admin/classes" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                클래스 관리
              </Link>
            </>
          )}

          <div className="ml-auto flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                    {user.name[0]}
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-400">{user.name}</p>
                    <p className="text-xs font-semibold text-blue-400">{user.point.toLocaleString()}P</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm text-slate-300 hover:text-white font-medium transition-colors">
                로그인
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-500 text-center text-xs py-4">
        © 2026 HAKY — Hockey Class Platform
      </footer>
    </div>
  )
}
