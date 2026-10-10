import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ adminOnly = false }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading...</div></div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
