// src/components/reservation/DashboardReservations.jsx
export default function DashboardReservations({ items = [], loading = false, error = null }) {
    if (loading) return <div>전체 예약 불러오는 중...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!items.length) return <div>예약이 없습니다.</div>;

    return (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    <th style={{ borderBottom: "1px solid #ddd", padding: 8, textAlign: "center" }}>회의 주제</th>
                    <th style={{ borderBottom: "1px solid #ddd", padding: 8, textAlign: "center" }}>회의실</th>
                    <th style={{ borderBottom: "1px solid #ddd", padding: 8, textAlign: "center" }}>날짜</th>
                    <th style={{ borderBottom: "1px solid #ddd", padding: 8, textAlign: "center" }}>시간</th>
                </tr>
            </thead>
            <tbody>
                {items.map((r) => (
                    <tr key={r.id}>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: 8, textAlign: "center" }}>{r.title}</td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: 8, textAlign: "center" }}>{r.roomName}</td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: 8, textAlign: "center" }}>{r.date}</td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: 8, textAlign: "center" }}>
                            {r.start} ~ {r.end}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
