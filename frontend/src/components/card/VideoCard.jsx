import React, { useState, useRef, useEffect } from "react";
import { abbreviateNumber } from "js-abbreviation-number";
import { Link } from "react-router-dom";
import { BsFillCheckCircleFill } from "react-icons/bs";
import moment from "moment";
import "moment/locale/vi";
import { usePopper } from "react-popper";
import LargeImageModal from "../modals/LargeImageModal";
import AddPlaylistModal from "../modals/AddPlaylistModal";
import { useSelector } from "react-redux";

const VideoCard = ({ video }) => {
  moment.locale("vi");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const [openModal, setOpenModal] = useState(false);
  const auth = useSelector((state) => state.auth);

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

  return (
    <div className="flex flex-col mb-8">
      <Link to={`/video/${video?.id}`}>
        <div className="relative h-55 md:h-40 md:rounded-xl overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={video?.snippet?.thumbnails?.high?.url}
          />
          {/* {video?.lengthSeconds && <VideoLength time={video?.lengthSeconds} />} */}
        </div>
      </Link>
      <div className="flex text-black mt-3">
        <div className="flex items-start">
          <div className="flex h-9 w-9 rounded-full overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src={video?.snippet?.thumbnails?.high?.url}
            />
          </div>
        </div>
        <Link to={`/video/${video?.id}`}>
          <div className="flex flex-col ml-3 overflow-hidden">
            <span className="text-sm font-bold line-clamp-2">
              {video?.snippet?.title}
            </span>
            <span className="text-[12px] font-semibold mt-2 text-black/[0.7] flex items-center">
              {video.snippet.channelTitle}
            </span>
            <div className="flex text-[12px] font-semibold text-black/[0.7] truncate overflow-hidden">
              {/* <span>{`${abbreviateNumber(video?.stats?.views, 2)} views`}</span> */}
              {`${abbreviateNumber(video?.statistics?.viewCount, 2)} lượt xem `}
              <span className="flex text-[24px] leading-none font-bold text-black/[0.7] relative top-[-10px] mx-1">
                .
              </span>
              <span className="truncate">
                {moment(video.snippet.publishedAt).fromNow()}
              </span>
            </div>
          </div>
        </Link>
        <div className="relative ml-auto">
          {auth?.auth && (
            <button onClick={toggleMenu} className="ml-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          )}

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute top-8 right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10"
            >
              <button
                onClick={handleSaveToPlaylist}
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                Lưu vào danh sách phát
              </button>
            </div>
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

export default VideoCard;
