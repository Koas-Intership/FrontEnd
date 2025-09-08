import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from '../../lib/api';
import { fetchUserRequest, fetchUserSuccess, fetchUserFailure } from './userSlice';

function fetchRoomsAPI() {
    return api.get('/user');
}

function* fetchUserWorker() {
    try {
        const res = yield call(fetchRoomsAPI);
        yield put(fetchUserSuccess(res.data));
    } catch (err) {
        yield put(fetchUserFailure(err?.response?.data?.message || err.message));
    }
}

export default function* userSaga() {
    yield takeLatest(fetchUserRequest.type, fetchUserWorker);
}
