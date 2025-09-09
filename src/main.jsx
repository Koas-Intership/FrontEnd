import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import koKR from 'antd/locale/ko_KR'
import AppLayout from './ui/AppLayout'
import DashboardPage from './pages/DashboardPage'
import RoomsPage from './pages/RoomsPage'
import BookingsPage from './pages/BookingsPage'
import AdminPage from './pages/AdminPage'
import UserPage from '/page/UserPage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={koKR}>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/user" element={<UserPage />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
)
