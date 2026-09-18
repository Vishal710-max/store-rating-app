import { useEffect, useState, useCallback } from 'react';
import * as storeService from '../services/storeService';
import StarRating from '../components/StarRating.jsx';
import SortableHeader from '../components/SortableHeader.jsx';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('ASC');
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(() => {
    storeService
      .getStores({ search: search || undefined, sortBy, sortDir })
      .then(setStores)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stores'));
  }, [search, sortBy, sortDir]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(field);
      setSortDir('ASC');
    }
  };

  const handleRate = async (store, rating) => {
    setSavingId(store.id);
    setError('');
    try {
      // submitRating and updateRating hit the same upsert endpoint on the backend;
      // whether it's a first rating or a change, this one call handles both.
      if (store.my_rating) {
        await storeService.updateRating(store.id, rating);
      } else {
        await storeService.submitRating(store.id, rating);
      }
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save rating');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="page">
      <h1>Stores</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="filters">
        <input
          placeholder="Search by store name or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <SortableHeader label="Store" field="name" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
            <th>Address</th>
            <SortableHeader
              label="Overall Rating"
              field="overall_rating"
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={handleSort}
            />
            <th>Your Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.overall_rating}</td>
              <td>
                <StarRating
                  value={s.my_rating || 0}
                  onChange={(rating) => handleRate(s, rating)}
                  readOnly={savingId === s.id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
