// src/components/reservation/DashboardReservations.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReservationsRequest } from "@/features/reservation/reservationsSlice";

export default function DashboardReservations() {
    const dispatch = useDispatch();
    const { all, loadingAll, allError } = useSelector((state) => state.reservations);

    useEffect(() => {
        dispatch(fetchAllReservationsRequest());
    }, [dispatch]);

    if (loadingAll) return <div>전체 예약 불러오는 중...</div>;
    if (allError) return <div style={{ color: "red" }}>{allError}</div>;
    if (!all || all.length === 0) return <div>예약이 없습니다.</div>;

    return (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>제목</th>
                    <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>회의실</th>
                    <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>날짜</th>
                    <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>시간</th>
                </tr>
            </thead>
            <tbody>
                {all.map((r) => (
                    <tr key={r.id}>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: 8 }}>{r.title}</td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: 8 }}>{r.roomName}</td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: 8 }}>{r.date}</td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: 8 }}>
                            {r.start} ~ {r.end}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
