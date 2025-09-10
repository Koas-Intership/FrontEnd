// src/components/reservation/MyReservations.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyReservationsRequest } from '@/features/reservation/reservationsSlice';
import ReservationCancelModal from './ReservationCancelModal';

export default function MyReservations() {
    const dispatch = useDispatch();
    const { list, loadingList, listError } = useSelector((state) => state.reservations);

    useEffect(() => {
        dispatch(fetchMyReservationsRequest());
    }, [dispatch]);

    // --취소 모달--
    const [cancelTarget, setCancelTarget] = useState(null);
    const openCancel = (reservation) => setCancelTarget(reservation);
    const closeCancel = () => setCancelTarget(null);

    const handleConfirmCancel = () => {
        // TODO: dispatch(cancelReservationRequest(cancelTarget.id))
        closeCancel();
    };

    if (loadingList) return <div>내 예약 불러오는 중...</div>;
    if (listError) return <div style={{ color: 'red' }}>{listError}</div>;
    if (!list || list.length === 0) return <div>예약이 없습니다.</div>;

    return (
        <div>
            <h3 style={{ marginLeft: 10 }}>내 예약</h3>
            <ul
                style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'grid',
                    gap: 12,
                    gridTemplateColumns: '1fr',
                }}
            >
                {list.map((r) => (
                    <li
                        key={r.id}
                        style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: 12,
                            padding: 16,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                            background: '#fff',
                        }}
                    >
                        {/* 상단: 제목 + 회의실 */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: 12,
                            }}
                        >
                            <div style={{ fontWeight: 700 }}>{r.title}</div>
                            <div style={{ color: '#6b7280', fontSize: 14 }}>{r.roomName}</div>
                        </div>

                        {/* 하단: 날짜 + 시간 + 버튼 */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <div>
                                <div style={{ color: '#374151', fontSize: 14 }}>📅 {r.date}</div>
                                <div style={{ color: '#374151', fontSize: 14 }}>⏰ {r.start} ~ {r.end}</div>
                            </div>

                            <button
                                type="button"
                                style={{
                                    border: '1px solid #ef4444',
                                    color: '#ef4444',
                                    background: 'transparent',
                                    padding: '6px 12px',
                                    borderRadius: 8,
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                                onClick={() => openCancel(r)}
                            >
                                취소하기
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {/* 모달은 한 번만, 루트에서 렌더링 */}
            <ReservationCancelModal
                open={!!cancelTarget}
                reservation={cancelTarget}
                onClose={closeCancel}
                onConfirm={handleConfirmCancel}
            />
        </div>
    );
}
