// roomsSaga.js
import { put, takeLatest, delay } from "redux-saga/effects";
import { api } from '../../lib/api';
import { fetchRoomsRequest, fetchRoomsSuccess, fetchRoomsFailure } from "./roomsSlice";

const USE_MOCK = false;

function* fetchRooms() {
  try {
    if (USE_MOCK) {
      yield delay(300); // 로딩 흉내
      const dummyRooms = [
        { id: 1, name: "회의실 A", capacity: 6, floor: 3 },
        { id: 2, name: "회의실 B", capacity: 10, floor: 3 },
        { id: 3, name: "회의실 C", capacity: 4, floor: 5 },
      ];
      yield put(fetchRoomsSuccess(dummyRooms));
      return;
    }

    //실제
    const res = yield call(api.get('/api/meeting-room/all'));
    yield put(fetchRoomsSuccess(res.data));

  } catch (err) {
    yield put(fetchRoomsFailure("불러오기 실패"));
  }
}

export default function* roomsSaga() {
  yield takeLatest(fetchRoomsRequest.type, fetchRooms);
}
