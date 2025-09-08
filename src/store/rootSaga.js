import { all, fork } from 'redux-saga/effects';
import roomsSaga from '../features/rooms/roomsSaga';
import bookingsSaga from '../features/bookings/bookingsSaga';
import userSaga from '../features/user/userSaga';

export default function* rootSaga() {
  yield all([fork(roomsSaga), fork(bookingsSaga), fork(userSaga)]);
}
