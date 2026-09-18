import { useState } from 'react';
import * as authService from '../services/authService';
import { validatePassword } from '../utils/validation';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const passwordError = validatePassword(form.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setSubmitting(true);
    try {
      await authService.changePassword(form);
      setSuccess('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1>Change Password</h1>
      <form className="card" style={{ maxWidth: 420 }} onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <label>
          Current Password
          <input
            type="password"
            required
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          />
        </label>

        <label>
          New Password
          <input
            type="password"
            required
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
          <small>8–16 characters, one uppercase letter, one special character</small>
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
