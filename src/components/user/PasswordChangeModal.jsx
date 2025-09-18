// src/components/auth/PasswordChangeModal.jsx
import { useEffect, useMemo } from "react";
import { Modal, Form, Input, Button, Alert, Space, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { changingPasswordRequest, clearChangingPasswordState } from "@/features/user/userSlice";

export default function PasswordChangeModal({ open, onClose, onSuccess }) {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { changingPassword, changingPasswordError, changingPasswordDone } = useSelector((s) => s.user);

    const newPw = Form.useWatch("newPassword", form) || "";
    const strength = useMemo(() => {
        let score = 0;
        if (newPw.length >= 8) score++;
        if (/[A-Z]/.test(newPw)) score++;
        if (/[a-z]/.test(newPw)) score++;
        if (/[0-9]/.test(newPw)) score++;
        if (/[^A-Za-z0-9]/.test(newPw)) score++;
        const levels = ["아주 약함", "약함", "보통", "강함", "아주 강함"];
        return { score, label: levels[Math.max(0, score - 1)] || "아주 약함" };
    }, [newPw]);

    useEffect(() => {
        if (!open) {
            form.resetFields();
            dispatch(clearChangingPasswordState?.());
        }
    }, [open, form, dispatch]);

    //성공 후 자동 닫기
    useEffect(() => {
        if (open && changingPasswordDone) {
            message.success("비밀번호가 변경되었습니다.");
            onSuccess?.();
            onClose?.();
        }
    }, [open, changingPasswordDone, onClose, onSuccess]);

    const onFinish = (values) => {
        // values: { currentPassword?, newPassword, confirmPassword }
        dispatch(changingPasswordRequest({
            currentPassword: values.currentPassword, // 백엔드가 필요 없으면 제거
            newPassword: values.newPassword,
        }));
    };

    return (
        <Modal
            title="비밀번호 변경"
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            centered
        >
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
                {changingPasswordError && (
                    <Alert type="error" showIcon message={String(changingPasswordError)} />
                )}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    disabled={changingPassword}
                    initialValues={{}}
                >
                    <Form.Item
                        label={
                            <span>
                                새 비밀번호{" "}
                                <span style={{ color: "#64748b", fontWeight: 400 }}>
                                    (8자 이상, 영문 대/소문자, 숫자, 특수문자 권장)
                                </span>
                            </span>
                        }
                        name="newPassword"
                        rules={[
                            { required: true, message: "새 비밀번호를 입력하시오." },
                            { min: 8, message: "8자 이상이어야 합니다." },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value) return Promise.resolve();
                                    if (value === getFieldValue("currentPassword")) {
                                        return Promise.reject(new Error("현재 비밀번호와 달라야 합니다."));
                                    }
                                    // 강도는 권고만: 막으려면 여기서 조건 강화
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            size="large"
                            placeholder="새 비밀번호"
                            iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <div style={{ fontSize: 12, color: "#64748b", marginTop: -8, marginBottom: 8 }}>
                        비밀번호 강도: <b>{strength.label}</b>
                    </div>

                    <Form.Item
                        label="새 비밀번호 확인"
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "새 비밀번호를 다시 입력하시오." },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
                                    return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
                                },
                            }),
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            size="large"
                            placeholder="새 비밀번호 확인"
                            iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            block
                            size="large"
                            type="primary"
                            htmlType="submit"
                            loading={changingPassword}
                        >
                            변경하기
                        </Button>
                    </Form.Item>
                    <Button block onClick={onClose}>취소</Button>
                </Form>
            </Space>
        </Modal>
    );
}
