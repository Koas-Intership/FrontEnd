import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUpRequest } from '@/features/user/userSlice';

export default function SignUpForm() {
    const dispatch = useDispatch();
    const { signingUp, signUpError } = useSelector((s) => s.user);

    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        position: '',
        dept: '',
        phoneNumber: '',
        birthDate: '',
    });

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    // --- 제출 ---
    const onSubmit = (e) => {
        e.preventDefault();
        if (!form.email || !form.password || !form.name) {
            alert('필수 항목을 입력해 주시오.');
            return;
        }
        dispatch(signUpRequest(form));
    };

    return (
        <form onSubmit={onSubmit}
            style={{
                maxWidth: 560, margin: '0 auto',
                border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff'
            }}
        >
            <h2 style={{ marginTop: 0, marginBottom: 12 }}>회원가입</h2>

            {/* 그리드: 모바일 1열, md 이상 2열 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 12,
            }}>
                <div style={{ display: 'grid', gap: 6 }}>
                    <label htmlFor="email">이메일*</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={onChange}
                        style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
                </div>

                <div style={{ display: 'grid', gap: 6 }}>
                    <label htmlFor="password">비밀번호*</label>
                    <input id="password" name="password" type="password" value={form.password} onChange={onChange}
                        style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
                </div>

                <div style={{ display: 'grid', gap: 6 }}>
                    <label htmlFor="name">이름*</label>
                    <input id="name" name="name" value={form.name} onChange={onChange}
                        style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                    <label htmlFor="dept">직책</label>
                    <input id="position" name="position" value={form.position} onChange={onChange}
                        style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                    <label htmlFor="dept">부서</label>
                    <input id="department" name="department" value={form.department} onChange={onChange}
                        style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                    <label htmlFor="dept">번호</label>
                    <input id="phoneNumber" name="phoneNumber" value={form.department} onChange={onChange}
                        style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                    <label htmlFor="dept">생년월일(yyyymmdd)</label>
                    <input id="birthDate" name="birthDate" value={form.department} onChange={onChange}
                        style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
                </div>
            </div>

            {/* md 이상 2열로 바꾸기: 간단 반응형 미디어쿼리 */}
            <style>{`
        @media (min-width: 768px) {
          form > div { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

            {signUpError && (
                <div style={{ color: '#ef4444', marginTop: 8 }}>{signUpError}</div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 8 }}>
                <button type="button"
                    onClick={() => setForm({ email: '', password: '', name: '', dept: '' })}
                    style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff' }}>
                    초기화
                </button>
                <button type="submit" disabled={signingUp}
                    style={{
                        padding: '10px 14px', border: '1px solid #2563eb', borderRadius: 8,
                        background: signingUp ? '#93c5fd' : '#2563eb', color: '#fff', cursor: 'pointer'
                    }}>
                    {signingUp ? '가입 중...' : '가입하기'}
                </button>
            </div>
        </form>
    );
}
