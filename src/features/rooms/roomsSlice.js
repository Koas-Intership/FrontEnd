import { createSlice } from '@reduxjs/toolkit';

const initialState = { list: [], loading: false, error: null };

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    fetchRoomsRequest(state) {
      state.loading = true;
      state.error = null;
      console.log("1. fetchRoomsRequest");
    },
    fetchRoomsSuccess(state, action) {
      state.loading = false;
      state.list = action.payload;
      console.log("2. fetchRoomsSuccess");
    },
    fetchRoomsFailure(state, action) {
      state.loading = false;
      state.error = action.payload || '에러';
    },
  },
});

export const { fetchRoomsRequest, fetchRoomsSuccess, fetchRoomsFailure } = roomsSlice.actions;
export default roomsSlice.reducer;
