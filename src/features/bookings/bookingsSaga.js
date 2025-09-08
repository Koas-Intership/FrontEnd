import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from '../../lib/api';
import {
  createBookingRequest,
  createBookingSuccess,
  createBookingFailure,
} from './bookingsSlice';

function createBookingAPI(payload) {
  // payload: { roomId, date, start, end, title }
  return api.post('/bookings', payload);
}

function* createBookingWorker(action) {
  try {
    const res = yield call(createBookingAPI, action.payload);
    yield put(createBookingSuccess(res.data));
    // 성공 후 목록 재조회가 필요하면 여기서 rooms나 내 예약 목록 요청을 추가 디스패치
  } catch (err) {
    yield put(createBookingFailure(err?.response?.data?.message || err.message));
  }
}

export default function* bookingsSaga() {
  yield takeLatest(createBookingRequest.type, createBookingWorker);
}
