import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
const  {user}  = useSelector((state) => state.auth);

  if (!user || ( user.role !== requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;  
};

export default ProtectedRoute;