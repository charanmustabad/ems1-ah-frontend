import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Dumbbell, TimerReset, Trophy } from 'lucide-react';
import api from '../../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalWorkouts: 0, completedWorkouts: 0, totalExercises: 0, totalWorkoutTime: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsResp, historyResp] = await Promise.all([
          api.get('/users/statistics'),
          api.get('/users/history'),
        ]);

        setStats(statsResp.data.data);
        setHistory((historyResp.data.data?.logs || []).slice(0, 5));
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading dashboard...</div></div>;
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Welcome back</h2>
        </div>
        <button type="button" className="primary-btn" onClick={() => navigate('/workouts')}>View Workouts</button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="icon-box purple"><Dumbbell size={20} /></div>
          <div>
            <span>Total Workouts</span>
            <strong>{stats.totalWorkouts}</strong>
          </div>
        </div>
        <div className="stat-card">
          <div className="icon-box green"><Trophy size={20} /></div>
          <div>
            <span>Completed Workouts</span>
            <strong>{stats.completedWorkouts}</strong>
          </div>
        </div>
        <div className="stat-card">
          <div className="icon-box orange"><Activity size={20} /></div>
          <div>
            <span>Total Exercises</span>
            <strong>{stats.totalExercises}</strong>
          </div>
        </div>
        <div className="stat-card">
          <div className="icon-box blue"><TimerReset size={20} /></div>
          <div>
            <span>Total Workout Time</span>
            <strong>{stats.totalWorkoutTime || 0} min</strong>
          </div>
        </div>
      </div>

      <div className="action-row">
        <button className="primary-btn" onClick={() => navigate('/workouts')}>Start Workout</button>
        <button className="secondary-btn" onClick={() => navigate('/history')}>Workout History</button>
        <button className="secondary-btn" onClick={() => navigate('/progress')}>View Progress</button>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>Recent workouts</h3>
          </div>
          {history.length === 0 ? (
            <p className="empty-state">No workout history yet. Start your first session to begin tracking results.</p>
          ) : (
            <div className="stack-list">
              {history.map((log) => (
                <div key={log._id} className="list-item">
                  <div>
                    <strong>{log.workoutId?.name || 'Workout'}</strong>
                    <small>{new Date(log.completedAt).toLocaleDateString()}</small>
                  </div>
                  <span>{log.duration || 0} min</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Current activity</h3>
          </div>
          <div className="stack-list">
            <div className="list-item">
              <div>
                <strong>Workout consistency</strong>
                <small>Based on completed sessions</small>
              </div>
              <span>{Math.min(stats.completedWorkouts * 20, 100)}%</span>
            </div>
            <div className="list-item">
              <div>
                <strong>Next goal</strong>
                <small>Increase weekly volume</small>
              </div>
              <span>+12%</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
