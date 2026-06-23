import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';   
import {fetchTickets, updateTicketStatus} from './ticketSlice';

const ALL_STATUSES = ['PENDING', 'IN_PROGRESS', 'FIXED', 'CLOSED'];

const STATUS_LABELS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  FIXED: 'Fixed',
  CLOSED: 'Closed',
};

const STATUS_SELECT_STYLES = {
  PENDING: 'border-amber-300 bg-amber-50 text-amber-800 focus:ring-amber-200 focus:border-amber-500',
  IN_PROGRESS: 'border-blue-300 bg-blue-50 text-blue-800 focus:ring-blue-200 focus:border-blue-500',
  FIXED: 'border-emerald-300 bg-emerald-50 text-emerald-800 focus:ring-emerald-200 focus:border-emerald-500',
  CLOSED: 'border-gray-300 bg-gray-100 text-gray-600 focus:ring-gray-200 focus:border-gray-500',
};

const TRANSITIONS = {
  DEV: {
    PENDING: ['PENDING', 'IN_PROGRESS'],
    IN_PROGRESS: ['IN_PROGRESS', 'FIXED'],
    FIXED: ['FIXED'],
    CLOSED: ['CLOSED'],
  },
  QA: {
    PENDING: ['PENDING'],
    IN_PROGRESS: ['IN_PROGRESS'],
    FIXED: ['FIXED', 'CLOSED', 'IN_PROGRESS'],
    CLOSED: ['CLOSED'],
  },
};

function getAvailableStatuses(role, currentStatus) {
  if (role === 'ADMIN') return ALL_STATUSES;
  return TRANSITIONS[role]?.[currentStatus] ?? [currentStatus];
}

function getVisibleTickets(role, tickets, currentUserId) {
  if (role === 'DEV') {
    return tickets.filter((t) => t.assignedToId === currentUserId);
  }
  return tickets;
}


const Tickets = () => {
const dispatch = useDispatch();
 const { role, id: currentUserId } = useSelector((state) => state.auth.user) || {};
const {tickets, fetchStatus, updatingIds, error} = useSelector((state) => state.tickets);

useEffect(() => {
    dispatch(fetchTickets());
}, [dispatch]);

if(fetchStatus === 'loading'){
    return <div className="p-6 text-sm text-gray-500">Loading tickets...</div>
}

if (fetchStatus === 'failed') {
    return <div className="p-6 text-sm text-red-600">Failed to load tickets{error ? `: ${error}` : ''}</div>;
  }

const visibleTickets = getVisibleTickets(role, tickets, currentUserId);

return (
    <ul className="max-w-2xl bg-white border border-gray-200 rounded-xl divide-y divide-gray-200 overflow-hidden">
        {visibleTickets.map((ticket) => {
            const options = getAvailableStatuses(role, ticket.status)
            const isUpdating = updatingIds.includes(ticket.id)
            const isLocked = options.length ===1 || isUpdating

            return (
          <li
            key={ticket.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 py-3.5 px-4 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
          >
            {ticket.title}
            <select
              name="ticket status"
              id={`ticket-status-${ticket.id}`}
              value={ticket.status}
              disabled={isLocked}
              onChange={(e) => {
                dispatch(updateTicketStatus({ id: ticket.id, status: e.target.value }));
              }}
              className={`text-sm font-medium rounded-lg px-2.5 py-1.5 border cursor-pointer transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
                STATUS_SELECT_STYLES[ticket.status] || 'border-gray-300 bg-white text-gray-800'
              }`}
            >
                
              {options.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            {isUpdating && <span className="text-xs text-gray-400 italic flex-shrink-0"> updating...</span>}
          </li>
        );
      })}
    </ul>
  );
};

export default Tickets;