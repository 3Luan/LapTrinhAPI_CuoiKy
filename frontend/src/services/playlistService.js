import backendApi from "../utils/backendApi";

export const getPlaylistIdAPI = (accessToken) => {
  return backendApi.get(`/api/playlist/getPlaylistId/${accessToken}`);
};
