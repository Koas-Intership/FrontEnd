// src/components/reservation/DashboardReservations.jsx
import React, { useMemo } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
dayjs.locale("ko");

/* =========================
   styled-components
   ========================= */
const Container = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  background: #fff;
`;

const Header = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #eef2f7;
  background: linear-gradient(180deg, rgba(248,250,252,1) 0%, #fff 100%);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #ecfeff;
  color: #0891b2;
  display: grid;
  place-items: center;
  font-size: 16px;
  border: 1px solid #cffafe;
`;

const HeaderTitle = styled.div`
  font-weight: 700;
`;

const HeaderMeta = styled.div`
  margin-left: auto;
  font-size: 12px;
  color: #6b7280;
`;

const TableWrap = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  thead tr { background: #f8fafc; }
  tbody tr:nth-child(even) { background: #fcfcfd; }
`;

const Th = styled.th`
  border-bottom: 1px solid #e5e7eb;
  padding: 10px 12px;
  text-align: center;
  color: #374151;
  font-weight: 600;
  white-space: nowrap;
`;

const Td = styled.td`
  border-bottom: 1px solid #f3f4f6;
  padding: 10px 12px;
  text-align: center;
  color: #374151;
  white-space: ${(p) => (p.$nowrap ? "nowrap" : "normal")};
  max-width: ${(p) => p.$maxWidth || "auto"};
`;

const PurposeText = styled.span`
  display: inline-block;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
`;

const RoomChip = styled.span`
  font-size: 12px;
  background: #eef2ff;
  border: 1px solid #e0e7ff;
  color: #4338ca;
  border-radius: 999px;
  padding: 2px 8px;
  white-space: nowrap;
`;

const ReserverCell = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

const ReserverName = styled.span`
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
`;

const TodayBadge = styled.span`
  margin-left: 8px;
  font-size: 11px;
  color: #047857;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 1px 6px;
  border-radius: 999px;
  vertical-align: middle;
`;

const StateBox = styled.div`
  padding: 20px;
  text-align: center;
  font-size: 16px;
  color: ${(p) => (p.$error ? "red" : p.$muted ? "#666" : "inherit")};
  font-weight: ${(p) => (p.$error ? "bold" : "normal")};
`;

/* =========================
   component
   ========================= */
export default function DashboardReservations({
    items = [],
    loading = false,
    error = null,
}) {
    if (loading) return <StateBox>⏳ 불러오는 중...</StateBox>;
    if (error) return <StateBox $error>⚠️ 오류 발생: {error}</StateBox>;
    if (!items.length) return <StateBox $muted>📭 예약이 없습니다.</StateBox>;

    // 헤더/오늘 문자열 메모
    const headers = useMemo(
        () => ["회의 주제", "회의실", "예약자", "날짜", "시간"],
        []
    );
    const todayStr = useMemo(() => dayjs().format("YYYY-MM-DD"), []);

    // DTO 기준(useMemo): id, meetingName, purpose, reservationDate, startTime, endTime, userName
    const rows = useMemo(() => {
        return items.map((r, idx) => {
            // HH:mm:ss 혹은 HH:mm 대응
            const sfmt = (r?.startTime || "").length === 8 ? "HH:mm:ss" : "HH:mm";
            const efmt = (r?.endTime || "").length === 8 ? "HH:mm:ss" : "HH:mm";

            const start = dayjs(`${r?.reservationDate} ${r?.startTime}`, `YYYY-MM-DD ${sfmt}`);
            const end = dayjs(`${r?.reservationDate} ${r?.endTime}`, `YYYY-MM-DD ${efmt}`);

            const dateText = start.isValid()
                ? start.format("YYYY.MM.DD (ddd)")
                : (r?.reservationDate ?? "");

            const timeText =
                start.isValid() && end.isValid()
                    ? `${start.format("A h:mm")} ~ ${end.format("A h:mm")}`
                    : `${r?.startTime ?? ""} ~ ${r?.endTime ?? ""}`;

            const isToday = (r?.reservationDate || "").startsWith(todayStr);

            return {
                key: r.id ?? idx,
                purpose: r?.purpose ?? "",
                meetingName: r?.meetingName ?? "",
                reserverName: r?.userName ?? "—",
                dateText,
                timeText,
                isToday,
            };
        });
    }, [items, todayStr]);

    return (
        <Container>
            <Header>
                <HeaderIcon>📅</HeaderIcon>
                <HeaderTitle>전체 예약</HeaderTitle>
                <HeaderMeta>총 {rows.length}건</HeaderMeta>
            </Header>

            <TableWrap>
                <Table>
                    <thead>
                        <tr>
                            {headers.map((h) => (
                                <Th key={h}>{h}</Th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.key}>
                                {/* 회의 주제 */}
                                <Td $maxWidth="280px">
                                    <PurposeText title={row.purpose}>{row.purpose}</PurposeText>
                                </Td>

                                {/* 회의실 */}
                                <Td>
                                    <RoomChip>{row.meetingName}</RoomChip>
                                </Td>

                                {/* 예약자 */}
                                <Td title={row.reserverName} $nowrap>
                                    <ReserverCell>
                                        <ReserverName>{row.reserverName}</ReserverName>
                                    </ReserverCell>
                                </Td>

                                {/* 날짜 */}
                                <Td $nowrap>
                                    {row.dateText}
                                    {row.isToday && <TodayBadge>오늘</TodayBadge>}
                                </Td>

                                {/* 시간 */}
                                <Td $nowrap>{row.timeText}</Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </TableWrap>
        </Container>
    );
}
