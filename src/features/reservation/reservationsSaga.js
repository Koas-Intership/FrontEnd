import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from '../../lib/api';
import {
  createReservationRequest,
  createReservationSuccess,
  createReservationFailure,
  fetchMyReservationsRequest,
  fetchMyReservationsSuccess,
  fetchMyReservationsFailure,
  fetchAllReservationsRequest,
  fetchAllReservationsSuccess,
  fetchAllReservationsFailure,
} from './reservationsSlice';

const USE_MOCK = true; // 개발 중 임시

// --- 예약 생성 API ---
function createReservationAPI(payload) {
  return api.post('/api/meeting-room/reservation', payload);
}

// --- 내 예약 불러오기 API ---
function fetchMyReservationsAPI(userId) {
  return api.get(`/api/user/${userId}/reservations`);
}

// --- 전체 예약 불러오기 API ---
function fetchAllReservationsAPI() {
  return api.get('/api/meeting-room/reservations');
}

// --- 예약 생성 사가 ---
function* createReservationWorker(action) {
  try {
    if (USE_MOCK) {
      yield put(createReservationSuccess(action.payload));
      return;
    }
    const res = yield call(createReservationAPI, action.payload);
    yield put(createReservationSuccess(res.data));
  } catch (err) {
    yield put(createReservationFailure(err?.response?.data?.message || err.message));
  }
}

// --- 내 예약 불러오기 사가 ---
function* fetchMyReservationsWorker() {
  try {
    if (USE_MOCK) {
      const mock = [
        { id: 1, title: '스프린트 회의', roomName: '대회의실', date: '2025-09-12', start: '10:00', end: '11:00' },
        { id: 2, title: '리뷰', roomName: '소회의실A', date: '2025-09-13', start: '14:00', end: '15:00' },
      ];
      yield put(fetchMyReservationsSuccess(mock));
      return;
    }
    const res = yield call(fetchMyReservationsAPI);
    yield put(fetchMyReservationsSuccess(res.data));
  } catch (err) {
    yield put(fetchMyReservationsFailure(err?.response?.data?.message || err.message));
  }
}

// --- 전체 예약 불러오기 사가 ---
function* fetchAllReservationsWorker() {
  try {
    if (USE_MOCK) {
      const mock = [
        { id: 1, title: '스프린트 회의', roomName: '대회의실', date: '2025-09-12', start: '10:00', end: '11:00' },
        { id: 2, title: '리뷰', roomName: '소회의실A', date: '2025-09-13', start: '14:00', end: '15:00' },
        { id: 3, title: '리뷰', roomName: '소회의실B', date: '2025-09-13', start: '14:00', end: '15:00' },
      ];
      yield put(fetchAllReservationsSuccess(mock));
      return;
    }
    const res = yield call(fetchAllReservationsAPI);
    yield put(fetchAllReservationsSuccess(res.data));
  } catch (err) {
    yield put(fetchAllReservationsFailure(err?.response?.data?.message || err.message));
  }
}

// --- root saga export ---
export default function* reservationSaga() {
  yield takeLatest(createReservationRequest.type, createReservationWorker);
  yield takeLatest(fetchMyReservationsRequest.type, fetchMyReservationsWorker);
  yield takeLatest(fetchAllReservationsRequest.type, fetchAllReservationsWorker);
}
