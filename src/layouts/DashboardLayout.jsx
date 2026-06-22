import {Outlet, useNavigate, Link} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {logoutUser} from '../features/auth/authSlice'

const DashboardLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // grab the user from redux
    const user = useSelector((state) => state.auth.user);

    const handleLogout = async() => {
        try{
        // dispatch the logoutUser thunk
        await dispatch(logoutUser()).unwrap()
        }
        catch(err){
            console.error('Logout failed:', err);
        }
        finally{
            navigate('/login');
        }
    }
    return (
    <div className="flex h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="flex h-16 items-center justify-center border-b border-gray-700 font-bold text-xl">
          OpsForge
        </div>
        
        <nav className="flex-1 p-4 space-y-2 ">
           {/* everyone can see this */}
           <Link to="/dashboard" className="block cursor-pointer rounded p-2 hover:bg-gray-700">
           Dashboard
           </Link>
           {/* DEV only */}
           {user?.role === 'DEV' && (
           <Link to="/dashboard/my-tickets" className="block cursor-pointer rounded p-2 hover:bg-gray-700">
           Tickets
           </Link>
           )}

           {/* QA only */}
           {user?.role ==="QA"&&(
            <>
            <Link to="/dashboard/tickets" className="block cursor-pointer rounded p-2 hover:bg-gray-700">
            Tickets
            </Link>
            <Link to="/dashboard/create-ticket" className="block cursor-pointer rounded p-2 hover:bg-gray-700">
            Create Ticket
            </Link>
            </>
           )}

           {/* ADMIN only */}
           {user?.role ==="ADMIN"&&(
            <>
               <Link to="/dashboard/tickets" className="block cursor-pointer rounded p-2 hover:bg-gray-700">
                 All Tickets
               </Link>
               <Link to="/dashboard/create-ticket" className="block cursor-pointer rounded p-2 hover:bg-gray-700">
              Create Ticket
              </Link> 
               <Link to="/users" className="block cursor-pointer rounded p-2 hover:bg-gray-700">
                 User Management
               </Link>
            </>   
           )}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow">
          <div className="text-lg font-medium text-gray-700">
            Welcome, {user?.username || 'User'}
            {/* displaying the role */}
            <span className='ml-2 text-sm font-bold text-blue-500'>
                [{user?.role || 'GUEST'}]
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default DashboardLayout;

