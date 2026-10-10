import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../../services/api';

const ranges = [7, 30, 90, 0];

export default function ProgressPage() {
  const [range, setRange] = useState(30);
  const [data, setData] = useState({
    frequency: [],
    weightProgress: [],
    volumeData: [],
    durationData: [],
    exercisePerformance: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await api.get('/users/progress');
        setData(response.data.data || {
          frequency: [],
          weightProgress: [],
          volumeData: [],
          durationData: [],
          exercisePerformance: [],
        });
      } catch (error) {
        console.error('Progress load failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const filterByRange = (entries) => {
    if (!entries?.length) return [];
    if (range === 0) return entries;

    const cutoff = Date.now() - range * 24 * 60 * 60 * 1000;
    return entries.filter((item) => {
      const dateValue = new Date(item.date || item.completedAt || Date.now()).getTime();
      return dateValue >= cutoff;
    });
  };

  const chartData = useMemo(() => ({
    frequency: filterByRange(data.frequency),
    weightProgress: filterByRange(data.weightProgress),
    volumeData: filterByRange(data.volumeData),
    durationData: filterByRange(data.durationData),
  }), [data, range]);

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading progress analytics...</div></div>;
  }

  const hasData = Object.values(chartData).some((group) => group.length > 0);

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Progress</p>
          <h2>Fitness analytics</h2>
        </div>
      </header>

      <div className="toolbar">
        {ranges.map((value) => (
          <button key={value} type="button" className={value === range ? 'primary-btn' : 'secondary-btn'} onClick={() => setRange(value)}>
            {value === 0 ? 'All time' : `${value} days`}
          </button>
        ))}
      </div>

      {!hasData ? (
        <div className="panel"><p className="empty-state">No performance data yet. Complete a few workouts to begin seeing charts and progress trends.</p></div>
      ) : (
        <>
          <div className="dashboard-grid">
            <div className="panel">
              <h3>Workout frequency</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData.frequency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#51c7ab" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel">
              <h3>Weight progression</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData.weightProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#8c7dff" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="panel">
              <h3>Workout volume</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData.volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="volume" stroke="#ffb870" fill="#ffb870" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel">
              <h3>Workout duration</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData.durationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="duration" stroke="#51c7ab" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="panel">
            <h3>Exercise performance</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={data.exercisePerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="exerciseId" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalVolume" fill="#62a3ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
