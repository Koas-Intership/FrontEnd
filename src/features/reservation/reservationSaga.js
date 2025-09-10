import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from '../../lib/api';
import {
  createReservationRequest,
  createReservationSuccess,
  createReservationFailure,
} from './reservationSlice';

const USE_MOCK = true; // ✅ 개발 중 임시

function createReservationAPI(payload) {
  // payload: { roomId, date, start, end, title }
  return api.post('/reservation', payload);
}

function* createReservationWorker(action) {
  try {

    if (USE_MOCK) {
      yield put(createReservationSuccess(action.payload));
      console.log("[reservationSaga] 예약정보: ", action.payload);
      return;
    }

    // 백엔드와 연결
    const res = yield call(createReservationAPI, action.payload);
    yield put(createReservationSuccess(res.data));

  } catch (err) {
    yield put(createReservationFailure(err?.response?.data?.message || err.message));
  }
}

export default function* reservationSaga() {
  yield takeLatest(createReservationRequest.type, createReservationWorker);
}
