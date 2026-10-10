import { useEffect, useState } from 'react';
import api from '../../services/api';

const initialForm = {
  name: '',
  email: '',
  age: '',
  gender: 'Prefer not to say',
  height: '',
  weight: '',
};

export default function ProfilePage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const user = response.data.data.user || {};
        setForm({
          name: user.name || '',
          email: user.email || '',
          age: user.age || '',
          gender: user.gender || 'Prefer not to say',
          height: user.height || '',
          weight: user.weight || '',
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.put('/users/profile', {
        name: form.name,
        age: form.age,
        gender: form.gender,
        height: form.height,
        weight: form.weight,
      });
      setSuccess('Your profile has been updated successfully.');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to update profile');
    }
  };

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading profile...</div></div>;
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h2>Personal details</h2>
        </div>
      </header>

      <form className="profile-card" onSubmit={handleSubmit}>
        {error && <div className="error-box full-width">{error}</div>}
        {success && <div className="success-box full-width">{success}</div>}

        <label>
          <span>Name</span>
          <input name="name" value={form.name} onChange={handleChange} />
        </label>

        <label>
          <span>Email</span>
          <input name="email" value={form.email} disabled />
        </label>

        <label>
          <span>Age</span>
          <input name="age" type="number" value={form.age} onChange={handleChange} />
        </label>

        <label>
          <span>Gender</span>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>

        <label>
          <span>Height (cm)</span>
          <input name="height" type="number" value={form.height} onChange={handleChange} />
        </label>

        <label>
          <span>Weight (kg)</span>
          <input name="weight" type="number" value={form.weight} onChange={handleChange} />
        </label>

        <button type="submit" className="primary-btn full-width">Save profile</button>
      </form>
    </div>
  );
}
