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
    },
    refreshSuccess: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.auth = true;

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
    },
  },
});

export const { refresh, refreshError, refreshSuccess } = authSlice.actions;

export default authSlice.reducer;
