import React from "react";
import { abbreviateNumber } from "js-abbreviation-number";
import { Link } from "react-router-dom";
import { BsFillCheckCircleFill } from "react-icons/bs";
import moment from "moment";
import "moment/locale/vi";

const MixedPlaylistCard = ({ data }) => {
  moment.locale("vi");

  return (
    <Link to={`/playlist/c/${data?.playlistId}/video/${data?.video?.id}`}>
      <div class="flex flex-col mb-8">
        <div class="relative h-48 md:h-40 md:rounded-xl overflow-hidden">
          <img
            class="h-full w-full object-cover"
            src={data?.video?.snippet?.thumbnails?.high?.url}
          />
          <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-200">
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
            </span>
          </div>
        </div>

        <div class="flex text-black mt-3">
          <div class="flex flex-col ml-3 overflow-hidden">
            <span class="text-sm font-bold line-clamp-2">
              Danh sách kết hợp - {data?.video?.snippet?.title}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MixedPlaylistCard;
