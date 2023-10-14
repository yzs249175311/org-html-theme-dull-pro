import { configureStore } from "@reduxjs/toolkit";
import { navigatorSlice } from "@/store/navigator/navigator.reducer";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    navigator: navigatorSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
