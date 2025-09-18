// AppLayout.jsx
import { Layout, Menu, Image } from 'antd'
import { Link, Router, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LoginForm from '@/components/user/LoginForm'
import MyInfo from '@/components/user/MyInfo'
import { useSelector } from 'react-redux'
import SignUpModal from '@/components/user/SignUpModal'
import { Outlet } from 'react-router-dom'
import PasswordChangeModal from '@/components/user/PasswordChangeModal'

const { Header, Content } = Layout

export default function AppLayout({ children }) {
  const { pathname } = useLocation()
  const selectedKey = pathname === '/' ? '/' : '/' + pathname.split('/')[1]
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const me = useSelector((s) => s.user.me)

  useEffect(() => {
    if (me && isLoginOpen) setIsLoginOpen(false)
  }, [me, isLoginOpen])

  return (
    <Layout style={{ minHeight: '100vh', minWidth: 800 }}>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white' }}>
        <Link to="/">
          <img
            src="/img/logo.svg"
            alt="Koas"
            style={{ width: "100px", cursor: "pointer", display: "block" }}
          />
        </Link>

        <Menu
          theme='light'
          mode="horizontal"
          selectedKeys={[selectedKey]}
          style={{ flex: 1, borderBottom: 'none', marginLeft: '1%' }}
        >
          <Menu.Item key="/main"><Link to="/main">대시보드</Link></Menu.Item>
          <Menu.Item key="/rooms"><Link to="/rooms">회의실</Link></Menu.Item>
          <Menu.Item key="/reservations"><Link to="/reservations">예약</Link></Menu.Item>

          {!me ? (
            <Menu.Item key="login" onClick={() => setIsLoginOpen(true)} style={{ marginLeft: 'auto' }}>
              로그인
            </Menu.Item>
          ) : (
            <>
              <Menu.Item
                key="myinfo"
                onClick={() => setIsInfoOpen(true)}
                style={{ marginLeft: 'auto' }}   // ← 여기서 오른쪽 밀기
              >
                내 정보
              </Menu.Item>
            </>
          )}
        </Menu>
      </Header>
      <div style={{ padding: 24 }} >
        <Outlet />
      </div>

      {/* 모달 */}
      <LoginForm open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <MyInfo
        open={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        me={me}
        onResetPassword={() => {
          setIsInfoOpen(false);
          setTimeout(() => setPwOpen(true), 0); // 자연스러운 전환
        }}
      />
      <PasswordChangeModal
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        onSuccess={() => setPwOpen(false)}
      />
    </Layout>
  )
}
