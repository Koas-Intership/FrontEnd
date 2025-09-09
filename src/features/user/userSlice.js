import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    me: null,          // 로그인한 사용자 정보
    loading: false,    // 로그인 로딩
    error: null,       // 오류 메시지
    token: null,       // (옵션) JWT 토큰 사용 시
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginRequest: (state, _action) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.me = action.payload.user;
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
    },
});

export const { loginRequest, loginSuccess, loginFailure, logout } =
    userSlice.actions;
export default userSlice.reducer;