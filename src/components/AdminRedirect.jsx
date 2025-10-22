import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ADMIN_EMAIL = 'admin@admin.com';

const AdminRedirect = () => {
  const { currentUser } = useAuth();
  
  if (currentUser?.email === ADMIN_EMAIL) {
    return <Navigate to="/admin" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

export default AdminRedirect;
