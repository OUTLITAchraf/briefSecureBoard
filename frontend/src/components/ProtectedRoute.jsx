// components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import LoadingUser from "./LoadingUser";

const ProtectedRoute = () => {
  const { user, isLoadingUser } = useSelector((state) => state.auth);

  if (isLoadingUser) {
    return <LoadingUser/>;   // 👈 only temporary while fetchUser runs
  }

  if (!user) {
    return <Navigate to="/" replace />;   // 👈 if no user → back to login
  }

  return <Outlet />;   // 👈 if authenticated → show the child route
};

export default ProtectedRoute;
