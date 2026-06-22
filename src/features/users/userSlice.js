import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { createSlice } from "@reduxjs/toolkit";



export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async(filters={},thunkAPI)=>{
        try{
            const params = new URLSearchParams(filters).toString();
            const url = params ? `/api/users?${params}` : '/api/users';

            const response = await axiosClient.get(url);
            return response.data;
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)

export const updateUserRole = createAsyncThunk(
    'users/updateUserRole',
    async({username, role}, thunkAPI) => {
        try{
            const response = await axiosClient.put(`/api/users/${username}/role`, {role});
            return response.data;
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)

export const listOfPendingApprovals = createAsyncThunk(
    'users/listOfPendingApprovals',
    async(_,thunkAPI)=>{
        try{
            const response = await axiosClient.get(`/api/users/pending`);
            return response.data;
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)

export const updateApprovalStatus = createAsyncThunk(
    'users/updateApprovalStatus',
    async({username, status},thunkAPI)=>{
        try{
            const response = await axiosClient.put(`/api/users/${username}/approve`, {status});
            return response.data;
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        pendingApprovals: [],
        status: 'idle',
        error: null,
        pendingStatus: 'idle',
        
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch users';
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                const { username, role } = action.meta.arg;
                const user = state.users.find(u => u.username === username);
                if (user) {
                    user.role = role;
                }
            })
            .addCase(listOfPendingApprovals.pending, (state) => {
            state.pendingStatus = 'loading';
            })
            .addCase(listOfPendingApprovals.fulfilled, (state, action) => {
                state.pendingStatus = 'succeeded';
                state.pendingApprovals = action.payload; 
            })
            .addCase(updateApprovalStatus.fulfilled, (state, action) => {
                const { username } = action.meta.arg;
                state.pendingApprovals = state.pendingApprovals.filter(u => u.username !== username);
            })
    }
});

export default userSlice.reducer;