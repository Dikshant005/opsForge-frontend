import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUserRole, listOfPendingApprovals, updateApprovalStatus } from './userSlice';

const ROLE_LABELS = {
    DEV: 'Developer',
    QA: 'QA',
    ADMIN: 'Admin',
};

const ROLE_AVATAR_BG = {
    DEV: 'bg-violet-600',
    QA: 'bg-amber-600',
    ADMIN: 'bg-blue-600',
};

const ROLE_BADGE_STYLES = {
    DEV: 'text-violet-700 bg-violet-100',
    QA: 'text-amber-700 bg-amber-100',
    ADMIN: 'text-blue-700 bg-blue-100',
};

const getInitial = (name) => name?.charAt(0).toUpperCase() || '?';

const Users = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);
    const status = useSelector((state) => state.users.status);
    const pendingApprovals = useSelector((state) => state.users.pendingApprovals);
    const pendingStatus = useSelector((state) => state.users.pendingStatus);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(listOfPendingApprovals());
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <div className="max-w-3xl font-sans text-gray-800">
                <div className="p-6 text-gray-500">Loading users…</div>
            </div>
        );
    }

    const approvedUsers = users.filter((user) => user.accountStatus !== 'PENDING');

    return (
        <div className="max-w-3xl font-sans text-gray-800">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">User Management</h1>
                <p className="text-sm text-gray-500">Manage roles and review new registration requests.</p>
            </header>

            <section className="bg-white border border-gray-200 rounded-xl px-5 pt-5 pb-2 mb-6">
                <div className="flex items-center gap-2.5 mb-3">
                    <h2 className="text-[15px] font-semibold text-slate-900">Team Members</h2>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">
                        {approvedUsers.length}
                    </span>
                </div>

                <div className="flex flex-col">
                    {approvedUsers.map((user) => (
                        <div
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 py-3.5 px-1 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                            key={user.id}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span
                                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                                        ROLE_AVATAR_BG[user.role] || 'bg-gray-400'
                                    }`}
                                >
                                    {getInitial(user.username)}
                                </span>
                                <span className="text-sm font-semibold text-gray-800">{user.username}</span>
                            </div>

                            <div className="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">
                                <span
                                    className={`text-[11px] font-bold uppercase tracking-wide rounded-full px-2.5 py-0.5 ${
                                        ROLE_BADGE_STYLES[user.role] || 'text-gray-700 bg-gray-100'
                                    }`}
                                >
                                    {ROLE_LABELS[user.role] || user.role}
                                </span>
                                <select
                                    className="text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 cursor-pointer hover:border-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors"
                                    value={user.role}
                                    onChange={(e) =>
                                        dispatch(updateUserRole({ username: user.username, role: e.target.value }))
                                    }
                                >
                                    <option value="DEV">Developer</option>
                                    <option value="QA">QA</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl px-5 pt-5 pb-2 mb-6">
                <div className="flex items-center gap-2.5 mb-3">
                    <h2 className="text-[15px] font-semibold text-slate-900">Pending Registration Requests</h2>
                    {pendingApprovals.length > 0 && (
                        <span className="text-xs font-semibold text-red-700 bg-red-50 rounded-full px-2.5 py-0.5">
                            {pendingApprovals.length}
                        </span>
                    )}
                </div>

                {pendingStatus === 'loading' && (
                    <p className="text-sm text-gray-500 pt-2 pb-4">Loading pending requests…</p>
                )}

                {pendingStatus === 'succeeded' && pendingApprovals.length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-5 border border-dashed border-gray-200 rounded-lg mb-3">
                        No pending requests right now.
                    </div>
                )}

                <div className="flex flex-col">
                    {pendingApprovals.map((req) => (
                        <div
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 py-3.5 px-1 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                            key={req.username}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-gray-400 bg-white border-2 border-dashed border-gray-300">
                                    {getInitial(req.username)}
                                </span>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-semibold text-gray-800">{req.username}</span>
                                    <span className="text-xs text-gray-500">
                                        Requested role: {ROLE_LABELS[req.role] || req.role}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                                <button
                                    className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg px-3.5 py-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    onClick={() =>
                                        dispatch(updateApprovalStatus({ username: req.username, status: 'approved' }))
                                    }
                                >
                                    Approve
                                </button>
                                <button
                                    className="text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 active:scale-95 rounded-lg px-3.5 py-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    onClick={() =>
                                        dispatch(updateApprovalStatus({ username: req.username, status: 'rejected' }))
                                    }
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Users;