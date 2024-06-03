import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import { deleteVideoFromPlaylistAPI } from "../../services/playlistService";
import toast from "react-hot-toast";

const VideoPlaylistCard = ({ playlistId, videoId, video, isAutoPlaylist }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingHidden, setIsLoadingHidden] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDeleteFromPlaylist = async () => {
    setIsLoadingDelete(true);

    try {
      const data = await deleteVideoFromPlaylistAPI(playlistId, videoId);
      if (data?.code === 0)
        toast.success("Xóa video khỏi danh sách phát thành công");
      else toast.error(data?.message);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi xóa video khỏi danh sách phát");
    }
    setIsLoadingDelete(false);
  };

  const handleHiddenFromPlaylist = async () => {
    setIsLoadingHidden(true);

    // try {
    //   const data = await deleteVideoFromPlaylistAPI(playlistId, videoId);
    //   if (data?.code === 0)
    //     toast.success("Xóa video khỏi danh sách phát thành công");
    //   else toast.error(data?.message);
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Lỗi khi xóa video khỏi danh sách phát");
    // }

    setIsLoadingHidden(false);
  };

  moment.locale("vi");
  return (
    <div className="relative flex mb-3">
      <Link
        to={
          isAutoPlaylist
            ? `/playlist/c/${playlistId}/video/${videoId}`
            : `/playlist/${playlistId}/c/video/${videoId}`
        }
      >
        <div className="relative h-24 lg:h-20 xl:h-24 w-40 min-w-[168px] lg:w-32 lg:min-w-[128px] xl:w-40 xl:min-w-[168px] rounded-xl bg-slate-800 overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={video?.snippet?.thumbnails?.high?.url}
          />
        </div>
      </Link>
      <Link
        to={
          isAutoPlaylist
            ? `/playlist/c/${playlistId}/video/${videoId}`
            : `/playlist/${playlistId}/c/video/${videoId}`
        }
      >
        <div className="flex flex-col mx-3 overflow-hidden">
          <span className="text-sm lg:text-xs xl:text-sm font-semibold line-clamp-2 text-black">
            {video?.snippet?.title}
          </span>
          <span className="text-[12px] lg:text-[10px] xl:text-[12px] font-semibold mt-2 text-black/[0.7] flex items-center">
            {video.snippet.channelTitle}
          </span>
          <div className="flex text-[12px] lg:text-[10px] xl:text-[12px] font-semibold text-black/[0.7] truncate overflow-hidden">
            <span>110</span>
            <span className="flex text-[24px] leading-none font-bold text-black/[0.7] relative top-[-10px] mx-1">
              .
            </span>
            <span className="truncate">
              {" "}
              {moment(video.snippet.publishedAt).fromNow()}
            </span>
          </div>
        </div>
      </Link>

      <button className="absolute top-0 right-0" onClick={toggleMenu}>
        <i className="fa-solid fa-ellipsis-vertical"></i>{" "}
      </button>
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-8 right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10"
        >
          {isAutoPlaylist ? (
            <>
              <button
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  handleHiddenFromPlaylist();
                }}
              >
                Ẩn video khỏi danh sách
              </button>
            </>
          ) : (
            <>
              <button
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  handleDeleteFromPlaylist();
                }}
              >
                Xóa khỏi danh sách phát
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlaylistCard;
