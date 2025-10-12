import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
 const getUserFromUserSlice = useSelector((state) => state.user.user);
const isLoggedIn = useSelector((state) => !!state.auth.user?.token);

  if (!isLoggedIn || (requiredRole && getUserFromUserSlice.role !== requiredRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;