import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiOutlineLike, AiOutlineSave } from "react-icons/ai";
import { abbreviateNumber } from "js-abbreviation-number";
import SuggestionVideoCard from "../components/card/SuggestionVideoCard";
import {
  getRelatedVideosAPI,
  getVideoVideoDetailsAPI,
  getVideoCommentsByIdAPI,
} from "../services/videoService";
import LeftNav from "../components/LeftNav";
import { Context } from "../context/contextApi";
import { addHistoryAPI } from "../services/historyService";
import { checkAndCreatePlaylistAPI } from "../services/playlistService";
import moment from "moment";
import "moment/locale/vi";
import AddPlaylistModal from "../components/modals/AddPlaylistModal";
import toast from "react-hot-toast";
import {
  addCommentAPI,
  checkLikeVideoAPI,
  deleteCommentAPI,
  likeVideoAPI,
  unlikeVideoAPI,
} from "../services/likeVideoService";
import { useSelector } from "react-redux";

const VideoDetails = () => {
  moment.locale("vi");
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [isLoadingVideo, setLoadingVideo] = useState(false);
  const [isLoadingRelatedVideos, setLoadingRelatedVideos] = useState(false);
  const { changeLoading } = useContext(Context);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const auth = useSelector((state) => state.auth);

  console.log("comments", comments);

  useEffect(() => {
    fetchVideoDetails();
  }, [id]);

  useEffect(() => {
    if (categoryId !== "") {
      addHistory();
    }
  }, [id, categoryId]);

  useEffect(() => {
    if (video?.snippet?.title) {
      fetchRelatedVideos();
      fetchComments();
    }
  }, [video?.snippet?.title]);

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
  }, []);

  const fetchVideoDetails = async () => {
    setLoadingVideo(true);
    changeLoading(true);

    if (id !== "undefined") {
      try {
        const data = await getVideoVideoDetailsAPI(id);
        if (data && data?.items[0]) {
          setVideo(data?.items[0]);
          setCategoryId(data?.items[0]?.snippet?.categoryId);
        } else {
          setVideo(null);
          setCategoryId("");
        }
      } catch (error) {
        console.log(error);
        setVideo(null);
        setCategoryId("");
      }
    }
    changeLoading(false);
    setLoadingVideo(false);
  };

  const addHistory = async () => {
    if (id !== "undefined" && categoryId !== "") {
      try {
        await addHistoryAPI(id, categoryId);
        await checkAndCreatePlaylistAPI(id, categoryId);
        const check = await checkLikeVideoAPI(id);
        if (check?.code === 0) setIsLiked(check?.data);

        console.log("check", check);
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

  const fetchComments = async () => {
    if (id !== "undefined") {
      try {
        const data = await getVideoCommentsByIdAPI(id);
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

  const handleSaveToPlaylist = () => {
    setOpenModal(true);
  };

  const handleLikeVideo = async () => {
    try {
      const response = await likeVideoAPI(video?.id);
      if (response?.code === 0) {
        setIsLiked(true);
        toast.success("Thích video thành công");
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Lỗi khi thích video:", error);
      toast.error("Lỗi khi thích video");
    }
  };

  const handleUnlikeVideo = async () => {
    try {
      const response = await unlikeVideoAPI(video?.id);
      if (response?.code === 0) {
        setIsLiked(false);
        toast.success("Bỏ thích video thành công");
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Lỗi khi bỏ thích video:", error);
      toast.error("Lỗi khi bỏ thích video");
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      toast.error("Vui lòng nhập bình luận.");
      return;
    }
    try {
      const response = await addCommentAPI(id, newComment); // Giả sử bạn có API để thêm bình luận
      if (response?.code === 0) {
        setComments((prevComments) => [response.data, ...prevComments]);
        setNewComment("");
        toast.success("Thêm bình luận thành công");
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
      toast.error("Lỗi khi thêm bình luận");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // Gửi yêu cầu xóa bình luận đến máy chủ
      const response = await deleteCommentAPI(commentId);
      if (response?.code === 0) {
        // Xóa bình luận thành công, cập nhật lại danh sách bình luận
        const updatedComments = comments.filter(
          (comment) => comment.id !== commentId
        );
        setComments(updatedComments);
        toast.success("Xóa bình luận thành công");
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      toast.error("Lỗi khi xóa bình luận");
    }
  };

  return (
    <div className="flex justify-center flex-row h-[calc(100%-56px)] bg-pink-50 overflow-y-auto ">
      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row">
        <div className="flex flex-col lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] px-4 py-3 lg:py-6 ">
          {!isLoadingVideo && (
            <>
              <div className="h-[300px] md:h-[300px] lg:h-[400px] xl:h-[550px] ml-[-16px] lg:ml-0 mr-[-16px] lg:mr-0">
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${id}`}
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
              <div className="text-sm text-gray-600 flex items-center">
                {`${abbreviateNumber(
                  video?.statistics?.viewCount,
                  2
                )} lượt xem `}
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
                      {video?.author?.badges[0]?.type ===
                        "VERIFIED_CHANNEL" && (
                        <BsFillCheckCircleFill className="text-black/[0.5] text-[12px] ml-1" />
                      )}
                    </div>
                    <div className="text-black/[0.7] text-sm">
                      <span>110 người đăng ký</span>
                    </div>
                  </div>
                </div>
                <div className="flex text-black mt-4 md:mt-0">
                  {isLiked ? (
                    <button
                      className="flex items-center justify-center h-9 px-6 rounded-3xl bg-slate-600/[0.15] transition-colors duration-300 ease-in-out hover:bg-slate-600/[0.3] hover:text-white"
                      onClick={handleUnlikeVideo}
                    >
                      <AiOutlineLike className="text-lg text-black mr-2" />
                      {`${abbreviateNumber(
                        video?.statistics?.likeCount,
                        2
                      )} Likes`}
                    </button>
                  ) : (
                    <button
                      className="flex items-center justify-center h-9 px-6 rounded-3xl bg-slate-600/[0.15] transition-colors duration-300 ease-in-out hover:bg-slate-600/[0.3] hover:text-white"
                      onClick={handleLikeVideo}
                    >
                      <AiOutlineLike className="text-lg text-black mr-2" />
                      {`${abbreviateNumber(
                        video?.statistics?.likeCount,
                        2
                      )} Likes`}
                    </button>
                  )}
                  <button
                    className="flex items-center justify-center h-9 px-6 rounded-3xl bg-slate-600/[0.15] ml-2 transition-colors duration-300 ease-in-out hover:bg-slate-600/[0.3] hover:text-white"
                    onClick={handleSaveToPlaylist}
                  >
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
                <textarea
                  className="w-full h-10 border-none px-4 py-2 mb-4 bg-pink-50"
                  placeholder="Viết bình luận ..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4 ml-2 hover:bg-blue-600"
                  onClick={handleCommentSubmit}
                >
                  Gửi
                </button>
              </div>
            </div>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-start">
                    <img
                      className="h-10 w-10 rounded-full object-cover mr-3"
                      src={
                        comment.snippet.topLevelComment.snippet
                          .authorProfileImageUrl
                      }
                      alt={
                        comment.snippet.topLevelComment.snippet
                          .authorDisplayName
                      }
                    />
                    <div>
                      <div className="text-black font-semibold">
                        {
                          comment.snippet.topLevelComment.snippet
                            .authorDisplayName
                        }
                      </div>
                      <div className="text-gray-600">
                        {truncateDate(
                          comment.snippet.topLevelComment.snippet.publishedAt
                        )}
                      </div>
                      <div className="text-black mt-2">
                        {comment.snippet.topLevelComment.snippet.textOriginal.substring(
                          0,
                          100
                        )}
                        ...
                      </div>
                      <div className="text-blue-700 mt-1">
                        <span>
                          {comment?.snippet?.totalReplyCount > 0 && (
                            <>{comment?.snippet?.totalReplyCount} phản hồi</>
                          )}
                        </span>
                      </div>
                      {comment?.snippet?.topLevelComment?.snippet?.authorDisplayName?.toLowerCase() ===
                        auth?.customUrl.toLowerCase() && (
                        <button
                          className="text-red-500 mt-2"
                          onClick={() => handleDeleteComment(comment?.id)}
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600">Không có bình luận nào.</div>
            )}
          </div>
        </div>

        <div className="flex flex-col py-6 px-4  lg:w-[350px] xl:w-[400px]">
          {!isLoadingRelatedVideos && (
            <>
              {relatedVideos?.map((item, index) => {
                return <SuggestionVideoCard key={index} video={item} />;
              })}
            </>
          )}
        </div>
      </div>
      {openModal && (
        <AddPlaylistModal
          videoId={video?.id}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
};

export default VideoDetails;
