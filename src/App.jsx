import {  Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchCurrentUser } from './features/auth/authSlice';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import Tickets from './features/tickets/Tickets';
import CreateTicket from './features/tickets/CreateTicket';
import Dashboard from './pages/Dashboard';
import Users from './features/users/Users';
import TicketDetail from './features/tickets/TicketDetail';
import Landing from './pages/Landing';

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
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES */}
        {/* We use our wrapper component here */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/users" element={<Users />} />
          <Route path="/dashboard/my-tickets" element={<Tickets view="mine" />} />
          <Route path="/dashboard/tickets" element={<Tickets view="all" />} />
          <Route path="/dashboard/tickets/:id" element={<TicketDetail />} />
          <Route path="/dashboard/create-ticket" element={<CreateTicket />} />
          </Route>
        </Route>
        
        {/* CATCH ALL - 404 Route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
  );
}

export default App;