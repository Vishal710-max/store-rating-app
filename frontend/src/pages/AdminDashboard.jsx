import { useEffect, useState } from 'react';
import * as adminService from '../services/adminService';

export default function AdminDashboard() {
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .getDashboard()
      .then(setCounts)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {counts && (
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-value">{counts.total_users}</span>
            <span className="stat-label">Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{counts.total_stores}</span>
            <span className="stat-label">Stores</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{counts.total_ratings}</span>
            <span className="stat-label">Ratings Submitted</span>
          </div>
        </div>
      )}
    </div>
  );
}
