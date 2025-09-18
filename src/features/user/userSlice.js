import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // --- 로그인 상태 ---
    me: null,
    loading: false,
    error: null,
    token: null,

    // --- 회원가입 상태 ---
    signingUp: false,
    signUpError: null,

    // --- 비밀번호 변경 상태 ---
    changingPassword: false,
    changingPasswordError: null,   // ← 오타 수정
    changingPasswordDone: false,

    // 새로고침 복구
    booting: true,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // --- 로그인 ---
        loginRequest(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.me = action.payload.me ?? action.payload.user ?? null;
            state.token = action.payload.token ?? null;
            state.error = null;
        },
        loginFailure(state, action) {
            state.loading = false;
            state.error = action.payload || "로그인에 실패했습니다.";
        },
        logout(state) {
            state.me = null;
            state.token = null;
            state.error = null;

            // 옵션: 비번 변경 진행 중 상태도 초기화
            state.changingPassword = false;
            state.changingPasswordError = null;
            state.changingPasswordDone = false;
        },

        // --- 회원가입 ---
        signUpRequest(state) {
            state.signingUp = true;
            state.signUpError = null;
        },
        signUpSuccess(state, action) {
            state.signingUp = false;
            state.me = action.payload.me ?? action.payload.user ?? null;
            state.token = action.payload.token ?? null;
        },
        signUpFailure(state, action) {
            state.signingUp = false;
            state.signUpError = action.payload || "회원가입에 실패했습니다.";
        },

        // --- 비밀번호 변경 ---
        changingPasswordRequest(state) {
            state.changingPassword = true;
            state.changingPasswordError = null;
            state.changingPasswordDone = false;
        },
        changingPasswordSuccess(state) {
            state.changingPassword = false;
            state.changingPasswordError = null;
            state.changingPasswordDone = true; // ← 성공 플래그
        },
        changingPasswordFailure(state, action) {
            state.changingPassword = false;
            state.changingPasswordError =
                action.payload || "비밀번호 변경에 실패했습니다.";
            state.changingPasswordDone = false;
        },
        clearChangingPasswordState(state) {
            state.changingPassword = false;
            state.changingPasswordError = null;
            state.changingPasswordDone = false;
        },

        // 새로고침 복구
        bootstrapRequest(state) {
            state.booting = true;
        },
        bootstrapSuccess(state) {
            state.booting = false;
        },
        bootstrapFailure(state) {
            state.booting = false;
        },
    },
});

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    logout,
    signUpRequest,
    signUpSuccess,
    signUpFailure,
    changingPasswordRequest,
    changingPasswordSuccess,
    changingPasswordFailure,
    clearChangingPasswordState,
    bootstrapRequest,
    bootstrapSuccess,
    bootstrapFailure,
} = userSlice.actions;

export default userSlice.reducer;
