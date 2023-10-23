import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch } from "../store";

export const navigatorSlice = createSlice({
  name: "navigator",
  initialState: {
    href: "",
    isScrolling: false,
  },
  reducers: {
    setHref(state, action: PayloadAction<string>) {
      state.href = action.payload;
    },
  },
});

export const setHrefDebounce = (function () {
  let timer: null | NodeJS.Timeout = null;
  let time: number = 0;
  let scrollTime = 1000;
  let isScrolling = false;
  let scrollTimer: null | NodeJS.Timeout = null;

  return (
    value: string,
    dispatch: ReturnType<typeof useAppDispatch>,
    force: boolean = false,
  ) => {
    if (force) {
      timer && clearTimeout(timer);
      if (scrollTimer) {
        clearTimeout(scrollTimer);
        scrollTimer = null;
      }

      isScrolling = true;
      scrollTimer = setTimeout(() => {
        isScrolling = false;
        scrollTimer && clearTimeout(scrollTimer);
        scrollTimer = null;
      }, scrollTime);
      dispatch(setHref(value));
      return;
    }

    if (isScrolling) {
      return;
    }

    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      dispatch(setHref(value));
      timer = null;
    }, time);
  };
})();

export const { setHref } = navigatorSlice.actions;
