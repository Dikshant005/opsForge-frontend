import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

// 1. Create a couple of quick dummy components for testing
const Login = () => <div>Login Page (Public)</div>;
const Dashboard = () => <div>Dashboard (Protected)</div>;
const Tickets = () => <div>Tickets Page (Protected)</div>;

function App() {
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