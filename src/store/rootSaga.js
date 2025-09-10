import { all, fork } from 'redux-saga/effects';
import roomsSaga from '../features/rooms/roomsSaga';
import reservationSaga from '../features/reservation/reservationSaga';
import userSaga from '../features/user/userSaga';

export default function* rootSaga() {
  yield all([fork(roomsSaga), fork(reservationSaga), fork(userSaga)]);
}
