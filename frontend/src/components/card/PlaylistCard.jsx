import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import { deletePlaylistAPI } from "../../services/playlistService";
import toast from "react-hot-toast";

const PlaylistCard = ({ data, onDeleteSuccess }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

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

  const handleDeletePlaylist = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (confirmed) {
      setIsLoadingDelete(true);
      try {
        const dataDelete = await deletePlaylistAPI(data?.id);
        if (dataDelete?.code === 0) {
          toast.success("Xóa danh sách phát thành công");
          onDeleteSuccess(data.id); // Notify the parent component
        } else {
          toast.error(dataDelete?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Lỗi khi xóa danh sách phát");
      }
      setIsLoadingDelete(false);
      toggleMenu();
    }
  };

  moment.locale("vi");

  return (
    <div className="relative flex flex-col md:flex-row mb-8 md:mb-3 lg:hover:bg-white/[0.1] rounded-xl md:p-4">
      <Link
        to={`/playlist/${data?.id}/c/video/${data?.firstVideoId}`}
        className="flex"
      >
        <div className="relative flex shrink-0 h-48 md:h-28 lg:h-40 xl:h-48 w-full md:w-48 lg:w-64 xl:w-80 rounded-xl bg-slate-800 overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={data?.snippet?.thumbnails?.high?.url}
            alt="playlist thumbnail"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-200">
            <span className="text-white flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                  clipRule="evenodd"
                />
              </svg>
              Phát tất cả
            </span>
          </div>
        </div>
        <div className="flex text-black mt-2 ml-3">
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold line-clamp-2 text-lg">
              {data?.snippet?.title}
            </span>
            <span className="text-[16px] font-semibold mt-1 text-black/[0.7] flex items-center">
              {data?.snippet?.channelTitle} • Danh sách phát •{" "}
              {data?.contentDetails?.itemCount} video
            </span>
            <div className="flex text-[16px] font-semibold text-black/[0.7] truncate overflow-hidden">
              <span className="truncate">
                Cập nhật: {moment(data?.snippet?.publishedAt).fromNow()}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <button
        className="absolute top-0 right-0 md:top-4 md:right-4"
        onClick={toggleMenu}
      >
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </button>
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-8 right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10"
        >
          <button
            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleDeletePlaylist}
          >
            Xóa danh sách phát
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaylistCard;
