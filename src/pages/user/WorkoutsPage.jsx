import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function WorkoutsPage() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const response = await api.get('/workouts');
        setWorkouts(response.data.data.workouts || []);
      } catch (error) {
        console.error('Workouts load failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  const filteredWorkouts = workouts.filter((workout) => {
    const matchesCategory = category === 'All' || workout.category === category;
    const matchesDifficulty = difficulty === 'All' || workout.difficulty === difficulty;
    const matchesSearch = workout.name.toLowerCase().includes(search.toLowerCase()) || workout.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading workouts...</div></div>;
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Workout library</p>
          <h2>Available programs</h2>
        </div>
      </header>

      <div className="toolbar">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search workouts" />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="All">All categories</option>
          <option value="Strength">Strength</option>
          <option value="Cardio">Cardio</option>
          <option value="Full Body">Full Body</option>
          <option value="Upper Body">Upper Body</option>
          <option value="Lower Body">Lower Body</option>
        </select>
        <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
          <option value="All">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="card-grid">
        {filteredWorkouts.length === 0 ? (
          <div className="panel full-width"><p className="empty-state">No workouts match the current filters.</p></div>
        ) : (
          filteredWorkouts.map((workout) => (
            <article key={workout._id} className="fitness-card">
              <div className="card-head">
                <span className="badge">{workout.category}</span>
                <span className="badge muted">{workout.difficulty}</span>
              </div>
              <h3>{workout.name}</h3>
              <p>{workout.description}</p>
              <div className="meta-row">
                <span>{workout.duration} min</span>
                <span>{workout.exercises?.length || 0} exercises</span>
              </div>
              <div className="card-actions">
                <Link to={`/workouts/${workout._id}`} className="secondary-btn"><span>View workout</span></Link>
                <button type="button" className="primary-btn" onClick={() => navigate(`/log-workout?workoutId=${workout._id}`)}>Start workout</button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
