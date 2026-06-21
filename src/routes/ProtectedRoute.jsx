import { Navigate, Outlet } from 'react-router-dom';


const ProtectedRoute = () => {
    // Get the token from localStorage defining outside will only check on time so keep it here to check every time the route is accessed
    const token = localStorage.getItem('token');
  //If token exists, return <Outlet /> else return <Navigate to="/login" replace />
   if(token) {
    return <Outlet />;
  } else{
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;