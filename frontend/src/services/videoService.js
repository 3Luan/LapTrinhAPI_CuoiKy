import youtubeApi from "../utils/youtubeApi";
import axios from "axios";

export const popularVideosAPI = () => {
  return youtubeApi.get(`videos`, {
    params: {
      part: "snippet,statistics",
      chart: "mostPopular",
      regionCode: "VN", // Video của quốc gia nào
      maxResults: 12, // Số lượng video bạn muốn hiển thị
    },
  });
};

export const searchVideosAPI = (keyword) => {
  return youtubeApi.get(`search`, {
    params: {
      part: "snippet",
      type: "video",
      q: keyword,
      maxResults: 12,
    },
  });
};

export const getRelatedVideosAPI = (keyword) => {
  return youtubeApi.get(`search`, {
    params: {
      part: "snippet",
      type: "video",
      q: keyword,
      maxResults: 12,
    },
  });
};

export const getVideoVideoDetailsAPI = (videoId) => {
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
      maxResults: 12, // Số lượng bình luận tối đa muốn lấy (có thể thay đổi)
      order: "relevance", // Thứ tự sắp xếp bình luận
    },
  });
};

export const getPopularMusicVideosAPI = () => {
  return youtubeApi.get(`videos`, {
    params: {
      part: "snippet,statistics",
      chart: "mostPopular",
      regionCode: "VN",
      videoCategoryId: 10,
      maxResults: 12,
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

export const getPopularGameVideosAPI = () => {
  return youtubeApi.get(`videos`, {
    params: {
      part: "snippet,statistics",
      chart: "mostPopular",
      regionCode: "VN",
      videoCategoryId: 20,
      maxResults: 12,
    },
  });
};
export const getPopularSportVideosAPI = () => {
  return youtubeApi.get(`videos`, {
    params: {
      part: "snippet,statistics",
      chart: "mostPopular",
      regionCode: "VN",
      videoCategoryId: 17,
      maxResults: 12,
    },
  });
};
// // Lấy video trong danh sách phát
// export const getPlaylistVideosAPI = (playlistId) => {
//   return youtubeApi.get("playlistItems", {
//     params: {
//       part: "snippet,contentDetails",
//       playlistId: playlistId,
//       maxResults: 12, // You can change this value based on your needs
//     },
//   });
// };

////////////////////////////////////

// export const getRelatedVideosAPI = async (videoId) => {
//   try {
//     const response = await axios.get(
//       "https://youtube-media-downloader.p.rapidapi.com/v2/video/related",
//       {
//         params: {
//           videoId: videoId,
//         },
//         headers: {
//           "X-RapidAPI-Key":
//             "6084b3baf9msh1e664919b0b05a9p1c6450jsn3eaca78b0c53",
//           "X-RapidAPI-Host": "youtube-media-downloader.p.rapidapi.com",
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error fetching related videos:", error);
//     throw error;
//   }
// };
