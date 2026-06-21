import { createSlice } from '@reduxjs/toolkit';

const tokenFromStorage = localStorage.getItem('token');

const initialState = {
  // Define your initial state properties here
  user: null,
  token: tokenFromStorage, // hydrate token from localStorage if it exists
  isAuthenticated: !!tokenFromStorage, // Set to true if token exists, false otherwise
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
    logout: (state) => {
      // 1. Clear the state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // 2. Remove the token from localStorage
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;