import { configureStore } from "@reduxjs/toolkit";
import reportReducer from "./slices/reportSlice";

export const store = configureStore({
  reducer: {
    report: reportReducer,
    // adicione outros reducers aqui se necessário
  },
});

// Tipos para o RootState e AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
