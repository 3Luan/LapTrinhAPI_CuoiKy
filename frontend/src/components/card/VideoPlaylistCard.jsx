import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";

const VideoPlaylistCard = ({ playlistId, videoId, video, isAutoPlaylist }) => {
  console.log("video", video);
  moment.locale("vi");
  return (
    <Link
      to={
        isAutoPlaylist
          ? `/playlist/c/${playlistId}/video/${videoId}`
          : `/playlist/${playlistId}/c/video/${videoId}`
      }
    >
      <div className="flex mb-3">
        <div className="relative h-24 lg:h-20 xl:h-24 w-40 min-w-[168px] lg:w-32 lg:min-w-[128px] xl:w-40 xl:min-w-[168px] rounded-xl bg-slate-800 overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={video?.snippet?.thumbnails?.high?.url}
          />
        </div>
        <div className="flex flex-col ml-3 overflow-hidden">
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
              {" "}
              {moment(video.snippet.publishedAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoPlaylistCard;
