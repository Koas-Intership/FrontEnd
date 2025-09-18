// components/MyInfo.jsx
import { Modal, Descriptions, Avatar, Button, Space, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { logout } from "../../features/user/userSlice";

const SubAction = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function MyInfo({ open, onClose, me, onResetPassword }) {
    const dispatch = useDispatch();
    const field = (v, f = "—") => (v === null || v === undefined || v === "" ? f : v);

    const handlePasswordReset = () => {
        if (typeof onResetPassword === "function") return onResetPassword();
    };

    return (
        <Modal title="내 정보" open={open} onCancel={onClose} footer={null} destroyOnClose centered>
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
                {/* 상단 프로필 */}
                <Space align="center" style={{ width: "100%", justifyContent: "center" }}>
                    <Avatar size={64} icon={<UserOutlined />} />
                    <div style={{ lineHeight: 1.3 }}>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>
                            {field(me?.name || me?.username, "Guest")}
                        </div>
                        <div style={{ color: "#888" }}>{me?.email}</div>
                    </div>
                </Space>

                <Divider style={{ margin: "8px 0" }} />

                {/* 상세 정보 */}
                <Descriptions column={1} size="small" labelStyle={{ width: 100, fontWeight: 600 }} contentStyle={{ wordBreak: "break-all" }}>
                    <Descriptions.Item label="직함">{me?.position || "—"}</Descriptions.Item>
                    {me?.department && <Descriptions.Item label="부서">{me.department}</Descriptions.Item>}
                    {me?.phone && <Descriptions.Item label="연락처">{me.phone}</Descriptions.Item>}
                    {me?.birthDate && <Descriptions.Item label="생년월일">{me.birthDate}</Descriptions.Item>}
                </Descriptions>

                <Divider style={{ margin: "8px 0" }} />

                <SubAction>
                    <Button type="link" size="small" style={{ padding: 0 }} onClick={handlePasswordReset}>
                        비밀번호 재설정
                    </Button>
                </SubAction>

                {/* 액션 버튼들 */}
                <Space style={{ width: "100%" }} direction="vertical" size={8}>
                    <Button block onClick={onClose}>닫기</Button>
                    <Button
                        block
                        type="primary"
                        onClick={() => {
                            dispatch(logout());
                            onClose?.();
                        }}
                    >
                        로그아웃
                    </Button>
                </Space>
            </Space>
        </Modal>
    );
}
