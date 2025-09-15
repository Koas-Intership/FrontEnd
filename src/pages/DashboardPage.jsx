// src/pages/DashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Space, Tag } from "antd";
import DashboardReservations from "@/components/reservation/DashboardReservations";
import { fetchAllReservationsRequest } from "@/features/reservation/reservationsSlice";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { all, loadingAll, allError } = useSelector((s) => s.reservations);

  // 오늘 기준
  const now = new Date();

  // ✅ 기본: 월 전체보기 (day를 null로)
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1~12
  const [day, setDay] = useState(null);                   // ← null = 전체보기

  // 연/월/일 옵션
  const years = useMemo(() => {
    const base = now.getFullYear();
    return Array.from({ length: 5 }, (_, i) => base - 2 + i);
  }, [now]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  // ✅ 연/월이 바뀌면 "일자 선택 해제"해서 계속 월 전체보기 유지
  useEffect(() => {
    setDay(null);
  }, [year, month]);

  // ✅ 선택이 바뀔 때마다 불러오기 (day가 있을 때만 포함)
  useEffect(() => {
    const payload = { year, month, ...(day != null ? { day } : {}) };
    dispatch(fetchAllReservationsRequest(payload));
  }, [dispatch, year, month, day]);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>회의실 현황</h1>

        <Space wrap style={{ marginLeft: "auto" }}>
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

          {/* ✅ 일자: 기본은 미선택(전체). allowClear로 '전체' 상태 전환 가능 */}
          <Select
            allowClear
            placeholder="전체"
            value={day ?? undefined}                 // undefined면 placeholder 노출
            onChange={(v) => setDay(v ?? null)}      // clear 시 null로
            options={days.map((d) => ({ label: `${d}일`, value: d }))}
            style={{ width: 100 }}
          />
        </Space>
      </div>

      {/* 현재 필터 표시 (뷰 힌트) */}
      <div style={{ marginBottom: 10 }}>
        <Tag color="blue">{year}년</Tag>
        <Tag color="geekblue">{month}월</Tag>
        {day == null ? <Tag>월 전체</Tag> : <Tag color="purple">{day}일</Tag>}
      </div>

      <DashboardReservations items={all} loading={loadingAll} error={allError} />
    </div>
  );
}
