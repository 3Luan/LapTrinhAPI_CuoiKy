import React from "react";
import { Link } from "react-router-dom";
import { abbreviateNumber } from "js-abbreviation-number";
import { BsFillCheckCircleFill } from "react-icons/bs";
import moment from "moment";
import "moment/locale/vi";
import { getVideoByIdAPI } from "../../services/videoService";

const TrendingVideoCard = ({ data }) => {
  moment.locale("vi");
  console.log(data.snippet);
  return (
    <Link to={`/video/${data?.id}`}>
      <div className="flex flex-col md:flex-row mb-8 md:mb-3 lg:hover:bg-white/[0.1] rounded-xl md:p-4">
        <div className="relative flex shrink-0 h-48 md:h-28 lg:h-40 xl:h-48 w-full md:w-48 lg:w-64 xl:w-80 rounded-xl bg-slate-800 overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={data?.snippet?.thumbnails?.high?.url}
          />
        </div>
        <div className="flex flex-col ml-4 md:ml-6 mt-4 md:mt-0 overflow-hidden">
          <span className="text-lg md:text-xl font-semibold line-clamp-2 text-black ">
            {data?.snippet?.title}
          </span>
          <span className="empty:hidden text-sm line-clamp-1 md:line-clamp-2 text-black/[0.7] md:pr-24 md:my-4">
            {data?.descriptionSnippet}
          </span>
          <div className="hidden md:flex items-center">
            <div className="flex items-start mr-3">
              <div className="flex h-9 w-9 rounded-full overflow-hidden">
                <img
                  className="h-full w-full object-cover"
                  src={data?.snippet?.thumbnails?.high?.url}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold mt-2 text-black/[0.7] flex items-center">
                {data?.snippet?.channelTitle}
                {/* {data?.author?.badges[0]?.type === "VERIFIED_CHANNEL" && (
                  <BsFillCheckCircleFill className="text-white/[0.5] text-[12px] lg:text-[10px] xl:text-[12px] ml-1" />
                )} */}
              </span>
              <div className="flex text-sm font-semibold text-black/[0.7] truncate overflow-hidden">
                {`${abbreviateNumber(
                  data?.statistics?.viewCount,
                  2
                )} lượt xem `}
                <span className="flex text-[24px] leading-none font-bold text-black/[0.7] relative top-[-10px] mx-1">
                  .
                </span>
                <span className="truncate">
                  {moment(data?.snippet?.publishedAt).fromNow()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TrendingVideoCard;
