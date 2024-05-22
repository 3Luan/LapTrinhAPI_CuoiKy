import backendApi from "../utils/backendApi";

export const addHistoryAPI = (videoId, categoryId) => {
  return backendApi.post("/api/history/addHistory", { videoId, categoryId });
};

export const getHistoryAPI = () => {
  return backendApi.get("/api/history/getHistory");
};
