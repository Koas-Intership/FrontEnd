// src/components/user/SignUpModal.jsx
import { useRef, useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, DatePicker } from 'antd';                  // ← DatePicker 추가
import dayjs from 'dayjs';                                 // ← dayjs 추가
import { signUpRequest } from '@/features/user/userSlice';
import { CloseOutlined, UserAddOutlined } from '@ant-design/icons'; // ← 버튼 아이콘

export default function SignUpModal({ open, onClose }) {
    const dispatch = useDispatch();
    const { signingUp, signUpError } = useSelector((s) => s.user);

    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        position: '',
        department: '',
        phoneNumber: '',
        birthDate: '',
    });

    const formRef = useRef(null);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!form.email || !form.password || !form.name) {
            alert('필수 항목을 입력해 주시오.');
            return;
        }
        dispatch(signUpRequest(form));
    };

    const handleOk = () => formRef.current?.requestSubmit();
    const handleCancel = () => onClose?.();

    const resetForm = () => {
        setForm({
            email: '',
            password: '',
            name: '',
            position: '',
            department: '',
            phoneNumber: '',
            birthDate: '',
        });
    };

    const formBoxStyle = useMemo(() => ({
        maxWidth: 560,
        margin: '0 auto',
        padding: 16,
        background: '#fff',
    }), []);

    const inputStyle = useMemo(() => ({
        padding: 10,
        outline: 'none',
        border: 'none',
        borderBottom: '1px solid #d1d5db',
        borderRadius: 5,
        background: 'transparent',
        transition: 'border-color .2s ease',
        marginBottom: '10px'
    }), []);

    const groupStyle = useMemo(() => ({ display: 'grid', gap: 6 }), []);
    const gridStyle = useMemo(() => ({
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 12,
    }), []);

    const okBtnProps = useMemo(() => ({
        type: 'primary',
        size: 'large',
        icon: <UserAddOutlined />,
        style: {
            borderRadius: 12,
            paddingInline: 20,
            fontWeight: 700,
            boxShadow: signingUp ? 'none' : '0 6px 16px rgba(18, 105, 99, 0.25)',
            opacity: signingUp ? 0.85 : 1,
            transition: 'all .2s ease',
        },
    }), [signingUp]);

    const cancelBtnProps = useMemo(() => ({
        size: 'large',
        icon: <CloseOutlined />,
        ghost: true,
        style: {
            borderRadius: 12,
            paddingInline: 18,
            fontWeight: 600,
        },
    }), []);

    // ↓↓↓ DatePicker 세팅
    const dateFormat = 'YYYY-MM-DD';
    const disabledFuture = (current) => current && current > dayjs().endOf('day');

    // 회원가입 성공 후 모달닫기
    const wasSigningUp = useRef(false);
    useEffect(() => {
        if (wasSigningUp.current && !signingUp && !signUpError) {
            onClose?.();
            resetForm(); //닫으면서 폼 초기화
        }
        wasSigningUp.current = signingUp;
    }, [signingUp, signUpError, onClose]);

    return (
        <Modal
            title="회원가입"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={signingUp ? '가입 중...' : '가입하기'}
            cancelText="닫기"
            confirmLoading={!!signingUp}
            maskClosable={false}
            destroyOnClose
            okButtonProps={okBtnProps}             // ← 꾸민 OK 버튼
            cancelButtonProps={cancelBtnProps}     // ← 꾸민 취소 버튼
        >
            <form ref={formRef} onSubmit={onSubmit} style={formBoxStyle}>
                {/* 그리드: 모바일 1열, md 이상 2열 */}
                <div style={gridStyle}>
                    <div style={groupStyle}>
                        <label htmlFor="email">이메일</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            autoComplete="email"
                            style={inputStyle}
                        />
                    </div>

                    <div style={groupStyle}>
                        <label htmlFor="password">비밀번호</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={onChange}
                            autoComplete="new-password"
                            style={inputStyle}
                        />
                    </div>

                    <div style={groupStyle}>
                        <label htmlFor="name">이름</label>
                        <input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            autoComplete="name"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={groupStyle}>
                            <label htmlFor="position">직책</label>
                            <input
                                id="position"
                                name="position"
                                value={form.position}
                                onChange={onChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={groupStyle}>
                            <label htmlFor="department">부서</label>
                            <input
                                id="department"
                                name="department"
                                value={form.department}
                                onChange={onChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={groupStyle}>
                            <label htmlFor="phoneNumber">번호</label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                inputMode="tel"
                                value={form.phoneNumber}
                                onChange={onChange}
                                style={inputStyle}
                            />
                        </div>

                        <div style={groupStyle}>
                            <label htmlFor="birthDate">생년월일</label>
                            <DatePicker
                                id="birthDate"
                                value={form.birthDate ? dayjs(form.birthDate, dateFormat) : null}
                                onChange={(d, ds) => setForm(f => ({ ...f, birthDate: ds || '' }))}
                                format={dateFormat}
                                placeholder="YYYY-MM-DD"
                                disabledDate={disabledFuture}
                                bordered={false}                  // 인풋 스타일과 톤 맞추기
                                style={inputStyle}                // 아래쪽 보더 스타일 유지
                                allowClear
                            />
                        </div>
                    </div>
                </div>

                {/* md 이상 2열 */}
                <style>{`
          @media (min-width: 768px) {
            form > div { grid-template-columns: 1fr 1fr; }
          }
          input:focus {
            border-bottom-color: #053b1cff !important;
          }
        `}</style>

                {signUpError && (
                    <div style={{ color: '#ef4444', marginTop: 8 }}>{String(signUpError)}</div>
                )}

                {/* Enter 제출용 숨김 버튼 */}
                <button type="submit" style={{ display: 'none' }} />
            </form>
        </Modal>
    );
}
