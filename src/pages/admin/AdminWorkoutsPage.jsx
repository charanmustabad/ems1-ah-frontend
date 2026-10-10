import { useEffect, useState } from 'react';
import api from '../../services/api';

const formDefaults = { name: '', description: '', category: 'Strength', difficulty: 'Beginner', duration: 30, exercises: [] };

export default function AdminWorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [form, setForm] = useState(formDefaults);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [workoutsResp, exercisesResp] = await Promise.all([
        api.get('/admin/workouts'),
        api.get('/admin/exercises'),
      ]);
      setWorkouts(workoutsResp.data.data.workouts || []);
      setExercises(exercisesResp.data.data.exercises || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleExerciseToggle = (exerciseId) => {
    setForm((prev) => {
      const current = prev.exercises || [];
      const updated = current.includes(exerciseId)
        ? current.filter((id) => id !== exerciseId)
        : [...current, exerciseId];
      return { ...prev, exercises: updated };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.post('/workouts', form);
    setForm(formDefaults);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this workout?')) {
      await api.delete(`/workouts/${id}`);
      loadData();
    }
  };

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading workouts...</div></div>;
  }

  return (
    <div className="page-shell">
      <header className="page-header"><div><p className="eyebrow">Workout management</p><h2>Programs</h2></div></header>

      <form className="panel" onSubmit={handleSubmit}>
        <div className="profile-card">
          <label><span>Name</span><input name="name" value={form.name} onChange={handleChange} /></label>
          <label><span>Category</span><select name="category" value={form.category} onChange={handleChange}><option>Strength</option><option>Cardio</option><option>Full Body</option><option>Upper Body</option><option>Lower Body</option><option>Beginner</option><option>Custom</option></select></label>
          <label><span>Difficulty</span><select name="difficulty" value={form.difficulty} onChange={handleChange}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
          <label><span>Duration (min)</span><input name="duration" type="number" value={form.duration} onChange={handleChange} /></label>
          <label className="full-width"><span>Description</span><textarea name="description" rows="3" value={form.description} onChange={handleChange} /></label>
          <div className="full-width">
            <span>Exercises</span>
            <div className="stack-list">
              {exercises.map((exercise) => (
                <label key={exercise._id} className="checkbox-row">
                  <input type="checkbox" checked={(form.exercises || []).includes(exercise._id)} onChange={() => handleExerciseToggle(exercise._id)} />
                  <span>{exercise.name}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="primary-btn full-width">Create Workout</button>
        </div>
      </form>

      <div className="panel history-table-wrap">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Category</th><th>Difficulty</th><th>Duration</th><th>Actions</th></tr></thead>
          <tbody>
            {workouts.map((workout) => (
              <tr key={workout._id}>
                <td>{workout.name}</td>
                <td>{workout.category}</td>
                <td>{workout.difficulty}</td>
                <td>{workout.duration} min</td>
                <td><button type="button" className="danger-btn" onClick={() => handleDelete(workout._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
