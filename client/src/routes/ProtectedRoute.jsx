import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Vérification des rôles en lowercase pour correspondre au backend
  const userRole = user?.role?.toLowerCase();
  const hasRequiredRole = allowedRoles?.some(allowedRole => 
    allowedRole.toLowerCase() === userRole
  );

  if (allowedRoles && !hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;