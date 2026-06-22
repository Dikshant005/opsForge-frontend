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
    async({id, role}, thunkAPI) => {
        try{
            const response = await axiosClient.put(`/api/users/${id}/role`, {role});
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
        status: 'idle',
        error: null
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
                const user = state.users.find(u => u.id === action.payload.id);
                if (user) {
                    user.role = action.payload.role;
                }
            });
    }
});

export default userSlice.reducer;