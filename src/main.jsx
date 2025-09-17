import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import koKR from 'antd/locale/ko_KR'
import AppLayout from '@/ui/AppLayout'
import DashboardPage from '@/pages/DashboardPage'
import RoomsPage from '@/pages/RoomsPage'
import ReservationsPage from '@/pages/ReservationsPage'
import AdminPage from '@/pages/AdminPage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={koKR}
        theme={{
          token: {
            colorPrimary: '#0b414bff',  //로고 색상
          },
        }}
      >
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
)
