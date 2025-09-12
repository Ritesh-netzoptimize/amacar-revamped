import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, requiredRole }) {
  const { user, loading } = useSelector((state) => state.user);
  const expiration = localStorage.getItem('authExpiration');
  const isExpired = expiration && Date.now() > parseInt(expiration);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || isExpired) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default PrivateRoute;