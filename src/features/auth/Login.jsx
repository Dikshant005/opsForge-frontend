import {useState} from 'react'
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {fetchCurrentUser} from './authSlice';
import axiosClient from '../../api/axiosClient';



const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error,setError] = useState('');
    const [formData,setFormData] = useState({
        username:'',
        password:''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async(e)=> {
        e.preventDefault();
        setError(''); // Clear previous error
        try{
            // hit the login endpoint
            const response = await axiosClient.post('/api/auth/login', formData);
            // extract token and save to localStorage
            const {token} = response.data;
            localStorage.setItem('token', token);

            // dispatch fetchCurrentUser to get user data
            await dispatch(fetchCurrentUser()).unwrap(); // unwrap() allows to catch thunk errors in this try/catch block

            // navigate to dashboard 
            navigate('/dashboard');
        }
        catch(err){
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    }


return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">OpsForge Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Password Input */}
          <div>
             <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;