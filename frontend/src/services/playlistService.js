import backendApi from "../utils/backendApi";

export const getPlaylistIdAPI = () => {
  return backendApi.get(`/api/playlist/getPlaylistId`);
};

export const getPlaylistVideosAPI = (playlistId) => {
  return backendApi.get(`/api/playlist/getPlaylistVideos/${playlistId}`);
};
