import backendApi from "../utils/backendApi";

///////////////////////// YOUTUBE /////////////////////////

export const getPlaylistIdAPI = () => {
  return backendApi.get(`/api/playlist/getPlaylistId`);
};

export const getPlaylistVideosAPI = (playlistId) => {
  return backendApi.get(`/api/playlist/getPlaylistVideos/${playlistId}`);
};

///////////////////////// HỆ THỐNG /////////////////////////

export const checkAndCreatePlaylistAPI = (videoId, categoryId) => {
  return backendApi.post(`/api/playlist/checkAndCreatePlaylist`, {
    videoId,
    categoryId,
  });
};

export const getAutoPlaylistAPI = () => {
  return backendApi.get(`/api/playlist/getAutoPlaylist`);
};

export const getVideoInAutoPlaylistAPI = (playlistId) => {
  return backendApi.get(`/api/playlist/getVideoInAutoPlaylist/${playlistId}`);
};
