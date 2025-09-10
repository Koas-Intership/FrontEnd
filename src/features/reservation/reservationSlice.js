import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  creating: false,
  createError: null,
  lastCreated: null,
};

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    createReservationRequest(state, action) {
      state.creating = true;
      state.createError = null;
    },
    createReservationSuccess(state, action) {
      state.creating = false;
      state.lastCreated = action.payload;
    },
    createReservationFailure(state, action) {
      state.creating = false;
      state.createError = action.payload || '에러';
    },
  },
});

export const {
  createReservationRequest,
  createReservationSuccess,
  createReservationFailure,
} = reservationSlice.actions;

export default reservationSlice.reducer;
