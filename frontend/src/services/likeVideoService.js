import backendApi from "../utils/backendApi";

export const getLikedVideosAPI = () => {
  return backendApi.get(`/api/likeVideo/getLikedVideos`);
};
