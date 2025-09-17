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
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // --- 로그인 ---
        loginRequest: (state, _action) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.me = action.payload.me ?? action.payload.user ?? null;
            state.token = action.payload.token ?? null;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload || "로그인에 실패했습니다.";
        },
        logout: (state) => {
            state.me = null;
            state.token = null;
            state.error = null;
        },

        // --- 회원가입 ---
        signUpRequest: (state) => {
            state.signingUp = true;
            state.signUpError = null;
        },
        signUpSuccess: (state, action) => {
            state.signingUp = false;
            state.me = action.payload.me ?? action.payload.user ?? null;
            state.token = action.payload.token ?? null;
            console.log("[userSlice]", action);
        },
        signUpFailure: (state, action) => {
            state.signingUp = false;
            state.signUpError = action.payload || "회원가입에 실패했습니다.";
        },
    },
});

export const {
    loginRequest, loginSuccess, loginFailure, logout,
    signUpRequest, signUpSuccess, signUpFailure,
} = userSlice.actions;
export default userSlice.reducer;