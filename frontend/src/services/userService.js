import backendApi from "../utils/backendApi";

export const getUnFollowed = (currentPage) => {
  return backendApi.get(`/api/user/getunfollowed/${currentPage}`);
};

export const getFollowings = (currentPage) => {
  return backendApi.get(`/api/user/getfollowings/${currentPage}`);
};

export const getFollowers = (currentPage) => {
  return backendApi.get(`/api/user/getfollowers/${currentPage}`);
};

export const getAllUsersAPI = (search) => {
  return backendApi.get(`/api/user?search=${search}`);
};

export const followUserAPI = (userId) => {
  return backendApi.post(`/api/user/follow`, { userId });
};

export const unFollowUserAPI = (userId) => {
  return backendApi.post(`/api/user/unfollow`, { userId });
};

export const getUserInfoByIdAPI = (userId) => {
  return backendApi.get(`/api/user/getuserinfobyid/${userId}`);
};

export const getSavePostsdAPI = (currentPage) => {
  return backendApi.get(`/api/user/getSavePosts/${currentPage}`);
};

export const getSaveDocumentsdAPI = (currentPage) => {
  return backendApi.get(`/api/user/getSaveDocuments/${currentPage}`);
};

export const savedPostdAPI = (postId) => {
  return backendApi.post(`/api/user/savedPost`, { postId });
};

export const unSavedPostdAPI = (postId) => {
  return backendApi.post(`/api/user/unSavedPost`, { postId });
};

export const updateProfileAPI = (formData) => {
  return backendApi.post(`/api/user/updateProfile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const searchUnFollowedAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/user/searchUnFollowed/${currentPage}/${keyword}`);
};

export const searchFollowingsAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/user/searchFollowings/${currentPage}/${keyword}`);
};

export const searchFollowersAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/user/searchFollowers/${currentPage}/${keyword}`);
};

export const getSavePostIdAPI = () => {
  return backendApi.get(`/api/user/getSavePostId`);
};

//////////////////////// Admin //////////////////////

export const getAdminAPI = (currentPage) => {
  return backendApi.get(`/api/user/getAdmin/${currentPage}`);
};

export const getAllUserAPI = (currentPage) => {
  return backendApi.get(`/api/user/getAllUser/${currentPage}`);
};

export const grantAdminRoleAPI = (userId) => {
  return backendApi.post(`/api/user/grantAdminRole`, { userId });
};

export const revokeAdminRoleAPI = (userId) => {
  return backendApi.post(`/api/user/revokeAdminRole`, { userId });
};

export const searchUserRoleAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/user/searchUserRole/${currentPage}/${keyword}`);
};

export const searchAdminRoleAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/user/searchAdminRole/${currentPage}/${keyword}`);
};

export const getUserStatisticsAPI = () => {
  return backendApi.get(`/api/user/getUserStatistics`);
};

export const getUserIsBanStatisticsAPI = () => {
  return backendApi.get(`/api/user/getUserIsBanStatistics`);
};

export const getUserNotBanStatisticsAPI = () => {
  return backendApi.get(`/api/user/getUserNotBanStatistics`);
};

export const banUserAPI = (userId) => {
  return backendApi.post(`/api/user/banUser`, { userId });
};

export const unBanUserAPI = (userId) => {
  return backendApi.post(`/api/user/unBanUser`, { userId });
};

export const getBanUserAPI = (currentPage) => {
  return backendApi.get(`/api/user/getBanUser/${currentPage}`);
};

export const searchBanUserAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/user/searchBanUser/${currentPage}/${keyword}`);
};

export const getNewUserStatisticsAPI = (day, month, year) => {
  return backendApi.get(
    `/api/user/getNewUserStatistics/${day}/${month}/${year}`
  );
};
