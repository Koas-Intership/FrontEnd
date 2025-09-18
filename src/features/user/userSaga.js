// src/features/user/userSaga.js
import { call, put, takeLatest, delay } from "redux-saga/effects";
import { message } from "antd";
import {
    loginRequest, loginSuccess, loginFailure, logout,
    signUpRequest, signUpSuccess, signUpFailure,
    changingPasswordRequest, changingPasswordSuccess, changingPasswordFailure,
    bootstrapRequest, bootstrapSuccess, bootstrapFailure,
} from "./userSlice";
import { api } from "../../lib/api";

// 로컬스토리지 키 통일
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const USE_MOCK = false;

// Authorization 헤더 세팅 유틸
function setAuthHeader(token) {
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete api.defaults.headers.common.Authorization;
}

//에러 메시지 추출
function getErrMsg(err, fallback) {
    return err?.response?.data?.message || err?.message || fallback;
}

/** --- 로그인 --- */
function apiLogin({ email, password }) {
    return api.post(
        "/api/user/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
    );
}

function* handleLogin(action) {
    try {
        const { email, password } = action.payload;

        if (USE_MOCK) {
            yield delay(300);
            const user = { name: email.split("@")[0], email, role: "사원" };
            const token = "dev-mock-token";
            setAuthHeader(token);
            localStorage.setItem(ACCESS_KEY, token);
            yield put(loginSuccess({ user, token }));
            message.success(`${user.name}님, 환영합니다!`);
            return;
        }

        const res = yield call(apiLogin, { email, password });
        const data = res?.data || {};
        const accessToken = data.accessToken || data.token || null;
        const refreshToken = data.refreshToken || null;

        if (accessToken) {
            setAuthHeader(accessToken);
            localStorage.setItem(ACCESS_KEY, accessToken);
        }
        if (refreshToken) {
            localStorage.setItem(REFRESH_KEY, refreshToken);
        }

        // 내 정보 조회
        const meRes = yield call([api, api.get], "/api/user/me");
        const user = meRes?.data || null;

        yield put(loginSuccess({ user, token: accessToken }));
        message.success(`${user?.name || "사용자"}님, 환영합니다!`);
    } catch (err) {
        const msg = getErrMsg(err, "아이디 또는 비밀번호를 확인해 주세요.");
        yield put(loginFailure(msg));
        message.error(msg);
    }
}

/** --- 회원가입 --- */
function apiSignUp(form) {
    return api.post("/api/user/register", form);
}

function* handleSignUp(action) {
    try {
        if (USE_MOCK) {
            yield delay(300);
            const user = {
                name: action.payload.name || "신규 사용자",
                email: action.payload.email,
                role: "사원",
            };
            const token = "dev-mock-token-signup";
            setAuthHeader(token);
            localStorage.setItem(ACCESS_KEY, token);
            yield put(signUpSuccess({ user, token }));
            message.success("회원가입이 완료되었습니다.");
            return;
        }

        // 1) 회원가입
        yield call(apiSignUp, action.payload);

        // 2) 바로 로그인
        const { email, password } = action.payload;
        const loginRes = yield call(apiLogin, { email, password });
        const loginData = loginRes?.data || {};
        const accessToken = loginData.accessToken || loginData.token || null;
        const refreshToken = loginData.refreshToken || null;

        if (accessToken) {
            setAuthHeader(accessToken);
            localStorage.setItem(ACCESS_KEY, accessToken);
        }
        if (refreshToken) {
            localStorage.setItem(REFRESH_KEY, refreshToken);
        }

        // 3) 내 정보 조회
        let me = loginData.user || null;
        if (!me) {
            const meRes = yield call([api, api.get], "/api/user/me");
            me = meRes?.data || null;
        }

        // 4) 스토어 갱신
        yield put(signUpSuccess({ user: me, token: accessToken }));
        yield put(loginSuccess({ user: me, token: accessToken }));

        message.success("회원가입이 완료되었습니다.");
    } catch (err) {
        const msg = getErrMsg(err, "회원가입에 실패했습니다.");
        yield put(signUpFailure(msg));
        message.error(msg);
    }
}

/** --- 로그아웃 --- */
function* handleLogout() {
    setAuthHeader(null);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);

}

/** --- 비밀번호 변경 --- */
function apiChangePassword(payload) {
    console.log("[userSaga] apiChangePassword: ", payload);
    return api.patch("/api/user/change-password", payload);
}

function* handleChangingPassword(action) {
    try {
        const { newPassword } = action.payload;
        yield call(apiChangePassword, { newPassword });

        yield put(changingPasswordSuccess());
        message.success("비밀번호가 변경되었습니다.");

    } catch (err) {
        const msg = getErrMsg(err, "비밀번호 변경에 실패했습니다.");
        yield put(changingPasswordFailure(msg));
        message.error(msg);
    }
}

// --- 부트스트랩(새로고침 복구) ---
function* handleBootstrap() {
    try {
        const token = localStorage.getItem('access_token');
        const cachedMe = localStorage.getItem('me');

        // 토큰/캐시 둘 다 없으면 그냥 부트 종료
        if (!token && !cachedMe) {
            yield put(bootstrapSuccess());
            return;
        }

        // 1순위: 서버 me 동기화
        try {
            const meRes = yield call([api, api.get], '/api/user/me');
            const me = meRes?.data || null;
            localStorage.setItem('me', JSON.stringify(me || {}));
            yield put(loginSuccess({ me, token }));
            yield put(bootstrapSuccess());
            return;
        } catch (_) {
            // 2순위: 서버 실패 → 캐시로 복구
            if (cachedMe) {
                const me = JSON.parse(cachedMe);
                yield put(loginSuccess({ me, token }));
            }
            yield put(bootstrapSuccess());
            return;
        }
    } catch (e) {
        yield put(bootstrapFailure());
    }
}

export default function* userSaga() {
    yield takeLatest(loginRequest.type, handleLogin);
    yield takeLatest(signUpRequest.type, handleSignUp);
    yield takeLatest(logout.type, handleLogout);
    yield takeLatest(changingPasswordRequest.type, handleChangingPassword);
    yield takeLatest(bootstrapRequest.type, handleBootstrap);
}
