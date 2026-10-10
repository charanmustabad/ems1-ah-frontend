import { useEffect, useState } from 'react';
import api from '../../services/api';

const initialForm = { name: '', email: '', password: '', role: 'USER' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/users', form);
      setForm(initialForm);
      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleStatus = async (user) => {
    await api.put(`/admin/users/${user._id}`, { isActive: !user.isActive });
    loadUsers();
  };

  const deleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      await api.delete(`/admin/users/${id}`);
      loadUsers();
    }
  };

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading users...</div></div>;
  }

  return (
    <div className="page-shell">
      <header className="page-header"><div><p className="eyebrow">User management</p><h2>All users</h2></div></header>

      <form className="panel" onSubmit={handleCreate}>
        <div className="toolbar">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="primary-btn">Add User</button>
        </div>
      </form>

      <div className="panel history-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td><span className={`status-pill ${user.isActive ? 'success' : 'warning'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-row">
                    <button type="button" className="secondary-btn" onClick={() => toggleStatus(user)}>{user.isActive ? 'Deactivate' : 'Activate'}</button>
                    <button type="button" className="danger-btn" onClick={() => deleteUser(user._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
