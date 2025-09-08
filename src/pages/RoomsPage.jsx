import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Table, Space, message } from 'antd'
import { fetchRoomsRequest } from '../features/rooms/roomsSlice'
import { createBookingRequest } from '../features/bookings/bookingsSlice'

export default function RoomsPage() {
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector((s) => s.rooms)
  const { creating, createError, lastCreated } = useSelector((s) => s.bookings)

  useEffect(() => {
    dispatch(fetchRoomsRequest())
  }, [dispatch])

  useEffect(() => {
    if (error) message.error(error)
  }, [error])

  useEffect(() => {
    if (createError) message.error(createError)
    if (lastCreated) message.success('예약 생성 완료')
  }, [createError, lastCreated])

  const columns = [
    { title: '회의실', dataIndex: 'name', key: 'name' },
    { title: '수용인원', dataIndex: 'capacity', key: 'capacity' },
    {
      title: '액션',
      key: 'action',
      render: (_, room) => (
        <Space>
          <Button
            type="primary"
            loading={creating}
            onClick={() =>
              dispatch(
                createBookingRequest({
                  roomId: room.id,
                  date: '2025-09-09',
                  start: '10:00',
                  end: '11:00',
                  title: '테스트 회의',
                }),
              )
            }
          >
            이 시간 예약
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h3>회의실 목록</h3>
      <Button onClick={() => dispatch(fetchRoomsRequest())} loading={loading} style={{ marginBottom: 12 }}>
        새로고침
      </Button>
      <Table rowKey="id" columns={columns} dataSource={list} loading={loading} />
    </div>
  )
}
