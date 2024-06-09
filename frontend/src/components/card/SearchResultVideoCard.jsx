import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { abbreviateNumber } from "js-abbreviation-number";
import { BsFillCheckCircleFill } from "react-icons/bs";
import moment from "moment";
import "moment/locale/vi";
import toast from "react-hot-toast";
import AddPlaylistModal from "../modals/AddPlaylistModal";

const SearchResultVideoCard = ({ video }) => {
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
    <div className="relative flex flex-col md:flex-row mb-8 md:mb-3 lg:hover:bg-white/[0.1] rounded-xl md:p-4">
      <Link to={`/video/${video?.id?.videoId}`} className="flex">
        <div className="relative flex shrink-0 h-48 md:h-28 lg:h-40 xl:h-48 w-full md:w-48 lg:w-64 xl:w-80 rounded-xl bg-slate-800 overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={video?.snippet?.thumbnails?.high?.url}
            alt="video thumbnail"
          />
        </div>
        <div className="flex flex-col ml-4 md:ml-6 mt-4 md:mt-0 overflow-hidden">
          <span className="text-lg md:text-2xl font-semibold line-clamp-2 text-black">
            {video?.snippet?.title}
          </span>
          <span className="empty:hidden text-sm line-clamp-1 md:line-clamp-2 text-black/[0.7] md:pr-24 md:my-4">
            {video?.descriptionSnippet}
          </span>
          <div className="hidden md:flex items-center">
            <div className="flex items-start mr-3">
              <div className="flex h-9 w-9 rounded-full overflow-hidden">
                <img
                  className="h-full w-full object-cover"
                  src={video?.snippet?.thumbnails?.high?.url}
                  alt="channel thumbnail"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold mt-2 text-black/[0.7] flex items-center">
                {video?.snippet?.channelTitle}
                {/* {video?.author?.badges[0]?.type === "VERIFIED_CHANNEL" && (
                  <BsFillCheckCircleFill className="text-white/[0.5] text-[12px] lg:text-[10px] xl:text-[12px] ml-1" />
                )} */}
              </span>
              <div className="flex text-sm font-semibold text-black/[0.7] truncate overflow-hidden">
                <span>
                  {/* {abbreviateNumber(video.statistics.viewCount)} views */}
                </span>
                <span className="flex text-[24px] leading-none font-bold text-black/[0.7] relative top-[-10px] mx-1">
                  .
                </span>
                <span className="truncate">
                  {moment(video?.snippet?.publishedAt).fromNow()}
                </span>
              </div>
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

export default SearchResultVideoCard;
