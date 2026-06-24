import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ticketReducer from '../features/tickets/ticketSlice';
import userReducer from '../features/users/userSlice';
import commentReducer from '../features/comments/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    users: userReducer,
    comments: commentReducer
  },
});