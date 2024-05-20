import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { abbreviateNumber } from "js-abbreviation-number";

import SuggestionVideoCard from "../components/card/VideoPlaylistCard";
import {
  getRelatedVideosAPI,
  getVideoVideoDetailsAPI,
} from "../services/videoService";
import { Context } from "../context/contextApi";
import {
  getPlaylistIdAPI,
  getPlaylistVideosAPI,
} from "../services/playlistService";
import VideoPlaylistCard from "../components/card/VideoPlaylistCard";

const VideoPlaylistDetails = () => {
  const [video, setVideo] = useState([]);
  const [videoInPlaylist, setVideoInPlaylist] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const { playlistId, videoId } = useParams();
  const [isLoadingVideo, setLoadingVideo] = useState(false);
  const [isLoadingRelatedVideos, setLoadingRelatedVideos] = useState(false);
  const [isLoadingPlaylistVideos, setLoadingPlaylistVideos] = useState(false);
  const { changeLoading } = useContext(Context);

  useEffect(() => {
    fetchVideoDetails();
  }, [videoId]);

  useEffect(() => {
    fetchPlaylistVideos();
  }, [playlistId]);

  useEffect(() => {
    if (video?.snippet?.title) {
      fetchRelatedVideos();
    }
  }, [video?.snippet?.title]);

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
  }, []);

  const fetchVideoDetails = async () => {
    setLoadingVideo(true);
    changeLoading(true);

    if (videoId) {
      try {
        const data = await getVideoVideoDetailsAPI(videoId);
        if (data && data?.items[0]) {
          setVideo(data?.items[0]);
        } else {
          setVideo([]);
        }
      } catch (error) {
        console.log(error);
        setVideo([]);
      }
    }
    changeLoading(false);
    setLoadingVideo(false);
  };

  const fetchRelatedVideos = async () => {
    setLoadingRelatedVideos(true);
    if (video?.snippet?.title) {
      try {
        const data = await getRelatedVideosAPI(video?.snippet?.title);
        if (data && data?.items) {
          setRelatedVideos(data?.items);
        } else {
          setRelatedVideos([]);
        }
      } catch (error) {
        console.log(error);
        setRelatedVideos([]);
      }
    }
    setLoadingRelatedVideos(false);
  };

  const fetchPlaylistVideos = async () => {
    setLoadingPlaylistVideos(true);
    try {
      const data = await getPlaylistVideosAPI(playlistId);
      if (data?.code === 0) {
        setVideoInPlaylist(data?.data);
      } else {
        setVideoInPlaylist([]);
      }
    } catch (error) {
      console.log(error);
      setVideoInPlaylist([]);
    }
    setLoadingPlaylistVideos(false);
  };

  console.log("relatedVideos", videoInPlaylist);

  return (
    <div className="flex justify-center flex-row h-[calc(100%-56px)] bg-pink-50">
      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row">
        <div className="flex flex-col lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] px-4 py-3 lg:py-6 overflow-y-auto">
          {!isLoadingVideo && (
            <>
              <div className="h-[200px] md:h-[400px] lg:h-[400px] xl:h-[550px] ml-[-16px] lg:ml-0 mr-[-16px] lg:mr-0">
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${videoId}`}
                  controls
                  width="100%"
                  style={{ backgroundColor: "#000000" }}
                  playing={true}
                />
              </div>
              <div className="text-black font-bold text-sm md:text-xl mt-4 line-clamp-2 pb-8">
                {video?.snippet?.title}
              </div>
              <div className="flex justify-between flex-col md:flex-row mt-4">
                <div className="flex">
                  <div className="flex items-start">
                    <div className="flex h-11 w-11 rounded-full overflow-hidden">
                      <img
                        className="h-full w-full object-cover"
                        src={video?.snippet?.thumbnails?.high?.url}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col ml-3">
                    <div className="text-black text-md font-semibold flex items-center">
                      {video?.snippet?.channelTitle}
                      {video?.author?.badges[0]?.type ===
                        "VERIFIED_CHANNEL" && (
                        <BsFillCheckCircleFill className="text-black/[0.5] text-[12px] ml-1" />
                      )}
                    </div>
                    <div className="text-black/[0.7] text-sm">
                      {video?.author?.stats?.subscribersText}
                    </div>
                  </div>
                </div>
                <div className="flex text-black mt-4 md:mt-0">
                  <div className="flex items-center justify-center h-11 px-6 rounded-3xl bg-white/[0.15]">
                    <AiOutlineLike className="text-xl text-black mr-2" />
                    {`${abbreviateNumber(
                      video?.statistics?.likeCount,
                      2
                    )} Likes`}
                  </div>
                  <div className="flex items-center justify-center h-11 px-6 rounded-3xl bg-white/[0.15] ml-4">
                    {`${abbreviateNumber(
                      video?.statistics?.viewCount,
                      2
                    )} Views`}
                  </div>
                </div>
              </div>

              <div className="flex justify-between flex-col md:flex-row mt-4 text-black">
                <h5>
                  {video?.snippet?.description?.length > 50
                    ? video?.snippet?.description?.substring(0, 200) + "..."
                    : video?.snippet?.description}
                </h5>
              </div>
            </>
          )}
        </div>
        <div className="pt-6 px-4 overflow-y-auto lg:w-[350px] xl:w-[400px] custom-scrollbar">
          <div className="">
            <h3 className="text-lg font-bold pb-2 bg-black  rounded-t-lg pt-2 text-center text-white">
              Danh sách phát
            </h3>

            <div className=" max-h-80 overflow-y-auto border-gray-500 border p-2 rounded-b-lg">
              {!isLoadingPlaylistVideos && videoInPlaylist.length > 0 && (
                <div>
                  {videoInPlaylist.map((item, index) => (
                    <VideoPlaylistCard
                      key={index}
                      video={item}
                      playlistId={playlistId}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Video liên quan</h3>
            {!isLoadingRelatedVideos && relatedVideos.length > 0 && (
              <div>
                {relatedVideos.map((item, index) => (
                  <SuggestionVideoCard key={index} video={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlaylistDetails;
