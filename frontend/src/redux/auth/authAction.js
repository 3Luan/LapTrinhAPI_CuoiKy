import { refreshAPI } from "../../services/authService";
import { refresh, refreshError, refreshSuccess } from "./authSlice";

export const handleRefresh = () => {
  return async (dispatch, getState) => {
    dispatch(refresh());
    let res = await refreshAPI();
    if (res) {
      if (res.code === 0) {
        dispatch(refreshSuccess(res.user));
      } else {
        dispatch(refreshError());
      }
    } else {
      dispatch(refreshError());
    }
  };
};
