// ReservationCancelModal.jsx
import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
dayjs.locale("ko");

export default function ReservationCancelModal({
    open,
    reservation,
    onClose,
    onConfirm,
    confirmLoading,
}) {
    if (!open) return null;

    // ESC로 닫기
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    // 날짜/시간 포맷 계산 (startAt/endAt 우선, 없으면 date+time 조합)
    const { dateText, timeText } = useMemo(() => {
        const dateFmt = "YYYY-MM-DD";
        const timeFmt = (reservation?.startTime || "").length === 8 ? "HH:mm:ss" : "HH:mm";

        const start = reservation?.startAt
            ? dayjs(reservation.startAt)
            : dayjs(`${reservation?.reservationDate} ${reservation?.startTime}`, `${dateFmt} ${timeFmt}`);

        const end = reservation?.endAt
            ? dayjs(reservation.endAt)
            : dayjs(`${reservation?.reservationDate} ${reservation?.endTime}`, `${dateFmt} ${timeFmt}`);

        return {
            dateText: start.isValid()
                ? start.format("YYYY.MM.DD (ddd)")
                : reservation?.reservationDate || "",
            timeText: start.isValid() && end.isValid()
                ? `${start.format("A h:mm")} ~ ${end.format("A h:mm")}`
                : `${reservation?.startTime ?? ""} ~ ${reservation?.endTime ?? ""}`,
        };
    }, [reservation]);

    const handleConfirm = () => {
        onConfirm?.();
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.40)",
                backdropFilter: "blur(2px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: 16,
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="cancel-title"
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "min(520px, 92vw)",
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 16px 40px rgba(0,0,0,0.20)",
                    overflow: "hidden",
                    border: "1px solid #eef0f3",
                }}
            >
                {/* 헤더 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        background:
                            "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 100%)",
                    }}
                >
                    <div
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            background: "#fee2e2",
                            color: "#ef4444",
                            display: "grid",
                            placeItems: "center",
                            marginRight: 12,
                            fontSize: 18,
                        }}
                    >
                        ⚠️
                    </div>
                    <h4 id="cancel-title" style={{ margin: 0, fontSize: 16 }}>예약 취소</h4>
                    <button
                        onClick={onClose}
                        aria-label="닫기"
                        style={{
                            marginLeft: "auto",
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            background: "#fff",
                            color: "#6b7280",
                            cursor: "pointer",
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* 본문 */}
                <div style={{ padding: 18 }}>
                    <div
                        style={{
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            color: "#991b1b",
                            borderRadius: 10,
                            padding: "10px 12px",
                            fontSize: 13.5,
                            marginBottom: 12,
                        }}
                    >
                        이 작업은 되돌릴 수 없습니다. 아래 예약을 정말로 취소하시겠습니까?
                    </div>

                    <div
                        style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: 12,
                            padding: 14,
                            background: "#fafafa",
                            marginBottom: 6,
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <div style={{ fontWeight: 700 }}>{reservation?.purpose ?? "제목 없음"}</div>
                            {reservation?.meetingName && (
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
                                    {reservation.meetingName}
                                </span>
                            )}
                        </div>
                        <div style={{ display: "grid", gap: 6, fontSize: 14, color: "#374151" }}>
                            <div>📅 {dateText}</div>
                            <div>⏰ {timeText}</div>
                        </div>
                    </div>
                </div>

                {/* 푸터 */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                        padding: "12px 16px 16px",
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            border: "1px solid #d1d5db",
                            background: "#fff",
                            color: "#374151",
                            padding: "8px 14px",
                            borderRadius: 10,
                            cursor: "pointer",
                            fontSize: 14,
                        }}
                        autoFocus
                    >
                        닫기
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!!confirmLoading}
                        style={{
                            border: "1px solid #ef4444",
                            background: "#ef4444",
                            color: "#fff",
                            padding: "8px 14px",
                            borderRadius: 10,
                            cursor: "pointer",
                            fontSize: 14,
                            opacity: confirmLoading ? 0.7 : 1,
                        }}
                    >
                        {confirmLoading ? "취소 중..." : "취소하기"}
                    </button>
                </div>
            </div>
        </div>
    );
}
