import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchCurrentUser } from './features/auth/authSlice';

// 1. Create a couple of quick dummy components for testing
const Login = () => <div>Login Page (Public)</div>;
const Dashboard = () => <div>Dashboard (Protected)</div>;
const Tickets = () => <div>Tickets Page (Protected)</div>;


function App() {
  
  const dispatch = useDispatch();
  
  // grab the user from redux -- we use useSelector to read the data from store
  const authStatus = useSelector((state) => state.auth.status);
  
  // useEffect to fetch current user on app load
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      dispatch(fetchCurrentUser());
    }
  },[dispatch])

  // prevent rendering routes if we are still loading user data
  if(authStatus === 'loading'){
    return <div>Loading OpsForge...</div>
  }




  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        {/* We use our wrapper component here */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
        </Route>
        
        {/* CATCH ALL - 404 Route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;