import React from "react";
import { abbreviateNumber } from "js-abbreviation-number";
import { Link } from "react-router-dom";
import { BsFillCheckCircleFill } from "react-icons/bs";
import moment from "moment";
import "moment/locale/vi";
import VideoLength from "../shared/videoLength";

const VideoCard = ({ video }) => {
  console.log("dataa", video);
  moment.locale("vi");

  return (
    <Link to={`/video/${video?.id}`}>
      <div className="flex flex-col mb-8">
        <div className="relative h-48 md:h-40 md:rounded-xl overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={video?.snippet?.thumbnails?.high?.url}
          />
          {/* {video?.lengthSeconds && <VideoLength time={video?.lengthSeconds} />} */}
        </div>
        <div className="flex text-white mt-3">
          <div className="flex items-start">
            <div className="flex h-9 w-9 rounded-full overflow-hidden">
              <img
                className="h-full w-full object-cover"
                src={video?.snippet?.thumbnails?.high?.url}
              />
            </div>
          </div>
          <div className="flex flex-col ml-3 overflow-hidden">
            <span className="text-sm font-bold line-clamp-2">
              {video?.snippet?.title}
            </span>
            <span className="text-[12px] font-semibold mt-2 text-white/[0.7] flex items-center">
              {video.snippet.channelTitle}
            </span>
            <div className="flex text-[12px] font-semibold text-white/[0.7] truncate overflow-hidden">
              {/* <span>{`${abbreviateNumber(video?.stats?.views, 2)} views`}</span> */}
              <span>110 lượt xem</span>
              <span className="flex text-[24px] leading-none font-bold text-white/[0.7] relative top-[-10px] mx-1">
                .
              </span>
              <span className="truncate">
                {moment(video.snippet.publishedAt).fromNow()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
