import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const homeLink =
    user?.role === 'ADMIN' ? '/admin' : user?.role === 'STORE_OWNER' ? '/owner' : '/stores';

  return (
    <nav className="navbar">
      <Link to={homeLink} className="navbar-brand">
        Store Rating
      </Link>
      {user && (
        <div className="navbar-links">
          {user.role === 'ADMIN' && (
            <>
              <Link to="/admin">Dashboard</Link>
              <Link to="/admin/users">Users</Link>
              <Link to="/admin/stores">Stores</Link>
            </>
          )}
          {user.role === 'USER' && <Link to="/stores">Stores</Link>}
          {user.role === 'STORE_OWNER' && <Link to="/owner">Dashboard</Link>}
          <Link to="/change-password">Change Password</Link>
          <span className="navbar-user">{user.name}</span>
          <button onClick={handleLogout} className="btn-link">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
