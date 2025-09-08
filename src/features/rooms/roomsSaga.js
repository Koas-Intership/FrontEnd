import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from '../../lib/api';
import { fetchRoomsRequest, fetchRoomsSuccess, fetchRoomsFailure } from './roomsSlice';

function fetchRoomsAPI() {
  return api.get('/rooms');
}

function* fetchRoomsWorker() {
  try {
    const res = yield call(fetchRoomsAPI);
    yield put(fetchRoomsSuccess(res.data));
  } catch (err) {
    yield put(fetchRoomsFailure(err?.response?.data?.message || err.message));
  }
}

export default function* roomsSaga() {
  yield takeLatest(fetchRoomsRequest.type, fetchRoomsWorker);
}
