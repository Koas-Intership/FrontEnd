// src/pages/RoomsPage.jsx
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Space, message } from 'antd';
import { fetchRoomsRequest } from '@/features/rooms/roomsSlice';
import ReservationModal from '@/components/reservation/ReservationModal';

export default function RoomsPage() {
  const dispatch = useDispatch();

  // 상태
  const { list, loading, error } = useSelector((s) => s.rooms);
  const { creating, createError, lastCreated } = useSelector((s) => s.reservations);

  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    dispatch(fetchRoomsRequest());
  }, [dispatch]);

  // 에러/성공 메시지
  useEffect(() => {
    if (error) message.error(error);
  }, [error]);

  useEffect(() => {
    if (createError) message.error(createError);
    if (lastCreated) {
      message.success('예약 생성 완료');
      dispatch(fetchRoomsRequest());
    }
  }, [createError, lastCreated, dispatch]);

  const openReservation = (room) => {
    setSelectedRoom(room);
    setIsReservationOpen(true);
  };

  useEffect(() => {
    if (selectedRoom) console.log('[RoomsPage] selectedRoom 변경:', selectedRoom);
  }, [selectedRoom]);

  const columns = [
    { title: '회의실', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '수용인원', dataIndex: 'capacity', key: 'capacity', align: 'center' },
    { title: '위치(층)', dataIndex: 'floor', key: 'floor', align: 'center' },
    {
      title: '예약하기',
      key: 'action',
      align: 'center',
      render: (_, room) => (
        <Space>
          <Button type="primary" loading={creating} onClick={() => openReservation(room)}>
            예약하기
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <h3 style={{ marginLeft: 10 }}>회의실 목록</h3>
        <Button onClick={() => dispatch(fetchRoomsRequest())} loading={loading}>
          새로고침
        </Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={list} loading={loading} />

      <ReservationModal
        open={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        room={selectedRoom}
      />
    </div>
  );
}
