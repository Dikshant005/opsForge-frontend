import { useSelector } from 'react-redux';
import AdminDashboard from '../features/dashboard/AdminDashboard';
import DevDashboard from '../features/dashboard/DevDashboard';
import QaDashboard from '../features/dashboard/QaDashboard';

const Dashboard = () => {
    // same place DashboardLayout reads the user from
    const user = useSelector((state) => state.auth.user);

    if (!user) {
        return <div className="p-6 text-gray-500 animate-pulse">Loading dashboard...</div>;
    }

    switch (user.role) {
        case 'ADMIN':
            return <AdminDashboard />;
        case 'DEV':
            return <DevDashboard />;
        case 'QA':
            return <QaDashboard />;
        default:
            return (
                <div className="p-6 text-red-500">
                    Couldn't determine your role, so no dashboard could be loaded.
                </div>
            );
    }
};

export default Dashboard;