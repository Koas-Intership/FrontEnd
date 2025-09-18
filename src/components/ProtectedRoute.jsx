// src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';

export default function ProtectedRoute() {
    const { token, me, booting } = useSelector(s => s.user);
    if (booting) {
        return (
            <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
                <Spin tip="세션 확인 중..." />
            </div>
        );
    }
    if (!token || !me) return <Navigate to="/" replace />;
    return <Outlet />;
}
