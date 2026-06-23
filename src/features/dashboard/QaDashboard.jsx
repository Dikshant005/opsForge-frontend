import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { StatCard, TicketSection } from '../../utils/DashboardWidget';

const QaDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // TODO: confirm this matches your actual backend route
                const response = await axiosClient.get('/api/dashboard/qa');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch QA dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) {
        return <div className="p-6 text-gray-500 animate-pulse">Loading your dashboard...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">QA Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Ready for Testing" value={stats.readyForTestingCount} color="text-green-600" />
                <StatCard label="Actively Testing" value={stats.activelyTestingCount} color="text-blue-600" />
            </div>

            <TicketSection
                title="Ready for Testing"
                tickets={stats.readyForTestingTickets}
                emptyText="Nothing's waiting for testing right now."
            />
            <TicketSection
                title="My Active Tests"
                tickets={stats.myActiveTests}
                emptyText="You're not actively testing anything right now."
            />
        </div>
    );
};

export default QaDashboard;