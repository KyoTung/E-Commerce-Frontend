// ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useSelector((state) => state.auth);

  // Nếu chưa đăng nhập -> về trang chủ
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có yêu cầu role và role hiện tại không nằm trong danh sách cho phép
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;