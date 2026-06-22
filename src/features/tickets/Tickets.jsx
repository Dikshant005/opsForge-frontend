import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';   
import {fetchTickets, updateTicketStatus} from './ticketSlice';

const Tickets = () => {
const dispatch = useDispatch();
const {tickets, status} = useSelector((state) => state.tickets);

useEffect(() => {
    dispatch(fetchTickets());
}, [dispatch]);

if(status === 'loading'){
    return <div>Loading tickets...</div>
}

return (
    <ul>
        {tickets.map(ticket => (
            <li key={ticket.id}>{ticket.title}
            <select name="ticket status" id={`ticket-status-${ticket.id}`} value={ticket.status} onChange={(e)=>{
                dispatch(updateTicketStatus({id:ticket.id, status:e.target.value}))
            }}>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
            </select>
            </li>
            
        ))}
    </ul>
)
}

export default Tickets;