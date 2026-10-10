import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/user/DashboardPage';
import WorkoutsPage from './pages/user/WorkoutsPage';
import WorkoutDetailPage from './pages/user/WorkoutDetailPage';
import LogWorkoutPage from './pages/user/LogWorkoutPage';
import HistoryPage from './pages/user/HistoryPage';
import ProgressPage from './pages/user/ProgressPage';
import ProfilePage from './pages/user/ProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminWorkoutsPage from './pages/admin/AdminWorkoutsPage';
import AdminExercisesPage from './pages/admin/AdminExercisesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<UserLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/workouts" element={<WorkoutsPage />} />
              <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
              <Route path="/log-workout" element={<LogWorkoutPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/workouts" element={<AdminWorkoutsPage />} />
              <Route path="/admin/exercises" element={<AdminExercisesPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
