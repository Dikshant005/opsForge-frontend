import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const Dashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        // Fetch dashboard stats from the backend
        const fetchStats = async () => {
            try {
                const response = await axiosClient.get('/api/tickets/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">System Analytics</h1>
            
            {stats ? (
                // 2. A responsive grid for our stat cards
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    
                    {/* 3. Dynamically loop through the Map keys/values */}
                    {Object.entries(stats).map(([status, count]) => (
                        <div key={status} className="bg-white p-6 rounded-lg shadow border flex flex-col items-center">
                            <span className="text-sm text-gray-500 font-semibold tracking-wider">
                                {status.replace('_', ' ')} {/* Cleans up "IN_PROGRESS" to "IN PROGRESS" */}
                            </span>
                            <span className="text-4xl font-bold text-blue-600 mt-2">
                                {count}
                            </span>
                        </div>
                    ))}
                    
                </div>
            ) : (
                <div className="text-gray-500 animate-pulse">Loading analytics...</div>
            )}
        </div>
    );
};

export default Dashboard;