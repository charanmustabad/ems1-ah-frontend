import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminReportsPage() {
  const [data, setData] = useState({ users: 0, activeUsers: 0, workoutCount: 0, logs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await api.get('/admin/reports');
        setData(response.data.data || { users: 0, activeUsers: 0, workoutCount: 0, logs: [] });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading reports...</div></div>;
  }

  return (
    <div className="page-shell">
      <header className="page-header"><div><p className="eyebrow">Reports</p><h2>System insights</h2></div></header>

      <div className="stats-grid">
        <div className="stat-card"><div className="icon-box purple">U</div><div><span>Total users</span><strong>{data.users || 0}</strong></div></div>
        <div className="stat-card"><div className="icon-box green">A</div><div><span>Active users</span><strong>{data.activeUsers || 0}</strong></div></div>
        <div className="stat-card"><div className="icon-box orange">W</div><div><span>Workout count</span><strong>{data.workoutCount || 0}</strong></div></div>
      </div>

      <div className="panel history-table-wrap">
        <table className="data-table">
          <thead><tr><th>User</th><th>Exercise</th><th>Workout</th><th>Date</th></tr></thead>
          <tbody>
            {(data.logs || []).slice(0, 10).map((log) => (
              <tr key={log._id}>
                <td>{log.userId?.name || 'User'}</td>
                <td>{log.exerciseId?.name || 'Exercise'}</td>
                <td>{log.workoutId?.name || 'Workout'}</td>
                <td>{new Date(log.completedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
