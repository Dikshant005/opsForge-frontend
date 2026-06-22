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
    return <div>Loading tickets...</div>
}

if (fetchStatus === 'failed') {
    return <div>Failed to load tickets{error ? `: ${error}` : ''}</div>;
  }

const visibleTickets = getVisibleTickets(role, tickets, currentUserId);

return (
    <ul>
        {visibleTickets.map((ticket) => {
            const options = getAvailableStatuses(role, ticket.status)
            const isUpdating = updatingIds.includes(ticket.id)
            const isLocked = options.length ===1 || isUpdating

            return (
          <li key={ticket.id}>
            {ticket.title}
            <select
              name="ticket status"
              id={`ticket-status-${ticket.id}`}
              value={ticket.status}
              disabled={isLocked}
              onChange={(e) => {
                dispatch(updateTicketStatus({ id: ticket.id, status: e.target.value }));
              }}
            >
                
              {options.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            {isUpdating && <span> updating...</span>}
          </li>
        );
      })}
    </ul>
  );
};

export default Tickets;