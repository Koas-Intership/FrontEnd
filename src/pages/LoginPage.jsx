// src/pages/LoginPage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Form, Input, Button, Typography, Alert } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { loginRequest } from "@/features/user/userSlice";

const { Title, Text } = Typography;

const Page = styled.div`
  min-height: 100vh;
  max-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  background: linear-gradient(135deg, #0b414b 0%, #0b414b 35%, #0e6c7a 100%);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Brand = styled.section`
  color: #e8f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;

  > div {
    max-width: 300px;
  }

  h1 {
    margin-bottom: 12px;
    letter-spacing: 0.2px;
  }
  p {
    opacity: 0.9;
    line-height: 1.6;
  }
`;

const FormSide = styled.section`
  display: grid;
  place-items: center;
  padding: 48px 24px;
  background: #fff;
`;

const FormWrap = styled.div`
  width: 100%;
  max-width: 420px;
`;

const Subtle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlainBox = styled.div`
  background: #fff;
  border-radius: 16px;
  //box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 32px 28px; 
`;


export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token, loading, error, booting, me } = useSelector((s) => s.user || {});

    const onFinish = (values) => {
        dispatch(loginRequest(values));
    };

    useEffect(() => {
        if (!booting && me && token) {
            navigate('/main', { replace: true });
        }
    }, [booting, me, token, navigate]);

    return (
        <Page>
            <Brand>
                <div>
                    <Title level={1} style={{ color: "#e8f3f5", marginBottom: 0 }}>
                        KOAS
                    </Title>
                </div>
            </Brand>

            <FormSide>
                <FormWrap>
                    <PlainBox>
                        <Title level={3} style={{ marginBottom: 4 }}>
                            로그인
                        </Title>

                        {error && (
                            <Alert
                                style={{ marginTop: 16 }}
                                type="error"
                                showIcon
                                message="로그인 실패"
                                description={String(error)}
                            />
                        )}

                        <Form
                            layout="vertical"
                            style={{ marginTop: 16 }}
                            onFinish={onFinish}
                            disabled={loading}
                            initialValues={{ remember: true }}
                        >
                            <Form.Item
                                label="아이디"
                                name="email"
                                rules={[{ required: true, message: "사내 이메일을 사용해주세요." }]}
                            >
                                <Input size="large" placeholder="사내 이메일을 사용해주세요." autoFocus />
                            </Form.Item>

                            <Form.Item
                                label="비밀번호"
                                name="password"
                                rules={[{ required: true, message: "비밀번호를 입력하시오." }]}
                            >
                                <Input.Password
                                    size="large"
                                    placeholder="••••••••"
                                    iconRender={(visible) =>
                                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                    }
                                />
                            </Form.Item>
                            <Form.Item style={{ marginTop: 8 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block
                                    loading={loading}
                                >
                                    로그인
                                </Button>
                            </Form.Item>
                        </Form>
                    </PlainBox>

                    <div style={{ textAlign: "center", marginTop: 16, color: "#64748b" }}>
                        계정이 없으신가요? <a href="#">관리자에게 요청해주세요.</a>
                    </div>
                </FormWrap>
            </FormSide>

        </Page>
    );
}
