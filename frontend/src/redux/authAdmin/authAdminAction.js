import toast from "react-hot-toast";
import { loginAPI, logoutAPI, refreshAPI } from "../../services/adminService";
import {
  login,
  loginError,
  loginSuccess,
  logout,
  logoutError,
  logoutSuccess,
  refresh,
  refreshError,
  refreshSuccess,
} from "./authAdminSlice";

export const handleLoginAdmin = (username, password) => {
  return async (dispatch, getState) => {
    dispatch(login());

    let res = await loginAPI(username, password);

    if (res) {
      if (res.code === 0) {
        // Đăng nhập thành công
        toast.success(res.message);
        dispatch(loginSuccess(res));
      } else if (res.code === 1) {
        // Đăng nhập thất bại
        toast.error(res.message);
        dispatch(loginError());
      }
    } else {
      // Đăng nhập thất bại
      toast.error("Error: Đăng nhập");
      dispatch(loginError());
    }
  };
};

export const handleRefreshAdmin = () => {
  return async (dispatch, getState) => {
    dispatch(refresh());

    let res = await refreshAPI();

    if (res) {
      if (res.code === 0) {
        // Refresh thành công
        dispatch(refreshSuccess(res));
      } else if (res.code === 1) {
        //Refresh thất bại
        dispatch(refreshError());
      }
    } else {
      //Refresh thất bại
      toast.error("Error: Refresh");
      dispatch(refreshError());
    }
  };
};
export const handleLogoutAdmin = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(logout());

    let res = await logoutAPI();

    if (res) {
      if (res.code === 0) {
        toast.success(res.message);
        dispatch(logoutSuccess());
        // Use history object to navigate
        navigate("/admin/login");
      } else if (res.code === 1) {
        toast.error(res.message);
        dispatch(logoutError());
      }
    } else {
      dispatch(logoutError());
    }
  };
};
