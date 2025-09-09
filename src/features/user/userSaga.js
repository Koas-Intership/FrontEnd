import { call, put, takeLatest, delay } from "redux-saga/effects";
import axios from "axios";
import { message } from "antd";
import { loginRequest, loginSuccess, loginFailure, logout } from "./userSlice";

// axios 기본 설정 (쿠키 세션 쓰면 withCredentials true)
axios.defaults.withCredentials = true;
// 서버 주소 사용 시:
// axios.defaults.baseURL = "http://<YOUR_BACKEND_HOST>";

const USE_MOCK_AUTH = true; // ✅ 개발 중 임시

function apiLogin({ username, password }) {
    return axios.post("/api/user/login", { username, password });
}

function* handleLogin(action) {
    const { username, password } = action.payload;
    try {
        if (USE_MOCK_AUTH === true) {
            yield delay(300);
            const user = { username, name: username, email: `${username}@example.com`, role: "사원" };
            const token = "dev-mock-token";

            yield put(loginSuccess({ user, token }));

            try {
                message.success(`${user.name}님, 환영합니다!`);
            } catch (mErr) {
                message.error("관리자에게 문의주세요.");
            }
            return;
        }

        //백엔드 연결 후
        const res = yield call(apiLogin, { username, password });
        // 서버 응답 형태에 맞춰 파싱
        // 예시1) { user, token }
        const { user, token } = res.data;

        // (JWT 쓸 때) axios 헤더에 토큰 심기
        if (token) {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            // 필요하면 localStorage 저장
            localStorage.setItem("auth_token", token);
        }

        yield put(loginSuccess({ user, token }));
        message.success(`${user?.name || "사용자"}님, 환영합니다!`);
    } catch (err) {
        const msg =
            err?.response?.data?.message ||
            err?.message ||
            "아이디 또는 비밀번호를 확인해 주세요.";
        yield put(loginFailure(msg));
        message.error(msg);
    }
}

function* handleLogout() {
    try {
        // 세션 기반이면 서버에 로그아웃 요청 필요할 수 있음:
        // yield call(() => axios.post("/api/auth/logout"));
    } finally {
        // JWT일 때 토큰 제거
        delete axios.defaults.headers.common.Authorization;
        localStorage.removeItem("auth_token");
    }
}

export default function* userSaga() {
    yield takeLatest(loginRequest.type, handleLogin);
    yield takeLatest(logout.type, handleLogout);
}
