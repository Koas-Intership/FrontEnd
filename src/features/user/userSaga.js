import { call, put, takeLatest, delay } from "redux-saga/effects";
import axios from "axios";
import { message } from "antd";
import { loginRequest, loginSuccess, loginFailure, logout, signUpRequest, signUpSuccess, signUpFailure, } from "./userSlice";
import { api } from "../../lib/api";

// axios 기본 설정 (쿠키 세션 쓰면 withCredentials true)
axios.defaults.withCredentials = false;

const USE_MOCK = false;

/// --- 로그인 ---
function apiLogin({ email, password }) {
    console.log("[userSaga] apiLogin : ", email, password);
    return api.post(
        "/api/user/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
    );
}

function* handleLogin(action) {
    try {
        const { email, password } = action.payload;
        console.log("[userSaga] action.payload : ", action.payload);
        if (USE_MOCK) {
            yield delay(300);
            const user = { name: email.split('@')[0], email, role: "사원" };
            const token = "dev-mock-token";
            yield put(loginSuccess({ user, token }));
            message.success(`${user.name}님, 환영합니다!`);
            return;
        }

        const res = yield call(apiLogin, { email, password });
        const { accessToken, refreshToken } = res.data;
        console.log("[userSaga] login - res.data : ", res.data);

        if (accessToken) localStorage.setItem("access_token", accessToken);
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);

        //내 정보 가져오기
        const meRes = yield call([api, api.get], "/api/user/me");
        const user = meRes.data; // {id, email, name, role...}
        console.log("[userSaga] login - meRes.data : ", meRes.data);

        yield put(loginSuccess({ user: user || null, token: accessToken }));
        message.success(`${user?.name || "사용자"}님, 환영합니다!`);

    } catch (err) {
        console.log("[login error]", {
            status: err?.response?.status,
            headers: err?.response?.headers,
            data: err?.response?.data,
        });
        const msg = err?.response?.data?.message || err?.message || "아이디 또는 비밀번호를 확인해 주세요.";
        yield put(loginFailure(msg));
        yield put(loginFailure(msg));
        message.error(msg);
    }
}

// --- 회원가입 ---
function apiSignUp(form) {
    console.log('[userSaga] form', form);
    return api.post("/api/user/register", form);
}

function* handleSignUp(action) {
    try {
        if (USE_MOCK) {
            yield delay(300);
            const user = { name: action.payload.name || "신규 사용자", email: action.payload.email, role: "사원" };
            const token = "dev-mock-token-signup";
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
            localStorage.setItem("auth_token", token);

            yield put(signUpSuccess({ user, token }));
            message.success("회원가입이 완료되었습니다.");
            return;
        }
        /////////////
        console.log('[userSaga] payload: ', action.payload);
        const res = yield call(apiSignUp, action.payload);
        console.log("[userSaga] Register - res.data : ", res.data);

        if (token) {
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
            localStorage.setItem("auth_token", token);
        }

        yield put(signUpSuccess({ user, token }));
        message.success("회원가입이 완료되었습니다.");
    } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "회원가입에 실패했습니다.";
        yield put(signUpFailure(msg));
        message.error(msg);
    }
}

// --- 로그아웃 ---
function* handleLogout() {
    try {
        // 서버에 블랙리스트 처리 등이 필요하면 여기서 호출
        // yield call(() => api.post("/api/user/logout"));
    } finally {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }
}

export default function* userSaga() {
    yield takeLatest(loginRequest.type, handleLogin);
    yield takeLatest(signUpRequest.type, handleSignUp);
    yield takeLatest(logout.type, handleLogout);
}
