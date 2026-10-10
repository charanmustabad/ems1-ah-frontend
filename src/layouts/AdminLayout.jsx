import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, ClipboardList, Dumbbell, LogOut, Users, LayoutDashboard, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Workouts', to: '/admin/workouts', icon: Dumbbell },
  { label: 'Exercises', to: '/admin/exercises', icon: Activity },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
];

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar admin-sidebar">
        <div className="brand-block">
          <div className="brand-mark">F</div>
          <div>
            <h1>FitTrack Pro</h1>
            <span>Admin Console</span>
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
          <strong>{currentUser?.name || 'Admin'}</strong>
          <span>{currentUser?.role || 'ADMIN'}</span>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
