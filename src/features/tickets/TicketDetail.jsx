import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTicketById, assignTicket, clearCurrentTicket } from '../../features/tickets/ticketSlice';
import axiosClient from '../../api/axiosClient';

// ASSUMPTIONS (flagging these since they weren't confirmed in our earlier back-and-forth):
// 1. Auth state lives at state.auth.user and has a `.role` field ('ADMIN' | 'DEV' | 'QA').
//    Swap the selector below if your auth slice is shaped differently.
// 2. The tickets slice is registered in the store under the key "tickets"
//    (i.e. configureStore({ reducer: { tickets: ticketSlice.reducer } })).
// 3. Status values beyond "PENDING" weren't confirmed, so the badge below has a few
//    common guesses with a neutral fallback for anything else - it won't break on an
//    unknown status, but swap statusBadgeClass's cases for your real enum.
// 4. Route is assumed to be /dashboard/tickets/:id and the back-link points at
//    /dashboard/tickets - update both if your router differs.

function statusBadgeClass(status) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800';
    case 'RESOLVED':
    case 'CLOSED':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

const MultiSelectDropdown = ({ options, selectedIds, toggleOption, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-gray-300 px-3 py-2 rounded text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>
          {selectedIds.length === 0 ? `Select ${label}...` : `${selectedIds.length} ${label} selected`}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
             <div className="px-3 py-2 text-sm text-gray-500">No options found.</div>
          ) : (
            <div className="p-2 space-y-1">
              {options.map((option) => (
                <label key={option.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer text-sm text-gray-800">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  {option.username}
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TicketDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentTicket, ticketDetailStatus, assignStatus, error } = useSelector(
    (state) => state.tickets
  );
  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = currentUser?.role === 'ADMIN';

  const [devList, setDevList] = useState([]);
  const [qaList, setQaList] = useState([]);
  const [usersLoadError, setUsersLoadError] = useState('');

  const [selectedDevIds, setSelectedDevIds] = useState([]);
  const [selectedQaIds, setSelectedQaIds] = useState([]);
  const [prevTicket, setPrevTicket] = useState(null);
  const [assignError, setAssignError] = useState('');
  const [justAssigned, setJustAssigned] = useState(false);

  // Sync local form state when the ticket arrives or changes
  if (currentTicket !== prevTicket) {
    setPrevTicket(currentTicket);
    setSelectedDevIds(currentTicket?.developers.map((d) => d.id) || []);
    setSelectedQaIds(currentTicket?.reviewers.map((r) => r.id) || []);
  }

  // Load the ticket, and clear it on the way out so a stale ticket
  // never flashes if the user navigates straight to another one.
  useEffect(() => {
    dispatch(fetchTicketById(id));
    return () => dispatch(clearCurrentTicket());
  }, [dispatch, id]);

  // Only admins ever see the assign panel, so only admins need the dropdown data.
  useEffect(() => {
    if (!isAdmin) return;

    let isMounted = true;
    const loadAssignableUsers = async () => {
      try {
        const [devRes, qaRes] = await Promise.all([
          axiosClient.get('/api/users/developers'),
          axiosClient.get('/api/users/qas'),
        ]);
        if (!isMounted) return;
        // Backend already filters to active + APPROVED, this is just belt-and-suspenders.
        setDevList(devRes.data.filter((u) => u.active && u.accountStatus === 'APPROVED'));
        setQaList(qaRes.data.filter((u) => u.active && u.accountStatus === 'APPROVED'));
      } catch {
        if (isMounted) setUsersLoadError('Could not load the list of developers/QAs.');
      }
    };

    loadAssignableUsers();
    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  const toggleDev = (devId) => {
    setSelectedDevIds((prev) =>
      prev.includes(devId) ? prev.filter((d) => d !== devId) : [...prev, devId]
    );
  };

  const toggleQa = (qaId) => {
    setSelectedQaIds((prev) =>
      prev.includes(qaId) ? prev.filter((q) => q !== qaId) : [...prev, qaId]
    );
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setAssignError('');
    setJustAssigned(false);

    // Mirrors the backend rule: at least 1 dev and 1 QA, enforced here too
    // so the user gets immediate feedback instead of a round-trip 400.
    if (selectedDevIds.length === 0 || selectedQaIds.length === 0) {
      setAssignError('At least one Developer and one QA must be assigned.');
      return;
    }

    const result = await dispatch(
      assignTicket({ id, developerIds: selectedDevIds, qaIds: selectedQaIds })
    );
    if (assignTicket.fulfilled.match(result)) {
      setJustAssigned(true);
    } else {
      setAssignError(result.payload?.message || 'Failed to update assignment.');
    }
  };

  if (ticketDetailStatus === 'loading') {
    return <div className="p-6 text-sm text-gray-500">Loading ticket...</div>;
  }

  if (ticketDetailStatus === 'failed') {
    return (
      <div className="p-6 text-sm text-red-600">
        {error?.message || 'Could not load this ticket.'}
      </div>
    );
  }

  if (!currentTicket) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/dashboard/tickets" className="text-sm text-blue-600 hover:underline">
        &larr; Back to All Tickets
      </Link>

      {currentTicket.deleted && (
        <div className="mt-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2">
          This ticket has been deleted.
        </div>
      )}

      <div className="mt-4 bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">{currentTicket.title}</h1>
          <span
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
              currentTicket.status
            )}`}
          >
            {currentTicket.status}
          </span>
        </div>

        <p className="mt-3 text-gray-700 whitespace-pre-wrap">{currentTicket.description}</p>

        <p className="mt-3 text-xs text-gray-400">
          Created {new Date(currentTicket.createdAt).toLocaleString()}
        </p>

        {currentTicket.attachmentUrl && (
          <div className="mt-5">
            <p className="text-sm font-medium text-gray-600 mb-2">Attachment</p>
            <a href={currentTicket.attachmentUrl} target="_blank" rel="noreferrer">
              <img
                src={currentTicket.attachmentUrl}
                alt="Ticket attachment"
                className="max-h-72 rounded border border-gray-200"
              />
            </a>
          </div>
        )}

        {/* Current assignees, visible to every role */}
        <div className="mt-6 grid grid-cols-2 gap-6 border-t border-gray-100 pt-5">
          <div>
            <p className="text-sm font-medium text-gray-600">Developers</p>
            <ul className="mt-1 space-y-1">
              {currentTicket.developers.length === 0 && (
                <li className="text-sm text-gray-400">Unassigned</li>
              )}
              {currentTicket.developers.map((dev) => (
                <li key={dev.id} className="text-sm text-gray-800">
                  {dev.username}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">QAs</p>
            <ul className="mt-1 space-y-1">
              {currentTicket.reviewers.length === 0 && (
                <li className="text-sm text-gray-400">Unassigned</li>
              )}
              {currentTicket.reviewers.map((reviewer) => (
                <li key={reviewer.id} className="text-sm text-gray-800">
                  {reviewer.username}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Assign panel - admin only */}
      {isAdmin && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Assign Ticket</h2>

          {usersLoadError && (
            <p className="mb-3 text-sm text-red-600">{usersLoadError}</p>
          )}

          <form onSubmit={handleAssign}>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Developers</p>
                {usersLoadError && devList.length === 0 ? (
                  <p className="text-xs text-red-400">Error loading developers.</p>
                ) : (
                  <MultiSelectDropdown 
                    label="Developers" 
                    options={devList} 
                    selectedIds={selectedDevIds} 
                    toggleOption={toggleDev} 
                  />
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">QAs</p>
                {usersLoadError && qaList.length === 0 ? (
                  <p className="text-xs text-red-400">Error loading QAs.</p>
                ) : (
                  <MultiSelectDropdown 
                    label="QAs" 
                    options={qaList} 
                    selectedIds={selectedQaIds} 
                    toggleOption={toggleQa} 
                  />
                )}
              </div>
            </div>

            {assignError && <p className="mt-4 text-sm text-red-600">{assignError}</p>}
            {justAssigned && !assignError && (
              <p className="mt-4 text-sm text-green-600">Assignment updated.</p>
            )}

            <button
              type="submit"
              disabled={assignStatus === 'loading'}
              className="mt-5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded disabled:opacity-50"
            >
              {assignStatus === 'loading' ? 'Saving...' : 'Save Assignment'}
            </button>
          </form>
        </div>
      )}

      {/* Placeholder - needs a status-history endpoint that doesn't exist yet */}
      <div className="mt-6 bg-white rounded-lg shadow p-6 border border-dashed border-gray-200">
        <h2 className="text-lg font-semibold text-gray-400 mb-1">Status History</h2>
        <p className="text-sm text-gray-400">
          Not wired up yet - needs a backend endpoint (e.g. GET /api/tickets/{id}/history)
          that returns status change events.
        </p>
      </div>

      {/* Placeholder - needs a comments endpoint that doesn't exist yet */}
      <div className="mt-6 bg-white rounded-lg shadow p-6 border border-dashed border-gray-200">
        <h2 className="text-lg font-semibold text-gray-400 mb-1">Comments</h2>
        <p className="text-sm text-gray-400">
          Not wired up yet - needs GET/POST /api/tickets/{id}/comments from the backend.
        </p>
      </div>
    </div>
  );
};

export default TicketDetail;