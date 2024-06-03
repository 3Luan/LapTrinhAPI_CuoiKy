import backendApi from "../utils/backendApi";

///////////////////////// YOUTUBE /////////////////////////

export const getPlaylistIdAPI = () => {
  return backendApi.get(`/api/playlist/getPlaylistId`);
};

export const getPlaylistVideosAPI = (playlistId) => {
  return backendApi.get(`/api/playlist/getPlaylistVideos/${playlistId}`);
};

export const addVideoToPlaylistAPI = (playlistId, videoId) => {
  return backendApi.post(`/api/playlist/addVideoToPlaylist`, {
    playlistId,
    videoId,
  });
};

export const deleteVideoFromPlaylistAPI = (playlistId, videoId) => {
  return backendApi.post(`/api/playlist/deleteVideoFromPlaylist`, {
    playlistId,
    videoId,
  });
};

export const createPlaylistAndAddVideoAPI = (title, videoId) => {
  return backendApi.post(`/api/playlist/createPlaylistAndAddVideo`, {
    title,
    videoId,
  });
};

export const deletePlaylistAPI = (playlistId) => {
  return backendApi.post(`/api/playlist/deletePlaylist`, {
    playlistId,
  });
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
