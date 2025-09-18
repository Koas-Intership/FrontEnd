// src/main.jsx (혹은 index.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { store } from './store';
import { bootstrapRequest } from '@/features/user/userSlice';

store.dispatch(bootstrapRequest());

import AppLayout from '@/ui/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import RoomsPage from '@/pages/RoomsPage';
import ReservationsPage from '@/pages/ReservationsPage';
import AdminPage from '@/pages/AdminPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={koKR} theme={{ token: { colorPrimary: '#0b414bff' } }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/main" element={<DashboardPage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
