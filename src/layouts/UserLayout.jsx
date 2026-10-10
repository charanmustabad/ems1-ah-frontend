import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, Dumbbell, History, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Workouts', to: '/workouts', icon: Dumbbell },
  { label: 'Log Workout', to: '/log-workout', icon: History },
  { label: 'History', to: '/history', icon: History },
  { label: 'Progress', to: '/progress', icon: BarChart3 },
  { label: 'Profile', to: '/profile', icon: User },
];

export default function UserLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">F</div>
          <div>
            <h1>FitTrack Pro</h1>
            <span>User Portal</span>
          </div>
        </div>

        <nav className="side-nav">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
          <button type="button" className="nav-link logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>

        <div className="user-card">
          <strong>{currentUser?.name || 'User'}</strong>
          <span>{currentUser?.role || 'USER'}</span>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
