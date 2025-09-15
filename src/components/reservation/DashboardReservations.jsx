// src/components/reservation/DashboardReservations.jsx
import dayjs from "dayjs";
import "dayjs/locale/ko";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
dayjs.locale("ko");

export default function DashboardReservations({ items = [], loading = false, error = null }) {
    if (loading) return <div style={{ padding: 12 }}>전체 예약 불러오는 중...</div>;
    if (error) return <div style={{ color: "red", padding: 12 }}>{error}</div>;
    if (!items.length) return <div style={{ padding: 12 }}>예약이 없습니다.</div>;

    const todayStr = dayjs().format("YYYY-MM-DD");

    return (
        <div
            style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                background: "#fff",
            }}
        >
            {/* 상단 헤더 */}
            <div
                style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #eef2f7",
                    background:
                        "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 100%)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}
            >
                <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "#ecfeff",
                        color: "#0891b2",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 16,
                        border: "1px solid #cffafe",
                    }}
                >
                    📅
                </div>
                <div style={{ fontWeight: 700 }}>전체 예약</div>
                <div style={{ marginLeft: "auto", fontSize: 12, color: "#6b7280" }}>
                    총 {items.length}건
                </div>
            </div>

            {/* 표 */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: "#f8fafc" }}>
                            {["회의 주제", "회의실", "날짜", "시간"].map((h) => (
                                <th
                                    key={h}
                                    style={{
                                        borderBottom: "1px solid #e5e7eb",
                                        padding: "10px 12px",
                                        textAlign: "center",
                                        color: "#374151",
                                        fontWeight: 600,
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((r, idx) => {
                            // 시간 파싱 (startAt/endAt 우선)
                            const timeFmt =
                                (r?.startTime || "").length === 8 ? "HH:mm:ss" : "HH:mm";
                            const start = r?.startAt
                                ? dayjs(r.startAt)
                                : dayjs(`${r?.reservationDate} ${r?.startTime}`, `YYYY-MM-DD ${timeFmt}`);
                            const end = r?.endAt
                                ? dayjs(r.endAt)
                                : dayjs(`${r?.reservationDate} ${r?.endTime}`, `YYYY-MM-DD ${timeFmt}`);

                            const dateText = start.isValid()
                                ? start.format("YYYY.MM.DD (ddd)")
                                : r?.reservationDate ?? "";

                            const timeText =
                                start.isValid() && end.isValid()
                                    ? `${start.format("A h:mm")} ~ ${end.format("A h:mm")}`
                                    : `${r?.startTime ?? ""} ~ ${r?.endTime ?? ""}`;

                            const isToday = (r?.reservationDate || "").startsWith(todayStr);

                            return (
                                <tr
                                    key={r.id ?? idx}
                                    style={{
                                        background: idx % 2 ? "#ffffff" : "#fcfcfd",
                                    }}
                                >
                                    <td
                                        style={{
                                            borderBottom: "1px solid #f3f4f6",
                                            padding: "10px 12px",
                                            textAlign: "center",
                                            maxWidth: 280,
                                        }}
                                        title={r?.purpose}
                                    >
                                        <span
                                            style={{
                                                display: "inline-block",
                                                maxWidth: 240,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            {r?.purpose}
                                        </span>
                                    </td>
                                    <td
                                        style={{
                                            borderBottom: "1px solid #f3f4f6",
                                            padding: "10px 12px",
                                            textAlign: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 12,
                                                background: "#eef2ff",
                                                border: "1px solid #e0e7ff",
                                                color: "#4338ca",
                                                borderRadius: 999,
                                                padding: "2px 8px",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {r?.meetingName}
                                        </span>
                                    </td>
                                    <td
                                        style={{
                                            borderBottom: "1px solid #f3f4f6",
                                            padding: "10px 12px",
                                            textAlign: "center",
                                            color: "#374151",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {dateText}
                                        {isToday && (
                                            <span
                                                style={{
                                                    marginLeft: 8,
                                                    fontSize: 11,
                                                    color: "#047857",
                                                    background: "#ecfdf5",
                                                    border: "1px solid #a7f3d0",
                                                    padding: "1px 6px",
                                                    borderRadius: 999,
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                오늘
                                            </span>
                                        )}
                                    </td>
                                    <td
                                        style={{
                                            borderBottom: "1px solid #f3f4f6",
                                            padding: "10px 12px",
                                            textAlign: "center",
                                            color: "#374151",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {timeText /* 예: 오전 9:00 ~ 오전 10:00 */}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
