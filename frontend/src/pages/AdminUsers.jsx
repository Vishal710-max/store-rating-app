import { useEffect, useState, useCallback } from 'react';
import * as adminService from '../services/adminService';
import SortableHeader from '../components/SortableHeader.jsx';
import { validateName, validateAddress, validateEmail, validatePassword } from '../utils/validation';

const emptyForm = { name: '', email: '', password: '', address: '', role: 'USER' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('ASC');
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);

  const load = useCallback(() => {
    adminService
      .getUsers({ search: search || undefined, role: roleFilter || undefined, sortBy, sortDir })
      .then(setUsers)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load users'));
  }, [search, roleFilter, sortBy, sortDir]);

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

  const openDetail = async (id) => {
    try {
      const detail = await adminService.getUserDetail(id);
      setSelectedUser(detail);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user detail');
    }
  };

  const validateForm = () => {
    const errors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      address: validateAddress(form.address),
    };
    setFieldErrors(errors);
    return Object.values(errors).every((v) => !v);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validateForm()) return;

    try {
      await adminService.addUser(form);
      setShowForm(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Users</h1>
        <button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : '+ Add User'}</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="card" onSubmit={handleAddUser}>
          {formError && <div className="alert alert-error">{formError}</div>}
          <label>
            Name
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
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </label>
          <label>
            Role
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="USER">Normal User</option>
              <option value="ADMIN">Admin</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </label>
          <button type="submit">Create User</button>
        </form>
      )}

      <div className="filters">
        <input
          placeholder="Search by name, email, or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <SortableHeader label="Name" field="name" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
            <SortableHeader label="Email" field="email" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
            <th>Address</th>
            <SortableHeader label="Role" field="role" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} onClick={() => openDetail(u.id)} className="clickable-row">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedUser.name}</h2>
            <p>Email: {selectedUser.email}</p>
            <p>Address: {selectedUser.address}</p>
            <p>Role: {selectedUser.role}</p>
            {selectedUser.role === 'STORE_OWNER' && (
              <p>Store rating: {selectedUser.store_owner_rating ?? 'No ratings yet'}</p>
            )}
            <button onClick={() => setSelectedUser(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
