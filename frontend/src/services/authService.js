import backendApi from "../utils/backendApi";

export const refreshAPI = () => {
  return backendApi.post("/api/auth/refresh");
};

export const logoutAPI = () => {
  return backendApi.post("/api/auth/logout");
};
