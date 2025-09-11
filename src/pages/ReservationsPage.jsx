// src/pages/BookingsPage.jsx
import MyReservations from "@/components/reservation/MyReservations"
import Reservation from "@/components/reservation/Reservation"
import styled from 'styled-components'

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 좌우 2열 */
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* 모바일은 한 열 */
  }
`

export default function ReservationsPage() {
  return (
    <Wrap>
      <div>
        <MyReservations />
      </div>
      <div>
        <Reservation />
      </div>
    </Wrap>
  )
}
