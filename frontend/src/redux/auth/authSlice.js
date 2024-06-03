import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    id: "",
    name: "",
    description: "",
    customUrl: "",
    publishedAt: "",
    country: "",
    email: "",
    avatar: "",
    coverAvatar: "",
    subscriberCount: "",
    accessToken: "",
    refreshToken: "",
    isBan: "",
    isAdmin: "",

    isLoading: false,
    isInit: true,
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
      state.isInit = false;

      state.id = "";
      state.name = "";
      state.description = "";
      state.customUrl = "";
      state.publishedAt = "";
      state.country = "";
      state.email = "";
      state.avatar = "";
      state.coverAvatar = "";
      state.subscriberCount = "";
      state.accessToken = "";
      state.refreshToken = "";
      state.isBan = "";
      state.isAdmin = "";
    },
    refreshSuccess: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.auth = true;
      state.isInit = false;

      state.id = action.payload._id;
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.customUrl = action.payload.customUrl;
      state.publishedAt = action.payload.publishedAt;
      state.country = action.payload.country;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.coverAvatar = action.payload.coverAvatar;
      state.subscriberCount = action.payload.subscriberCount;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isBan = action.payload.isBan;
      state.isAdmin = action.payload.isAdmin;
    },
  },
});

export const { refresh, refreshError, refreshSuccess } = authSlice.actions;

export default authSlice.reducer;
