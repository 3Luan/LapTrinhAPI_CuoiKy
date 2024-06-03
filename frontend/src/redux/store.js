import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import authAdminSlice from "./authAdmin/authAdminSlice";

export default configureStore({
  reducer: {
    auth: authSlice,

    // Admin
    authAdmin: authAdminSlice,
  },
});
