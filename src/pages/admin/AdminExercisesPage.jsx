import { useEffect, useState } from 'react';
import api from '../../services/api';

const defaults = {
  name: '',
  description: '',
  muscleGroup: 'Chest',
  equipment: '',
  difficulty: 'Beginner',
  instructions: '',
};

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(true);

  const loadExercises = async () => {
    try {
      const response = await api.get('/admin/exercises');
      setExercises(response.data.data.exercises || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.post('/exercises', form);
    setForm(defaults);
    loadExercises();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this exercise?')) {
      await api.delete(`/exercises/${id}`);
      loadExercises();
    }
  };

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading exercises...</div></div>;
  }

  return (
    <div className="page-shell">
      <header className="page-header"><div><p className="eyebrow">Exercise management</p><h2>Exercise library</h2></div></header>

      <form className="panel" onSubmit={handleSubmit}>
        <div className="profile-card">
          <label><span>Name</span><input name="name" value={form.name} onChange={handleChange} /></label>
          <label><span>Muscle group</span><select name="muscleGroup" value={form.muscleGroup} onChange={handleChange}><option>Chest</option><option>Back</option><option>Shoulders</option><option>Biceps</option><option>Triceps</option><option>Legs</option><option>Core</option><option>Full Body</option></select></label>
          <label><span>Equipment</span><input name="equipment" value={form.equipment} onChange={handleChange} /></label>
          <label><span>Difficulty</span><select name="difficulty" value={form.difficulty} onChange={handleChange}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
          <label className="full-width"><span>Description</span><textarea rows="2" name="description" value={form.description} onChange={handleChange} /></label>
          <label className="full-width"><span>Instructions</span><textarea rows="3" name="instructions" value={form.instructions} onChange={handleChange} /></label>
          <button type="submit" className="primary-btn full-width">Add Exercise</button>
        </div>
      </form>

      <div className="panel history-table-wrap">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Muscle</th><th>Equipment</th><th>Difficulty</th><th>Actions</th></tr></thead>
          <tbody>
            {exercises.map((exercise) => (
              <tr key={exercise._id}>
                <td>{exercise.name}</td>
                <td>{exercise.muscleGroup}</td>
                <td>{exercise.equipment}</td>
                <td>{exercise.difficulty}</td>
                <td><button type="button" className="danger-btn" onClick={() => handleDelete(exercise._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
