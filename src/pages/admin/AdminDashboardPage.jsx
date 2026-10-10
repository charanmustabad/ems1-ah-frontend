import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminDashboardPage() {
  const [data, setData] = useState({ stats: {}, recentUsers: [], recentActivity: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setData(response.data.data || { stats: {}, recentUsers: [], recentActivity: [] });
      } catch (error) {
        console.error('Admin dashboard failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading admin dashboard...</div></div>;
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Admin overview</p>
          <h2>Performance dashboard</h2>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card"><div className="icon-box purple">U</div><div><span>Total users</span><strong>{data.stats.totalUsers || 0}</strong></div></div>
        <div className="stat-card"><div className="icon-box green">A</div><div><span>Active users</span><strong>{data.stats.activeUsers || 0}</strong></div></div>
        <div className="stat-card"><div className="icon-box orange">W</div><div><span>Total workouts</span><strong>{data.stats.totalWorkouts || 0}</strong></div></div>
        <div className="stat-card"><div className="icon-box blue">E</div><div><span>Total exercises</span><strong>{data.stats.totalExercises || 0}</strong></div></div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header"><h3>Recent users</h3></div>
          <div className="stack-list">
            {(data.recentUsers || []).map((user) => (
              <div key={user._id} className="list-item">
                <div>
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
                <span>{user.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h3>Recent workout activity</h3></div>
          <div className="stack-list">
            {(data.recentActivity || []).map((activity) => (
              <div key={activity._id} className="list-item">
                <div>
                  <strong>{activity.userId?.name || 'User'}</strong>
                  <small>{activity.workoutId?.name || 'Workout'}</small>
                </div>
                <span>{new Date(activity.completedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
