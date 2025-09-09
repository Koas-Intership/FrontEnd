import { Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LoginForm from '../components/LoginForm'
import MyInfo from '../components/MyInfo'
import { Button } from 'antd'
import { useSelector } from 'react-redux'
const { Header, Content } = Layout

export default function AppLayout({ children }) {
  const { pathname } = useLocation()
  const selectedKey = pathname === '/' ? '/' : '/' + pathname.split('/')[1]
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const me = useSelector((s) => s.user.me);

  // 로그인 성공하면 모달 닫기
  useEffect(() => {
    if (me && isLoginOpen) setIsLoginOpen(false);
  }, [me, isLoginOpen]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: 'white', fontWeight: 700, marginRight: 24 }}> Kaos 회의실 예약</div>
        {/* 메뉴 */}
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
          style={{ flex: 1 }}
        />

        {/* 로그인 버튼 (오른쪽 끝으로) */}
        {me ?
          <Button
            type='primary'
            onClick={() => setIsInfoOpen(true)}
            style={{ marginLeft: 'auto' }}>
            내 정보
          </Button>
          :
          <Button
            type="primary"
            onClick={() => setIsLoginOpen(true)}
            style={{ marginLeft: 'auto' }}
          >
            로그인
          </Button>
        }

      </Header>
      <Content style={{ padding: 24 }}>{children}</Content>
      {/* 모달 */}
      <LoginForm open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <MyInfo open={isInfoOpen} me={me} onClose={() => setIsInfoOpen(false)} />
    </Layout>
  )
}
