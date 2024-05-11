import youtubeApi from "../utils/youtubeApi";

export const popularVideosAPI = () => {
  return youtubeApi.get(`videos`, {
    params: {
      part: "snippet",
      chart: "mostPopular",
      regionCode: "VN", // Video của quốc gia nào
      maxResults: 15, // Số lượng video bạn muốn hiển thị
    },
  });
};

export const searchVideosAPI = (keyword) => {
  return youtubeApi.get(`search`, {
    params: {
      part: "snippet",
      type: "video",
      q: keyword,
      maxResults: 2,
    },
  });
};

export const getVideoByIdAPI = (videoId) => {
  return youtubeApi.get(`videos`, {
    params: {
      part: "snippet,statistics,contentDetails",
      id: videoId,
    },
  });
};

export const getVideoCommentsByIdAPI = (videoId) => {
  return youtubeApi.get(`commentThreads`, {
    params: {
      part: "snippet",
      videoId: videoId,
      maxResults: 2, // Số lượng bình luận tối đa muốn lấy (có thể thay đổi)
      order: "relevance", // Thứ tự sắp xếp bình luận
    },
  });
};

export const getVideoRelatedByIdAPI = (videoTitle) => {
  return youtubeApi.get(`search`, {
    params: {
      part: "snippet",
      type: "video",
      q: videoTitle,
      maxResults: 2,
    },
  });
};

export const getPopularMusicVideosAPI = () => {
  return youtubeApi.get(`videos`, {
    params: {
      part: "snippet",
      chart: "mostPopular",
      regionCode: "VN",
      videoCategoryId: 10,
      maxResults: 2,
    },
  });
};
