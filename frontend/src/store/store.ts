import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage";
import authReducer from "@feature/auth/authSlice"

const persistConfig = {
    key: "root",
    storage,
}
const persistedReducer = persistReducer(persistConfig, authReducer)
export const store = configureStore({
    reducer: {
        authReducer: persistedReducer
    }
})
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch