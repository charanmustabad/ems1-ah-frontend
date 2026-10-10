import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

export default function WorkoutDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const response = await api.get(`/workouts/${id}`);
        setWorkout(response.data.data.workout);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [id]);

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading workout...</div></div>;
  }

  if (!workout) {
    return <div className="page-shell"><div className="panel"><p className="empty-state">Workout not found.</p></div></div>;
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Workout details</p>
          <h2>{workout.name}</h2>
        </div>
        <button type="button" className="primary-btn" onClick={() => navigate(`/log-workout?workoutId=${workout._id}`)}>Start workout</button>
      </header>

      <div className="panel detail-panel">
        <div className="detail-header">
          <span className="badge">{workout.category}</span>
          <span className="badge muted">{workout.difficulty}</span>
          <span className="badge muted">{workout.duration} min</span>
        </div>
        <h3>{workout.description}</h3>

        <div className="exercise-list">
          {workout.exercises?.length ? workout.exercises.map((exercise) => (
            <div key={exercise._id} className="exercise-item">
              <div>
                <h4>{exercise.name}</h4>
                <p>{exercise.description}</p>
              </div>
              <div className="exercise-meta">
                <span>{exercise.muscleGroup}</span>
                <span>{exercise.equipment}</span>
                <span>{exercise.difficulty}</span>
              </div>
              <p className="small-copy">{exercise.instructions}</p>
            </div>
          )) : <p className="empty-state">No exercises assigned to this workout yet.</p>}
        </div>
      </div>

      <Link to="/workouts" className="secondary-btn inline-btn">Back to workouts</Link>
    </div>
  );
}
