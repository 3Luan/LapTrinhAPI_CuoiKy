import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { abbreviateNumber } from "js-abbreviation-number";

import SuggestionVideoCard from "../components/card/SuggestionVideoCard";
import {
  getRelatedVideosAPI,
  getVideoVideoDetailsAPI,
} from "../services/videoService";
import LeftNav from "../components/LeftNav";
import { Context } from "../context/contextApi";

const VideoDetails = () => {
  const [video, setVideo] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const { id } = useParams();
  const [isLoadingVideo, setLoadingVideo] = useState(false);
  const [isLoadingrelatedVideos, setLoadingrelatedVideos] = useState(false);
  const { changeLoading } = useContext(Context); // Thêm useContext để sử dụng Context

  useEffect(() => {
    fetchVideoDetails();
  }, [id]);
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

    if (id) {
      try {
        const data = await getVideoVideoDetailsAPI(id);
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

  // const fetchRelatedVideos = async () => {
  //   setLoadingrelatedVideos(true);
  //   if (id) {
  //     try {
  //       const data = await getRelatedVideosAPI(id);
  //       if (data && data?.errorId === "Success") {
  //         setRelatedVideos(data?.items);
  //       } else {
  //         setRelatedVideos([]);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       setRelatedVideos([]);
  //     }
  //   }
  //   setLoadingrelatedVideos(false);
  // };

  const fetchRelatedVideos = async () => {
    setLoadingrelatedVideos(true);
    if (video?.snippet?.title) {
      try {
        const data = await getRelatedVideosAPI(video?.snippet?.title);
        console.log(data);
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
    setLoadingrelatedVideos(false);
  };

  return (
    <div className="flex justify-center flex-row h-[calc(100%-56px)] bg-black">
      {/* <div className="flex flex-row h-[calc(100%-56px)] bg-black"> */}
      {/* <LeftNav /> */}

      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row">
        <div className="flex flex-col lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] px-4 py-3 lg:py-6 overflow-y-auto">
          {!isLoadingVideo && (
            <>
              <div className="h-[200px] md:h-[400px] lg:h-[400px] xl:h-[550px] ml-[-16px] lg:ml-0 mr-[-16px] lg:mr-0">
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${id}`}
                  controls
                  width="100%"
                  // height="100%"
                  style={{ backgroundColor: "#000000" }}
                  playing={true}
                />
              </div>
              <div className="text-white font-bold text-sm md:text-xl mt-4 line-clamp-2 pb-8">
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
                    <div className="text-white text-md font-semibold flex items-center">
                      {video?.snippet?.channelTitle}
                      {video?.author?.badges[0]?.type ===
                        "VERIFIED_CHANNEL" && (
                        <BsFillCheckCircleFill className="text-white/[0.5] text-[12px] ml-1" />
                      )}
                    </div>
                    <div className="text-white/[0.7] text-sm">
                      {video?.author?.stats?.subscribersText}
                    </div>
                  </div>
                </div>
                <div className="flex text-white mt-4 md:mt-0">
                  <div className="flex items-center justify-center h-11 px-6 rounded-3xl bg-white/[0.15]">
                    <AiOutlineLike className="text-xl text-white mr-2" />
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

              <div className="flex justify-between flex-col md:flex-row mt-4 text-white">
                <h5>
                  {video?.snippet?.description?.length > 50
                    ? video?.snippet?.description?.substring(0, 200) + "..."
                    : video?.snippet?.description}
                </h5>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col py-6 px-4 overflow-y-auto lg:w-[350px] xl:w-[400px] custom-scrollbar">
          {!isLoadingrelatedVideos && (
            <>
              {relatedVideos?.map((item, index) => {
                // if (item?.type !== "video") return false;
                return <SuggestionVideoCard key={index} video={item} />;
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
