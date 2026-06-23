import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { StatCard } from '../../utils/DashboardWidget';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // TODO: confirm this matches your actual backend route
                const response = await axiosClient.get('/api/dashboard/admin');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch admin dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) {
        return <div className="p-6 text-gray-500 animate-pulse">Loading dashboard...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Open Tickets" value={stats.totalOpenTickets} color="text-blue-600" />
                <StatCard label="Active Users" value={stats.totalActiveUsers} color="text-green-600" />
                <StatCard label="Pending Approvals" value={stats.pendingUserApprovals} color="text-orange-600" />
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Recent System Activity</h2>
                {stats.recentSystemActivity && stats.recentSystemActivity.length > 0 ? (
                    <div className="bg-white rounded-lg shadow border divide-y">
                        {stats.recentSystemActivity.map((activity) => (
                            <div key={activity.id} className="p-4 flex justify-between items-start gap-4">
                                <div>
                                    <span className="font-semibold text-gray-700">{activity.performedByUsername}</span>
                                    <span className="text-gray-500"> · {activity.action.replace('_', ' ')} · </span>
                                    <span className="text-gray-600">{activity.entityName} #{activity.entityId}</span>
                                    <div className="text-sm text-gray-500 mt-1">{activity.details}</div>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {new Date(activity.timestamp).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-400 italic">No recent activity.</div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;