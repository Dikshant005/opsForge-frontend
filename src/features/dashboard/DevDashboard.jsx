import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { StatCard, TicketSection } from '../../utils/DashboardWidget';


const DevDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosClient.get('/api/dashboard/dev');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch dev dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) {
        return <div className="p-6 text-gray-500 animate-pulse">Loading your dashboard...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Developer Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Active Tickets" value={stats.activeTicketsCount} color="text-blue-600" />
            </div>

            <TicketSection
                title="My Active Tickets"
                tickets={stats.activeTickets}
                emptyText="No active tickets assigned to you right now."
            />
        </div>
    );
};

export default DevDashboard;