import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import toast from "react-hot-toast";
import AddPlaylistModal from "../modals/AddPlaylistModal";

const SuggestionVideoCard = ({ video }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const [openModal, setOpenModal] = useState(false);

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

  const handleSaveToPlaylist = () => {
    setOpenModal(true);
    toggleMenu();
  };

  moment.locale("vi");

  return (
    <div className="relative flex mb-3">
      <Link to={`/video/${video?.id?.videoId}`}>
        <div className="relative h-24 lg:h-20 xl:h-24 w-40 min-w-[168px] lg:w-32 lg:min-w-[128px] xl:w-40 xl:min-w-[168px] rounded-xl bg-slate-800 overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={video?.snippet?.thumbnails?.high?.url}
            alt="video thumbnail"
          />
        </div>
      </Link>
      <div className="flex flex-col mx-3 overflow-hidden">
        <Link to={`/video/${video?.id?.videoId}`}>
          <span className="text-sm lg:text-xs xl:text-sm font-bold line-clamp-2 text-black">
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
              {moment(video.snippet.publishedAt).fromNow()}
              
            </span>
          </div>
        </Link>
      </div>
      <button className="absolute top-0 right-0" onClick={toggleMenu}>
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </button>
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-8 right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10"
        >
          <button
            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleSaveToPlaylist()}
          >
            Lưu vào danh sách phát
          </button>
        </div>
      )}

      {openModal && (
        <AddPlaylistModal
          videoId={video?.id?.videoId}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
};

export default SuggestionVideoCard;
