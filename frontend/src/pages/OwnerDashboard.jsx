import { useEffect, useState } from 'react';
import * as ownerService from '../services/ownerService';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    ownerService
      .getOwnerDashboard()
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!data) return <div className="page">Loading…</div>;

  return (
    <div className="page">
      <h1>{data.store.name}</h1>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-value">{data.averageRating}</span>
          <span className="stat-label">Average Rating</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{data.ratingCount}</span>
          <span className="stat-label">Total Ratings</span>
        </div>
      </div>

      <h2>Users who rated your store</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Rating</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.raters.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.rating} ★</td>
              <td>{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
