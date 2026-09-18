import { useEffect, useState, useCallback } from 'react';
import * as adminService from '../services/adminService';
import SortableHeader from '../components/SortableHeader.jsx';
import { validateName, validateAddress, validateEmail } from '../utils/validation';

const emptyForm = { name: '', email: '', address: '', ownerId: '' };

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('ASC');
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');

  const load = useCallback(() => {
    adminService
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

  const validateForm = () => {
    const errors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
    };
    setFieldErrors(errors);
    return Object.values(errors).every((v) => !v);
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validateForm()) return;

    try {
      await adminService.addStore({ ...form, ownerId: form.ownerId || undefined });
      setShowForm(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create store');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Stores</h1>
        <button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : '+ Add Store'}</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="card" onSubmit={handleAddStore}>
          {formError && <div className="alert alert-error">{formError}</div>}
          <label>
            Store Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </label>
          <label>
            Address
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              maxLength={400}
            />
            {fieldErrors.address && <span className="field-error">{fieldErrors.address}</span>}
          </label>
          <label>
            Owner User ID (optional — must be a STORE_OWNER account)
            <input
              value={form.ownerId}
              onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
            />
          </label>
          <button type="submit">Create Store</button>
        </form>
      )}

      <div className="filters">
        <input
          placeholder="Search by name, email, or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <SortableHeader label="Name" field="name" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
            <SortableHeader label="Email" field="email" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
            <th>Address</th>
            <SortableHeader
              label="Overall Rating"
              field="overall_rating"
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.overall_rating} ({s.rating_count})</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
