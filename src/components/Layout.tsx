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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav
        style={{
          background: '#1a1a2e',
          color: 'white',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <Link to="/classes" style={{ color: 'white', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>
          Haky
        </Link>
        <Link to="/classes" style={{ color: '#ccc', textDecoration: 'none' }}>
          클래스
        </Link>
        {user && (
          <>
            {user.role === 'USER' && (
              <>
                <Link to="/my/bookings" style={{ color: '#ccc', textDecoration: 'none' }}>
                  내 신청
                </Link>
                <Link to="/my/points" style={{ color: '#ccc', textDecoration: 'none' }}>
                  포인트
                </Link>
              </>
            )}
            {user.role === 'COACH' && (
              <Link to="/coach/classes" style={{ color: '#ccc', textDecoration: 'none' }}>
                내 클래스
              </Link>
            )}
            {user.role === 'ADMIN' && (
              <>
                <Link to="/admin/points" style={{ color: '#ccc', textDecoration: 'none' }}>
                  포인트 관리
                </Link>
                <Link to="/admin/classes" style={{ color: '#ccc', textDecoration: 'none' }}>
                  클래스 관리
                </Link>
              </>
            )}
          </>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          {user ? (
            <>
              <span style={{ color: '#aaa', fontSize: 14 }}>
                {user.name} ({user.point.toLocaleString()}P)
              </span>
              <button
                onClick={handleLogout}
                style={{ background: 'transparent', border: '1px solid #555', color: '#ccc', padding: '4px 12px', cursor: 'pointer', borderRadius: 4 }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: '#ccc', textDecoration: 'none' }}>
              로그인
            </Link>
          )}
        </div>
      </nav>
      <main style={{ flex: 1, padding: '32px 24px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  )
}
