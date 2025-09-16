import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;