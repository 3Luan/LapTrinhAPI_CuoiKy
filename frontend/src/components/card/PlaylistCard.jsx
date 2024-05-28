import React from "react";
import { abbreviateNumber } from "js-abbreviation-number";
import { Link } from "react-router-dom";
import { BsFillCheckCircleFill } from "react-icons/bs";
import moment from "moment";
import "moment/locale/vi";

const PlaylistCard = ({ playlistId, data }) => {
  moment.locale("vi");
  return (
    <Link to={`/playlist/${data?.id}/c/video/${data?.firstVideoId}`}>
      <div className="flex flex-col md:flex-row mb-8 md:mb-3 lg:hover:bg-white/[0.1] rounded-xl md:p-4">
        <div className="relative flex shrink-0 h-48 md:h-28 lg:h-40 xl:h-48 w-full md:w-48 lg:w-64 xl:w-80 rounded-xl bg-slate-800 overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={data?.snippet?.thumbnails?.high?.url}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-200">
            <span class="text-white flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                  clip-rule="evenodd"
                />
              </svg>
              Phát tất cả
            </span>{" "}
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
                Cập nhật: {moment(data.snippet.publishedAt).fromNow()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaylistCard;
