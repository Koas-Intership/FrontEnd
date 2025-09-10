import { combineReducers } from '@reduxjs/toolkit';
import roomsReducer from '../features/rooms/roomsSlice';
import reservationReducer from '../features/reservation/reservationSlice';
import userReducer from '../features/user/userSlice';

const rootReducer = combineReducers({
  rooms: roomsReducer,
  reservation: reservationReducer,
  user: userReducer,
});

export default rootReducer;
