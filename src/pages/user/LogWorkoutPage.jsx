import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const defaultSet = { reps: 10, weight: 0, duration: 0, note: '' };

export default function LogWorkoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workoutId = searchParams.get('workoutId');
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(workoutId || '');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedWorkout = useMemo(
    () => workouts.find((item) => item._id === selectedWorkoutId) || null,
    [workouts, selectedWorkoutId]
  );

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const response = await api.get('/workouts');
        const allWorkouts = response.data.data.workouts || [];
        setWorkouts(allWorkouts);
        if (workoutId && allWorkouts.some((item) => item._id === workoutId)) {
          setSelectedWorkoutId(workoutId);
        } else if (allWorkouts[0]) {
          setSelectedWorkoutId(allWorkouts[0]._id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, [workoutId]);

  useEffect(() => {
    if (!selectedWorkout) {
      setEntries([]);
      return;
    }

    setEntries(
      selectedWorkout.exercises.map((exercise) => ({
        exerciseId: exercise._id,
        duration: selectedWorkout.duration,
        notes: '',
        sets: [{ ...defaultSet }],
      }))
    );
  }, [selectedWorkout]);

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    setEntries((prev) => {
      const next = [...prev];
      next[exerciseIndex].sets[setIndex][field] = value;
      return next;
    });
  };

  const addSet = (exerciseIndex) => {
    setEntries((prev) => {
      const next = [...prev];
      next[exerciseIndex].sets.push({ ...defaultSet });
      return next;
    });
  };

  const removeSet = (exerciseIndex, setIndex) => {
    setEntries((prev) => {
      const next = [...prev];
      if (next[exerciseIndex].sets.length > 1) {
        next[exerciseIndex].sets.splice(setIndex, 1);
      }
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!selectedWorkout) {
      setError('Please choose a workout to log');
      return;
    }

    const payload = entries.map((entry) => ({
      exerciseId: entry.exerciseId,
      duration: Number(entry.duration) || 0,
      notes: entry.notes || '',
      sets: entry.sets.map((set) => ({
        reps: Number(set.reps) || 0,
        weight: Number(set.weight) || 0,
        duration: Number(set.duration) || 0,
        note: set.note || '',
      })),
    }));

    try {
      setSubmitting(true);
      await api.post(`/workouts/${selectedWorkout._id}/log`, { exercises: payload });
      navigate('/history');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to save workout log');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Preparing workout logger...</div></div>;
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Workout logging</p>
          <h2>Log your session</h2>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="panel">
        {error && <div className="error-box">{error}</div>}

        <div className="selector-block">
          <label>
            <span>Workout</span>
            <select value={selectedWorkoutId} onChange={(event) => setSelectedWorkoutId(event.target.value)}>
              {workouts.map((workout) => (
                <option key={workout._id} value={workout._id}>{workout.name}</option>
              ))}
            </select>
          </label>
        </div>

        {selectedWorkout && entries.map((entry, exerciseIndex) => {
          const exercise = selectedWorkout.exercises.find((item) => item._id === entry.exerciseId);

          return (
            <div key={entry.exerciseId} className="exercise-log-card">
              <h3>{exercise?.name || 'Exercise'}</h3>
              <div className="exercise-log-fields">
                <label>
                  <span>Duration (min)</span>
                  <input type="number" value={entry.duration} onChange={(event) => {
                    const next = [...entries];
                    next[exerciseIndex].duration = event.target.value;
                    setEntries(next);
                  }} />
                </label>
                <label className="full-width">
                  <span>Notes</span>
                  <textarea rows="2" value={entry.notes} onChange={(event) => {
                    const next = [...entries];
                    next[exerciseIndex].notes = event.target.value;
                    setEntries(next);
                  }} />
                </label>
              </div>

              {entry.sets.map((set, setIndex) => (
                <div key={`${entry.exerciseId}-${setIndex}`} className="set-row">
                  <strong>Set {setIndex + 1}</strong>
                  <input type="number" min="0" value={set.reps} onChange={(event) => updateSet(exerciseIndex, setIndex, 'reps', event.target.value)} placeholder="Reps" />
                  <input type="number" min="0" value={set.weight} onChange={(event) => updateSet(exerciseIndex, setIndex, 'weight', event.target.value)} placeholder="Weight" />
                  <input type="number" min="0" value={set.duration} onChange={(event) => updateSet(exerciseIndex, setIndex, 'duration', event.target.value)} placeholder="Duration" />
                  <input type="text" value={set.note} onChange={(event) => updateSet(exerciseIndex, setIndex, 'note', event.target.value)} placeholder="Set note" />
                  <button type="button" className="danger-btn" onClick={() => removeSet(exerciseIndex, setIndex)}>Remove</button>
                </div>
              ))}

              <button type="button" className="secondary-btn" onClick={() => addSet(exerciseIndex)}>Add set</button>
            </div>
          );
        })}

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={submitting}>{submitting ? 'Saving...' : 'Complete workout'}</button>
        </div>
      </form>
    </div>
  );
}
