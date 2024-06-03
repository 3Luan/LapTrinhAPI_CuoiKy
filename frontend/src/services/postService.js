import backendApi from "../utils/backendApi";

export const createPostAPI = (formData) => {
  return backendApi.post(`/api/post/createPost`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getPostsAPI = (currentPage) => {
  return backendApi.get(`/api/post/getPosts/${currentPage}`);
};

export const getPostsByUserIdAPI = (userId, currentPage) => {
  return backendApi.get(`/api/post/getPostsByUserId/${userId}/${currentPage}`);
};

//////////////////////////

export const updatePostAPI = (formData) => {
  return backendApi.post(`/api/post/updatePost`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const likePostAPI = (postId) => {
  return backendApi.post(`/api/post/likePost`, { postId });
};

export const unLikePostAPI = (postId) => {
  return backendApi.post(`/api/post/unLikePost`, { postId });
};

export const searchPostAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/post/searchPost/${currentPage}/${keyword}`);
};

export const searchHistoryPostAPI = (currentPage, keyword) => {
  return backendApi.get(
    `/api/post/searchHistoryPost/${currentPage}/${keyword}`
  );
};

export const searchUnapprovedPostAPI = (currentPage, keyword) => {
  return backendApi.get(
    `/api/post/searchUnapprovedPost/${currentPage}/${keyword}`
  );
};

export const getUnapprovedPostsAPI = (currentPage) => {
  return backendApi.get(`/api/post/getUnapprovedPosts/${currentPage}`);
};

export const getHistoryPostsAPI = (currentPage) => {
  return backendApi.get(`/api/post/getHistoryPosts/${currentPage}`);
};

export const getPostDetailByIdAPI = (postId) => {
  return backendApi.get(`/api/post/getPostDetail/${postId}`);
};

export const getPostUnApprovedDetailByIdAPI = (postId) => {
  return backendApi.get(`/api/post/getPostUnApprovedDetailById/${postId}`);
};

export const toggleLikePostAPI = (postId) => {
  return backendApi.post(`/api/post/toggleLikePost`, { postId });
};

export const approvedPostAPI = (postId) => {
  return backendApi.post(`/api/post/approvedPost`, { postId });
};

export const deletePosttAPI = (postId) => {
  return backendApi.post(`/api/post/deletePost`, { postId });
};

export const searchPostSavedAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/post/searchPostSaved/${currentPage}/${keyword}`);
};

// admin
export const getDeletePostsAPI = (currentPage) => {
  return backendApi.get(`/api/post/getDeletePosts/${currentPage}`);
};

export const getPostsStatisticsAPI = (day, month, year) => {
  return backendApi.get(`/api/post/getPostsStatistics/${day}/${month}/${year}`);
};

export const getUnapprovedPostsStatisticsAPI = (day, month, year) => {
  return backendApi.get(
    `/api/post/getUnapprovedPostsStatistics/${day}/${month}/${year}`
  );
};

export const getapprovedPostsStatisticsAPI = (day, month, year) => {
  return backendApi.get(
    `/api/post/getapprovedPostsStatistics/${day}/${month}/${year}`
  );
};

export const getPostDeleteDetailByIdAPI = (postId) => {
  return backendApi.get(`/api/post/getPostDeleteDetailById/${postId}`);
};
