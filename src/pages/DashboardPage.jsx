// src/pages/DashboardPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Space, Tag, Spin } from "antd";
import DashboardReservations from "@/components/reservation/DashboardReservations";
import { fetchAllReservationsRequest } from "@/features/reservation/reservationsSlice";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { all, loadingAll, allError } = useSelector((s) => s.reservations);

  // 오늘 기준을 렌더 간 고정
  const nowRef = useRef(new Date());
  const today = nowRef.current;

  // 기본: 월 전체보기 (day = null)
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1~12
  const [day, setDay] = useState(null); // null이면 월 전체

  // 연/월/일 옵션
  const years = useMemo(() => {
    const base = today.getFullYear();
    return Array.from({ length: 5 }, (_, i) => base - 2 + i); // base-2 ~ base+2
  }, [today]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  // 연/월 변경 시 일자 초기화(월 전체보기)
  useEffect(() => {
    setDay(null);
  }, [year, month]);

  // 서버 스펙: /reservation?year=YYYY&month=M&day=D
  // day가 null이면 day 파라미터 생략
  const params = useMemo(
    () => ({ year, month, ...(day != null ? { day } : {}) }),
    [year, month, day]
  );

  // 디바운스 조회
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(fetchAllReservationsRequest(params));
    }, 200);
    return () => clearTimeout(t);
  }, [dispatch, params]);

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
        {day == null ? (
          <Tag>월 전체</Tag>
        ) : (
          <Tag
            color="purple"
            closable
            onClose={(e) => {
              e.preventDefault(); // 태그 기본 제거 대신 상태로 제어
              setDay(null);
            }}
          >
            {day}일
          </Tag>
        )}
      </div>

      <Spin spinning={!!loadingAll}>
        <DashboardReservations items={all} loading={loadingAll} error={allError} />
      </Spin>
    </div>
  );
}
