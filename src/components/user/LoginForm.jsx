import { Modal, Button, Input, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "@/features/user/userSlice";

export default function LoginForm({ open, onClose }) {
    const dispatch = useDispatch();
    const loading = useSelector((s) => s.user.loading);

    const onFinish = (values) => {
        const { email, password } = values;
        dispatch(loginRequest(values));
        onClose?.();
    };

    return (
        <Modal
            title="로그인"
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form layout="vertical" onFinish={onFinish} autoComplete="off">
                <Form.Item
                    label="이메일"
                    name="email"
                    rules={[{ required: true, message: "이메일을 입력하세요." }]}
                >
                    <Input placeholder="이메일" />
                </Form.Item>

                <Form.Item
                    label="비밀번호"
                    name="password"
                    rules={[{ required: true, message: "비밀번호를 입력하세요." }]}
                >
                    <Input.Password placeholder="비밀번호" />
                </Form.Item>

                <Button
                    htmlType="submit"
                    type="primary"
                    block
                    loading={loading}
                >
                    로그인
                </Button>
            </Form>
        </Modal>
    );
}
