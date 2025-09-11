import { all, fork } from 'redux-saga/effects';
import roomsSaga from '../features/rooms/roomsSaga';
import reservationsSaga from '../features/reservation/reservationsSaga';
import userSaga from '../features/user/userSaga';

export default function* rootSaga() {
  yield all([fork(roomsSaga), fork(reservationsSaga), fork(userSaga)]);
}
