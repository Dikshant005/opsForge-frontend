import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient';

export const fetchTickets = createAsyncThunk(
    'tickets/fetchTickets',
    async(filters={},thunkAPI)=>{
        try{
            const params = new URLSearchParams(filters).toString();
            const url = params ? `/api/tickets?${params}` : '/api/tickets';

            const response = await axiosClient.get(url);
            return response.data;
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)

export const createTicket = createAsyncThunk(
    'tickets/createTicket',
    async(ticketData, thunkAPI) => {
        try{
            const response = await axiosClient.post('/api/tickets', ticketData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            });
            return response.data;
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)

export const updateTicketStatus = createAsyncThunk(
    'tickets/updateTicketStatus',
    async({id, status}, thunkAPI) => {
        try{
            const response = await axiosClient.put(`/api/tickets/${id}/status`, {status});
            return response.data;
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)

const ticketSlice = createSlice({
    name:'tickets',
    initialState:{
        tickets:[],
        fetchstatus:'idle',
        createStatus: 'idle',
        updatingIds: [],
        error:null
    },
    reducers:{},
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
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        const id = action.meta.arg.id;
        state.updatingIds = state.updatingIds.filter((updatingId) => updatingId !== id);
        state.error = action.payload || 'Failed to update ticket status';
      });
  },
});

export default ticketSlice.reducer;