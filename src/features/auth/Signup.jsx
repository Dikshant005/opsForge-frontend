import {useState} from 'react'
import {useDispatch} from 'react-redux';
import {useNavigate, Link} from 'react-router-dom';
import {registerUser} from './authSlice';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        requestedRole: 'DEV'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true);
        
        try {
            const result = await dispatch(registerUser(formData)).unwrap();
            setSuccessMessage(result.message || 'User registered successfully! Please wait for admin approval.');
            // Clear form
            setFormData({
                username: '',
                email: '',
                password: '',
                requestedRole: 'DEV'
            });
            // Optional: navigate to login after a few seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch(err) {
            setError(err.message || err.error || 'Signup failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-6 text-center text-2xl font-bold">OpsForge Signup</h2>
            
            {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}
            {successMessage && <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">{successMessage}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
    
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

              <div>
                 <label className="block text-sm font-medium text-gray-700">Requested Role</label>
                 <select
                   name="requestedRole"
                   value={formData.requestedRole}
                   onChange={handleChange}
                   className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                 >
                    <option value="DEV">Developer</option>
                    <option value="QA">QA / Reviewer</option>
                 </select>
              </div>
    
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Log in here
                </Link>
            </div>
          </div>
        </div>
      );
    };
    
export default Signup;
