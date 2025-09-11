import { combineReducers } from '@reduxjs/toolkit';
import roomsReducer from '../features/rooms/roomsSlice';
import reservationReducer from '../features/reservation/reservationsSlice';
import userReducer from '../features/user/userSlice';

const rootReducer = combineReducers({
  rooms: roomsReducer,
  reservations: reservationReducer,
  user: userReducer,
});

export default rootReducer;
