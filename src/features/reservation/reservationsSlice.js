import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  creating: false,
  createError: null,
  lastCreated: null,

  //내 예약 목록 상태
  list: [],
  loadingList: false,
  listError: null,

  //전체 예약 목록 상태
  all: [],
  loadingAll: false,
  allError: null,
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    //생성 
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

    // --- 내 예약 불러오기 ---
    fetchMyReservationsRequest(state) {
      state.loadingList = true;
      state.listError = null;
    },
    fetchMyReservationsSuccess(state, action) {
      state.loadingList = false;
      state.list = action.payload || [];
    },
    fetchMyReservationsFailure(state, action) {
      state.loadingList = false;
      state.listError = action.payload || '에러';
    },

    // --- 전체 예약 ---
    fetchAllReservationsRequest(state) {
      state.loadingAll = true;
      state.allError = null;
    },
    fetchAllReservationsSuccess(state, action) {
      state.loadingAll = false;
      state.all = action.payload || [];
    },
    fetchAllReservationsFailure(state, action) {
      state.loadingAll = false;
      state.allError = action.payload || '에러';
    },
  },
});

export const {
  createReservationRequest,
  createReservationSuccess,
  createReservationFailure,

  fetchMyReservationsRequest,
  fetchMyReservationsSuccess,
  fetchMyReservationsFailure,

  fetchAllReservationsRequest,
  fetchAllReservationsSuccess,
  fetchAllReservationsFailure,
} = reservationsSlice.actions;

export default reservationsSlice.reducer;
