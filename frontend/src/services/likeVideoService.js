import backendApi from "../utils/backendApi";

export const getLikedVideosAPI = () => {
  return backendApi.get(`/api/likeVideo/getLikedVideos`);
};

export const likeVideoAPI = (videoId) => {
  return backendApi.post(`/api/likeVideo/likeVideo`, { videoId });
};

export const unlikeVideoAPI = (videoId) => {
  return backendApi.post(`/api/likeVideo/unlikeVideo`, { videoId });
};

export const checkLikeVideoAPI = (videoId) => {
  return backendApi.post(`/api/likeVideo/checkLikeVideo`, { videoId });
};

export const addCommentAPI = (videoId, commentText) => {
  return backendApi.post(`/api/likeVideo/addComment`, { videoId, commentText });
};

export const deleteCommentAPI = (commentId) => {
  return backendApi.post(`/api/likeVideo/deleteComment`, { commentId });
};
