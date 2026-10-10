import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.get('/users/history');
        setLogs(response.data.data.logs || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const searchText = `${log.workoutId?.name || ''} ${log.exerciseId?.name || ''}`.toLowerCase();
    return searchText.includes(filter.toLowerCase());
  });

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading workout history...</div></div>;
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Workout history</p>
          <h2>Recent sessions</h2>
        </div>
      </header>

      <div className="toolbar">
        <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Filter by workout or exercise" />
      </div>

      {filteredLogs.length === 0 ? (
        <div className="panel"><p className="empty-state">No workouts completed yet. Start your first workout to begin tracking your progress.</p></div>
      ) : (
        <div className="panel history-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Workout</th>
                <th>Exercise</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.completedAt).toLocaleDateString()}</td>
                  <td>{log.workoutId?.name || 'Workout'}</td>
                  <td>{log.exerciseId?.name || 'Exercise'}</td>
                  <td>{log.duration || 0} min</td>
                  <td><span className="status-pill success">Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
