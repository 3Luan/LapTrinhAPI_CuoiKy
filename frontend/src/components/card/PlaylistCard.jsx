import React from "react";
import { abbreviateNumber } from "js-abbreviation-number";
import { Link } from "react-router-dom";
import { BsFillCheckCircleFill } from "react-icons/bs";
import moment from "moment";
import "moment/locale/vi";

const PlaylistCard = ({ data }) => {
  moment.locale("vi");
  return (
    // <Link to={""}>
    //   <div className="flex flex-col mb-8">
    //     <div className="relative h-48 md:h-40 md:rounded-xl overflow-hidden">
    //       <img
    //         className="h-full w-full object-cover"
    //         src={data?.snippet?.thumbnails?.high?.url}
    //       />
    //     </div>
    //     <div className="flex text-black mt-2">
    //       <div className="flex flex-col overflow-hidden">
    //         <span className="text-sm font-bold line-clamp-2">
    //           {data?.snippet?.title}
    //         </span>
    //         <span className="text-[12px] font-semibold mt-1 text-black/[0.7] flex items-center">
    //           {data?.snippet?.channelTitle} • Danh sách phát •{" "}
    //           {data?.contentDetails?.itemCount} video
    //         </span>
    //         <div className="flex text-[12px] font-semibold text-black/[0.7] truncate overflow-hidden">
    //           <span className="truncate">
    //             Cập nhật: {moment(data.snippet.publishedAt).fromNow()}
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </Link>
    <Link to={``}>
    <div className="flex flex-col md:flex-row mb-8 md:mb-3 lg:hover:bg-white/[0.1] rounded-xl md:p-4">
      <div className="relative flex shrink-0 h-48 md:h-28 lg:h-40 xl:h-48 w-full md:w-48 lg:w-64 xl:w-80 rounded-xl bg-slate-800 overflow-hidden">
        <img
          className="h-full w-full object-cover"
          src={data?.snippet?.thumbnails?.high?.url}
        />
      </div>
      <div className="flex text-black mt-2">
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold line-clamp-2">
              {data?.snippet?.title}
            </span>
            <span className="text-[12px] font-semibold mt-1 text-black/[0.7] flex items-center">
              {data?.snippet?.channelTitle} • Danh sách phát •{" "}
              {data?.contentDetails?.itemCount} video
            </span>
            <div className="flex text-[12px] font-semibold text-black/[0.7] truncate overflow-hidden">
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
