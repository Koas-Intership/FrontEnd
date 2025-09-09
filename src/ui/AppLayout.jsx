import { Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'

const { Header, Content } = Layout

export default function AppLayout({ children }) {
  const { pathname } = useLocation()
  const selectedKey = pathname === '/' ? '/' : '/' + pathname.split('/')[1]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: 'white', fontWeight: 700, marginRight: 24 }}> Kaos 회의실 예약</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={[
            { key: '/', label: <Link to="/">대시보드</Link> },
            { key: '/rooms', label: <Link to="/rooms">회의실</Link> },
            { key: '/bookings', label: <Link to="/bookings">예약</Link> },
            { key: '/admin', label: <Link to="/admin">관리</Link> },
          ]}
        />
        <div style={{ marginLeft: 'auto', color: 'white' }}>
          로그인
        </div>
      </Header>
      <Content style={{ padding: 24 }}>{children}</Content>
    </Layout>
  )
}
