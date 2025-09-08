import { createSlice } from '@reduxjs/toolkit';

const initialState = { list: [], loading: false, error: null };

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        fetchUserRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchUserSuccess(state, action) {
            state.loading = false;
            state.list = action.payload;
        },
        fetchUserFailure(state, action) {
            state.loading = false;
            state.error = action.payload || '에러';
        },
    },
});

export const { fetchUserRequest, fetchUserSuccess, fetchUserFailure } = userSlice.actions;
export default userSlice.reducer;
