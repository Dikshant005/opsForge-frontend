import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchTicketComments = createAsyncThunk(
  'comments/fetchTicketComments',
  async (ticketId, thunkAPI) => {
    try {
      const response = await axiosClient.get(`/api/comments/ticket/${ticketId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async (formData, thunkAPI) => {
    try {
      const response = await axiosClient.post('/api/comments', formData, {
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

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    items: [],
    fetchStatus: 'idle', // idle | loading | succeeded | failed
    addStatus: 'idle',   // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearComments: (state) => {
      state.items = [];
      state.fetchStatus = 'idle';
      state.addStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketComments.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchTicketComments.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTicketComments.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload || 'Failed to fetch comments';
      })
      .addCase(addComment.pending, (state) => {
        state.addStatus = 'loading';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.addStatus = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.error = action.payload || 'Failed to add comment';
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
