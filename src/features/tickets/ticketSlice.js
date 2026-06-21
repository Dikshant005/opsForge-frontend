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
        status:'idle',
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        // fetchTickets
        .addCase(fetchTickets.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchTickets.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.tickets = action.payload;
        })
        .addCase(fetchTickets.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || 'Failed to fetch tickets';
        })

        // createTicket
        .addCase(createTicket.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(createTicket.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.tickets.push(action.payload); // Add the new ticket to the list
        })
        .addCase(createTicket.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || 'Failed to create ticket';
        })

        // updateTicketStatus
        .addCase(updateTicketStatus.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(updateTicketStatus.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
            if (index !== -1) {
                state.tickets[index] = action.payload;
            }
        })
        .addCase(updateTicketStatus.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || 'Failed to update ticket status';
        });
    }
})

export default ticketSlice.reducer;