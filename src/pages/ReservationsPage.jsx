// src/pages/BookingsPage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import MyReservations from "@/components/reservation/MyReservations";
import Reservation from "@/components/reservation/Reservation";
import styled from "styled-components";
import { fetchRoomsRequest } from '@/features/rooms/roomsSlice'
import { fetchMyReservationsRequest } from "@/features/reservation/reservationsSlice";

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 화면 높이에 반응: 최소 360px, 보통은 50~65vh 권장
const Panel = styled.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0;                    
  min-height: 80vh;             
  height: clamp(80vh); 
  display: flex;
  flex-direction: column;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between; /* 좌우 끝으로 배치 */
  align-items: center;           /* 수직 중앙 정렬 */
  padding: 0 8px;
`;

// 상단 고정 영역(제목/필터/버튼 등)
const PanelHeader = styled.header`
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-weight: 600;
`;

// 실제 스크롤 영역
const PanelBody = styled.div`
  position: relative;
  padding: 12px 16px;
  flex: 1 1 auto;
  overflow-y: auto;              
`;

// 상태 메시지 공통: 가운데 정렬
const Status = styled.div`
  min-height: 280px;            
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.$error ? "#b91c1c" : "#64748b"};
  font-size: 15px;
`;


export default function ReservationsPage() {

  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.rooms);
  const { loadingList, listError } = useSelector((state) => state.reservations);

  useEffect(() => {
    dispatch(fetchRoomsRequest())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchMyReservationsRequest())
  }, [dispatch])
  return (
    <Wrap>
      <Panel>
        <HeaderRow>
          <PanelHeader>내 예약</PanelHeader>
          <Button onClick={() => dispatch(fetchMyReservationsRequest())} loading={loadingList} style={{ border: 'none', backgroundColor: 'none' }}>
            새로고침
          </Button>
        </HeaderRow>
        <PanelBody>
          <MyReservations Status={Status} />
        </PanelBody>
      </Panel>

      <Panel>
        <HeaderRow>
          <PanelHeader>회의실</PanelHeader>
          <Button onClick={() => dispatch(fetchRoomsRequest())} loading={loading} style={{ border: 'none', backgroundColor: 'none' }}>
            새로고침
          </Button>
        </HeaderRow>
        <PanelBody>
          <Reservation />
        </PanelBody>
      </Panel>
    </Wrap>
  );
}
