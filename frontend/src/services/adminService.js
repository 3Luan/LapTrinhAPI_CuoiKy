import backendApi from "../utils/backendApi";

export const loginAPI = (username, password) => {
  return backendApi.post("/api/admin/login", { username, password });
};

export const refreshAPI = () => {
  return backendApi.post("/api/admin/refresh");
};

export const logoutAPI = () => {
  return backendApi.post("/api/admin/logout");
};
