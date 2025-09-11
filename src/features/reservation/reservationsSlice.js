import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // 예약 생성 상태
  creating: false,
  createError: null,
  lastCreated: null,

  // 내 예약 목록 상태
  list: [],
  loadingList: false,
  listError: null,

  // 전체 예약 목록 상태
  all: [],
  loadingAll: false,
  allError: null,

  // 예약 취소 상태
  cancelingById: {},      // 예: { "res_123": true }
  cancelErrorById: {},    // 예: { "res_123": "권한 없음" }
  lastCanceled: null,     // 예: "res_123"
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

    // 예약 취소
    cancelReservationRequest(state, action) {
      const id = action.payload;                 // 취소할 예약 id
      state.cancelingById[id] = true;
      delete state.cancelErrorById[id];          // 이전 에러 초기화
    },
    cancelReservationSuccess(state, action) {
      const id = action.payload;
      state.cancelingById[id] = false;
      state.lastCanceled = id;

      // 목록에서 제거
      state.list = state.list.filter(r => r.id !== id);
      state.all = state.all.filter(r => r.id !== id);
    },
    cancelReservationFailure(state, action) {
      const { id, error } = action.payload || {};
      state.cancelingById[id] = false;
      state.cancelErrorById[id] = error || '취소 에러';
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

  cancelReservationRequest,
  cancelReservationSuccess,
  cancelReservationFailure,
} = reservationsSlice.actions;

export default reservationsSlice.reducer;
