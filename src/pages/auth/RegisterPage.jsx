import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  gender: 'Prefer not to say',
  height: '',
  weight: '',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email');
      return;
    }

    if (form.password.length < 8) {
      setError('Password should be at least 8 characters long');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (Number(form.age) < 10 || Number(form.age) > 100) {
      setError('Please enter a realistic age');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        age: form.age,
        gender: form.gender,
        height: form.height,
        weight: form.weight,
      });
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to create your account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <div className="auth-header">
          <div className="brand-mark large">F</div>
          <h1>Create Your Account</h1>
          <p>Start your fitness transformation with FitTrack Pro.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form grid-form">
          {error && <div className="error-box">{error}</div>}

          <label>
            <span>Full Name</span>
            <input name="name" value={form.name} onChange={handleChange} placeholder="John Smith" />
          </label>

          <label>
            <span>Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
          </label>

          <label>
            <span>Password</span>
            <div className="password-field">
              <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Create a strong password" />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label>
            <span>Confirm Password</span>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" />
          </label>

          <label>
            <span>Age</span>
            <input name="age" type="number" min="10" max="100" value={form.age} onChange={handleChange} />
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
            <input name="height" type="number" value={form.height} onChange={handleChange} placeholder="170" />
          </label>

          <label>
            <span>Weight (kg)</span>
            <input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="72" />
          </label>

          <button type="submit" className="primary-btn full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="auth-switcher">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
