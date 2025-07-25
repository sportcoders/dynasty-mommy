import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
    persistStore, persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@feature/auth/authSlice";

const persistConfig = {
    key: "root",
    storage,
};
//TODO: use so store only has one reducer
const rootReducer = combineReducers({
    auth: authReducer,
});
const persistedReducer = persistReducer(persistConfig, authReducer);
export const store = configureStore({
    reducer: {
        authReducer: persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;