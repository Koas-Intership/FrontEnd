// src/pages/DashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Space } from "antd";
import DashboardReservations from "@/components/reservation/DashboardReservations";
import { fetchAllReservationsRequest } from "@/features/reservation/reservationsSlice";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { all, loadingAll, allError } = useSelector((s) => s.reservations);

  // 기본값: 오늘
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1~12
  const [day, setDay] = useState(now.getDate());

  // 연/월/일 옵션
  const years = useMemo(() => {
    const base = now.getFullYear();
    // 필요 범위로 조정 (예: 최근 3년)
    return Array.from({ length: 5 }, (_, i) => base - 2 + i);
  }, [now]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  // 월이 바뀌어 day가 범위 밖이면 보정
  useEffect(() => {
    if (day > daysInMonth) setDay(daysInMonth);
  }, [daysInMonth, day]);

  // 선택이 바뀔 때마다 불러오기
  useEffect(() => {
    dispatch(fetchAllReservationsRequest({ year, month, day }));
  }, [dispatch, year, month, day]);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', marginBottom: 16 }}>
        <h1>회의실 현황</h1>
        <Space wrap style={{ marginLeft: 'auto' }}>
          <Select
            value={year}
            onChange={setYear}
            options={years.map((y) => ({ label: `${y}년`, value: y }))}
            style={{ width: 120 }}
          />
          <Select
            value={month}
            onChange={setMonth}
            options={months.map((m) => ({ label: `${m}월`, value: m }))}
            style={{ width: 100 }}
          />
          <Select
            value={day}
            onChange={setDay}
            options={days.map((d) => ({ label: `${d}일`, value: d }))}
            style={{ width: 100 }}
          />
        </Space>
      </div>

      <DashboardReservations items={all} loading={loadingAll} error={allError} />
    </div>
  );
}
