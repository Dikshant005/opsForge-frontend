// reusable pieces shared by AdminDashboard / DevDashboard / QaDashboard.

export const StatCard = ({ label, value, color = 'text-blue-600' }) => (
    <div className="bg-white p-6 rounded-lg shadow border flex flex-col items-center h-full">
        <span className="text-sm text-gray-500 font-semibold tracking-wider text-center">
            {label}
        </span>
        <span className={`text-4xl font-bold mt-auto pt-2 ${color}`}>
            {value}
        </span>
    </div>
);

export const TicketSection = ({ title, tickets, emptyText }) => (
    <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
        {tickets && tickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                ))}
            </div>
        ) : (
            <div className="text-gray-400 italic">{emptyText}</div>
        )}
    </div>
);

const TicketCard = ({ ticket }) => (
    <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex justify-between items-start gap-2">
            <span className="font-semibold text-gray-800">
                {ticket.title || `Ticket #${ticket.id}`}
            </span>
            {ticket.priority && (
                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 whitespace-nowrap">
                    {ticket.priority}
                </span>
            )}
        </div>
        {ticket.status && (
            <span className="text-xs text-gray-500 mt-1 inline-block">
                {ticket.status.replace('_', ' ')}
            </span>
        )}
    </div>
);