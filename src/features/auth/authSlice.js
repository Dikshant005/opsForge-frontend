import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

const tokenFromStorage = localStorage.getItem('token');


// Creating Thunk
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    try{
        const response = await axiosClient.get('/api/users/me')
        return response.data
    }
    catch(error){
        return thunkAPI.rejectWithValue(error.response.data)
    }
  },
)

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, thunkAPI) => {
        try{
            // hit the logout endpoint
            await axiosClient.post('/api/auth/logout');
            
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data)
        }   
        finally{
            // Clear the token from localStorage
            localStorage.removeItem('token');
        }
    }
)

const initialState = {
  // Define your initial state properties here
  user: null,
  token: tokenFromStorage, // hydrate token from localStorage if it exists
  isAuthenticated: !!tokenFromStorage, // Set to true if token exists, false otherwise
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // 1. Update the state with the payload (user and token)
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // 2. Save the token to localStorage here as well!
      localStorage.setItem('token', action.payload.token);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.status = 'failed';
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        
      })
  }
});

export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;