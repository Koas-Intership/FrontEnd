import { combineReducers } from '@reduxjs/toolkit';
import roomsReducer from '../features/rooms/roomsSlice';
import bookingsReducer from '../features/bookings/bookingsSlice';
import userReducer from '../features/user/userSlice';

const rootReducer = combineReducers({
  rooms: roomsReducer,
  bookings: bookingsReducer,
  user: userReducer,
});

export default rootReducer;
