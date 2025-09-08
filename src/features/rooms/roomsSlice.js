import { createSlice } from '@reduxjs/toolkit';

const initialState = { list: [], loading: false, error: null };

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    fetchRoomsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRoomsSuccess(state, action) {
      state.loading = false;
      state.list = action.payload;
    },
    fetchRoomsFailure(state, action) {
      state.loading = false;
      state.error = action.payload || '에러';
    },
  },
});

export const { fetchRoomsRequest, fetchRoomsSuccess, fetchRoomsFailure } = roomsSlice.actions;
export default roomsSlice.reducer;
