import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiOutlineLike, AiOutlineSave } from "react-icons/ai";
import { abbreviateNumber } from "js-abbreviation-number";
import {
  getRelatedVideosAPI,
  getVideoByIdAPI,
  getVideoVideoDetailsAPI,
  getVideoCommentsByIdAPI,
} from "../services/videoService";
import { Context } from "../context/contextApi";
import {
  checkAndCreatePlaylistAPI,
  getPlaylistVideosAPI,
  getVideoInAutoPlaylistAPI,
} from "../services/playlistService";
import VideoPlaylistCard from "../components/card/VideoPlaylistCard";
import SuggestionVideoCard from "../components/card/SuggestionVideoCard";
import { addHistoryAPI } from "../services/historyService";
import moment from "moment";
import "moment/locale/vi";

const VideoPlaylistDetails = () => {
  moment.locale("vi");
  const [comments, setComments] = useState([]); // Thêm state để lưu bình luận
  const [video, setVideo] = useState([]);
  const [videoInPlaylist, setVideoInPlaylist] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const { playlistId, videoId, autoPlaylistId } = useParams();
  const [isLoadingVideo, setLoadingVideo] = useState(false);
  const [isLoadingRelatedVideos, setLoadingRelatedVideos] = useState(false);
  const [isLoadingPlaylistVideos, setLoadingPlaylistVideos] = useState(false);
  const { changeLoading } = useContext(Context);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    fetchVideoDetails();
  }, [videoId]);

  useEffect(() => {
    if (categoryId !== "") {
      addHistory();
    }
  }, [videoId, categoryId]);

  useEffect(() => {
    fetchPlaylistVideos();
  }, [playlistId]);

  useEffect(() => {
    if (video?.snippet?.title) {
      fetchRelatedVideos();
      fetchComments();
    }
  }, [video?.snippet?.title]);

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
  }, []);

  const fetchComments = async () => {
    if (videoId !== "undefined") { 
      try {
        const data = await getVideoCommentsByIdAPI(videoId); 
        if (data && data?.items) {
          setComments(data?.items);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.log(error);
        setComments([]);
      }
    }
  };
  
  const truncateDate = (dateString) => {
    const date = moment(dateString);
    return date.fromNow(); // Trả về chuỗi như "2 năm trước", "3 tháng trước", v.v.
  };
  const fetchVideoDetails = async () => {
    setLoadingVideo(true);
    changeLoading(true);

    if (videoId !== "undefined") {
      try {
        const data = await getVideoVideoDetailsAPI(videoId);
        if (data && data?.items[0]) {
          setVideo(data?.items[0]);
          setCategoryId(data?.items[0]?.snippet?.categoryId);
        } else {
          setVideo([]);
          setCategoryId("");
        }
      } catch (error) {
        console.log(error);
        setVideo([]);
        setCategoryId("");
      }
    }
    changeLoading(false);
    setLoadingVideo(false);
  };

  const addHistory = async () => {
    if (videoId !== "undefined" && categoryId !== "") {
      try {
        await addHistoryAPI(videoId, categoryId);
        await checkAndCreatePlaylistAPI(videoId, categoryId);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchRelatedVideos = async () => {
    setLoadingRelatedVideos(true);
    if (video?.snippet?.title) {
      try {
        const data = await getRelatedVideosAPI(video?.snippet?.title);
        if (data && data?.items) {
          setRelatedVideos(data?.items);
        } else {
          setRelatedVideos([]);
        }
      } catch (error) {
        console.log(error);
        setRelatedVideos([]);
      }
    }
    setLoadingRelatedVideos(false);
  };

  const fetchPlaylistVideos = async () => {
    setLoadingPlaylistVideos(true);
    try {
      let data;
      if (playlistId === "c") {
        data = await getVideoInAutoPlaylistAPI(autoPlaylistId);
        console.log("data", data);

        if (data?.code === 0) {
          // Lấy danh sách các video IDs từ mảng history
          const videoIds = data?.data?.videos.map((item) => item);

          let videosInfo = await Promise.all(
            videoIds.map((videoId) => getVideoByIdAPI(videoId))
          );
          // Tạo mảng mới chỉ chứa thông tin chi tiết của video
          const detailedData = videosInfo.map((info) => info.items[0]);
          setVideoInPlaylist(detailedData);
        } else {
          setVideoInPlaylist([]);
        }
      } else {
        data = await getPlaylistVideosAPI(playlistId);
        if (data?.code === 0) {
          setVideoInPlaylist(data?.data);
        } else {
          setVideoInPlaylist([]);
        }
      }
    } catch (error) {
      console.log(error);
      setVideoInPlaylist([]);
    }
    setLoadingPlaylistVideos(false);
  };

  return (
    <div className="flex justify-center flex-row h-[calc(100%-56px)] bg-pink-50 overflow-y-auto">
      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row">
        <div className="flex flex-col lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] px-4 py-3 lg:py-6">
          {!isLoadingVideo && (
            <>
              <div className="h-[300px] md:h-[300px] lg:h-[400px] xl:h-[550px] ml-[-16px] lg:ml-0 mr-[-16px] lg:mr-0">
              <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${videoId}`}
                  controls
                  width="100%"
                 
                  style={{ backgroundColor: "#000000" }}
                  playing={true}
                  aspectRatio="16:9"
                />
              </div>
              <div className="mt-4 line-clamp-2 pb-8">
                <div className="text-black font-bold text-xl md:text-xl">
                  {video?.snippet?.title}
                </div>
                
              </div>
              <div className="text-sm text-gray-600 flex items-center ">
                  {`${abbreviateNumber(video?.statistics?.viewCount, 2)} lượt xem `}
                  <span className="flex text-[24px] leading-none font-bold text-black/[0.7] relative top-[-5px] mx-1">
                    .
                  </span>
                  {truncateDate(video?.snippet?.publishedAt)}
                </div>
              <div className="flex justify-between flex-col md:flex-row mt-4">
                <div className="flex">
                  <div className="flex items-start">
                    <div className="flex h-11 w-11 rounded-full overflow-hidden">
                      <img
                        className="h-full w-full object-cover"
                        src={video?.snippet?.thumbnails?.high?.url}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col ml-3">
                    <div className="text-black text-md font-semibold flex items-center">
                      {video?.snippet?.channelTitle}
                      {video?.author?.badges[0]?.type === "VERIFIED_CHANNEL" && (
                        <BsFillCheckCircleFill className="text-black/[0.5] text-[12px] ml-1" />
                      )}
                    </div>
                    <div className="text-black/[0.7] text-sm">
                      <span>110 người đăng ký</span>
                    </div>
                  </div>
                </div>
                <div className="flex text-black mt-4 md:mt-0">
                  <button className="flex items-center justify-center h-9 px-6 rounded-3xl bg-slate-600/[0.15] transition-colors duration-300 ease-in-out hover:bg-slate-600/[0.3] hover:text-white">
                    <AiOutlineLike className="text-lg text-black mr-2" />
                    {`${abbreviateNumber(video?.statistics?.likeCount, 2)} Likes`}
                  </button>
                  <button className="flex items-center justify-center h-9 px-6 rounded-3xl bg-slate-600/[0.15] ml-2 transition-colors duration-300 ease-in-out hover:bg-slate-600/[0.3] hover:text-white">
                    <AiOutlineSave className="text-lg text-black mr-2" />
                    Lưu
                  </button>
                </div>
              </div>

              <div className="flex justify-between flex-col md:flex-row mt-4 text-black">
                {video?.snippet?.description?.length > 50
                  ? video?.snippet?.description?.substring(0, 200) + "..."
                  : video?.snippet?.description}
                ..Xem thêm
              </div>
            </>
          )}

          {/* Comment */}

          <div className="w-full px-4 py-6">
                <h2 className="text-xl font-bold text-black mb-4">Bình luận</h2>
                <div className="mt-6">
               <div className="flex justify-between items-center">
                  <textarea className="w-full h-10 border-none px-4 py-2 mb-4 bg-pink-50" placeholder="Viết bình luận ..."></textarea>
                       <button className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4 ml-2 hover:bg-blue-600">Gửi</button>
              </div>
            </div>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-start">
                    <img
                      className="h-10 w-10 rounded-full object-cover mr-3"
                      src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl}
                      alt={comment.snippet.topLevelComment.snippet.authorDisplayName}
                    />
                    <div>
                      <div className="text-black font-semibold">
                        {comment.snippet.topLevelComment.snippet.authorDisplayName}
                      </div>
                      <div className="text-gray-600">
                        {truncateDate(comment.snippet.topLevelComment.snippet.publishedAt)}
                      </div>
                      <div className="text-black mt-2">
                        {comment.snippet.topLevelComment.snippet.textOriginal.substring(0,100)}...
                      </div>
                      <div className="text-blue-700 mt-1">
              <span>{comment.snippet.totalReplyCount} phản hồi</span>
            </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600">Không có bình luận nào.</div>
            )}
          </div>
        </div>
        {/* DANH SÁCH PHÁT  */}
        <div className="pt-6 px-4 lg:w-[350px] xl:w-[400px] ">
          <div className=" overflow-y-auto ">
            <h3 className="text-lg font-bold pb-2 bg-black  rounded-t-lg pt-2 text-center text-white">
              Danh sách phát
            </h3>

            <div className=" max-h-80 overflow-y-auto border-gray-500 border p-2 rounded-b-lg ">
              {!isLoadingPlaylistVideos && videoInPlaylist.length > 0 && (
                <div>
                  {videoInPlaylist.map((item, index) => (
                    <VideoPlaylistCard
                      key={index}
                      video={item}
                      playlistId={
                        playlistId === "c" ? autoPlaylistId : playlistId
                      }
                      videoId={
                        playlistId === "c"
                          ? item?.id
                          : item?.contentDetails?.videoId
                      }
                      isAutoPlaylist={playlistId === "c" ? true : false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Video liên quan</h3>
            {!isLoadingRelatedVideos && relatedVideos.length > 0 && (
              <div>
                {relatedVideos.map((item, index) => (
                  <SuggestionVideoCard key={index} video={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlaylistDetails;
