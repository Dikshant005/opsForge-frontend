import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (filters = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const url = params ? `/api/tickets?${params}` : '/api/tickets';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchTicketById',
  async (id, thunkAPI) => {
    try {
      const response = await axiosClient.get(`/api/tickets/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData, thunkAPI) => {
    try {
      const response = await axiosClient.post('/api/tickets', ticketData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  'tickets/updateTicketStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await axiosClient.put(`/api/tickets/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Admin-only. Backend expects { developerIds: [], qaIds: [] }
export const assignTicket = createAsyncThunk(
  'tickets/assignTicket',
  async ({ id, developerIds, qaIds }, thunkAPI) => {
    try {
      const response = await axiosClient.put(`/api/tickets/${id}/assign`, {
        developerIds,
        qaIds,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    fetchStatus: 'idle',
    createStatus: 'idle',
    updatingIds: [],

    // fetchTicketById/assignTicket write here now, instead of into the shared `tickets` array
    currentTicket: null,
    ticketDetailStatus: 'idle', // idle | loading | succeeded | failed
    assignStatus: 'idle', // idle | loading | succeeded | failed

    error: null,
  },
  reducers: {
    // call on TicketDetail unmount so a stale ticket doesn't flash when
    // navigating straight from one ticket's URL to another
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
      state.ticketDetailStatus = 'idle';
      state.assignStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload || 'Failed to fetch tickets';
      })

      // now isolated from the list's loading state and the tickets array
      .addCase(fetchTicketById.pending, (state) => {
        state.ticketDetailStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.ticketDetailStatus = 'succeeded';
        state.currentTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.ticketDetailStatus = 'failed';
        state.error = action.payload || 'Failed to fetch ticket';
      })

      .addCase(createTicket.pending, (state) => {
        state.createStatus = 'loading';
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.tickets.push(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload || 'Failed to create ticket';
      })

      .addCase(updateTicketStatus.pending, (state, action) => {
        const id = action.meta.arg.id;
        if (!state.updatingIds.includes(id)) {
          state.updatingIds.push(id);
        }
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.updatingIds = state.updatingIds.filter((id) => id !== action.payload.id);
        const index = state.tickets.findIndex((ticket) => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.currentTicket?.id === action.payload.id) {
          state.currentTicket = action.payload;
        }
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        const id = action.meta.arg.id;
        state.updatingIds = state.updatingIds.filter((updatingId) => updatingId !== id);
        state.error = action.payload || 'Failed to update ticket status';
      })

      .addCase(assignTicket.pending, (state) => {
        state.assignStatus = 'loading';
      })
      .addCase(assignTicket.fulfilled, (state, action) => {
        state.assignStatus = 'succeeded';
        state.currentTicket = action.payload;
        const index = state.tickets.findIndex((ticket) => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(assignTicket.rejected, (state, action) => {
        state.assignStatus = 'failed';
        state.error = action.payload || 'Failed to assign ticket';
      });
  },
});

export const { clearCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer;