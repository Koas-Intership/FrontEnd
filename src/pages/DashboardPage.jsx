import DashboardReservations from "@/components/reservation/DashboardReservations";

export default function DashboardPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 16 }}>회의실 현황</h1>
      <DashboardReservations />
    </div>
  );
}
