import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    id: "",
    name: "",
    email: "",
    avatar: "",
    accessToken: "",
    refreshToken: "",

    isLoading: false,
    isError: false,
    auth: false,
  },
  reducers: {
    refresh: (state) => {
      state.isLoading = true;
    },
    refreshError: (state) => {
      state.isLoading = false;
      state.isError = true;
      state.auth = false;

      state.id = "";
      state.name = "";
      state.email = "";
      state.avatar = "";
      state.accessToken = "";
      state.refreshToken = "";
    },
    refreshSuccess: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.auth = true;

      state.id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const { refresh, refreshError, refreshSuccess } = authSlice.actions;

export default authSlice.reducer;
