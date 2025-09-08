import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  creating: false,
  createError: null,
  lastCreated: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    createBookingRequest(state, action) {
      state.creating = true;
      state.createError = null;
    },
    createBookingSuccess(state, action) {
      state.creating = false;
      state.lastCreated = action.payload;
    },
    createBookingFailure(state, action) {
      state.creating = false;
      state.createError = action.payload || '에러';
    },
  },
});

export const {
  createBookingRequest,
  createBookingSuccess,
  createBookingFailure,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
