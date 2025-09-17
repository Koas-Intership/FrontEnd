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
  cancelReservationRequest,
  cancelReservationSuccess,
  cancelReservationFailure,
} from './reservationsSlice';

const USE_MOCK = false;

// --- 예약 생성 API ---
function createReservationAPI(payload) {
  return api.post('/api/meeting-room/reservation', payload);
}

// --- 내 예약 불러오기 API ---
function fetchMyReservationsAPI() {
  return api.get('/api/meeting-room/reservation/mine');
}

// --- 예약 불러오기 API ---
function fetchAllReservationsAPI(params) {
  return api.get('/api/meeting-room/reservation', params);
}
// --- 예약 취소 API ---
function cancelReservationAPI(reservationId) {
  return api.delete(`/api/meeting-room/reservation/${reservationId}`);
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

// --- 예약 불러오기 사가 ---
function* fetchAllReservationsWorker(action) {
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

    const params = action.payload; // { year, month, (day?) }
    const res = yield call(fetchAllReservationsAPI, { params });

    yield put(fetchAllReservationsSuccess(res.data));
  } catch (err) {
    yield put(fetchAllReservationsFailure(err?.response?.data?.message || err.message));
  }
}

// --- 예약 취소 사가 ---
function* cancelReservationWorker(action) {
  const id = action.payload; // 취소할 예약 id
  try {
    if (USE_MOCK) {
      yield delay(300);
      yield put(cancelReservationSuccess(id));
      return;
    }
    const res = yield call(cancelReservationAPI, id);

    // 서버 응답이 204(No Content)면 본문이 없음 → 요청 id로 성공 처리
    const returnedId = res?.data?.id ?? id;
    yield put(cancelReservationSuccess(returnedId));
  } catch (err) {
    yield put(
      cancelReservationFailure({
        id,
        error: err?.response?.data?.message || err.message || '취소 실패',
      })
    );
  }
}


// --- root saga export ---
export default function* reservationSaga() {
  yield takeLatest(createReservationRequest.type, createReservationWorker);
  yield takeLatest(fetchMyReservationsRequest.type, fetchMyReservationsWorker);
  yield takeLatest(fetchAllReservationsRequest.type, fetchAllReservationsWorker);
  yield takeLatest(cancelReservationRequest.type, cancelReservationWorker);
}
