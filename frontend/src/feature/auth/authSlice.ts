import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null,
    isAuthenticated: boolean
}
const initialState: AuthState = {
    token: null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.token = null
            state.isAuthenticated = false
        }
    }
})
export const { login, logout } = authSlice.actions
export default authSlice.reducer

