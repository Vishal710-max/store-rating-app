import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

// Wrap a page element: <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
// If roles is omitted, any authenticated user may view the page.
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}
