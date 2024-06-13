import React, { useContext, useEffect, useState } from "react";

import { Context } from "../context/contextApi";
import LeftNav from "../components/LeftNav";
import VideoCard from "../components/card/VideoCard";
import { getVideoByIdAPI, popularVideosAPI } from "../services/videoService";
import { getAutoPlaylistAPI } from "../services/playlistService";
import MixedPlaylistCard from "../components/card/MixedPlaylistCard";

const Home = () => {
  const { changeLoading } = useContext(Context); // Thêm useContext để sử dụng Context
  const [videos, setVideos] = useState([]);
  const [videoPlaylist, setVideoPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    changeLoading(true);
    try {
      const data = await popularVideosAPI();

      if (data && data?.items) {
        setVideos(data?.items);
      } else {
        setVideos([]);
      }

      const playlistData = await getAutoPlaylistAPI();
      if (playlistData?.code === 0) {
        // let videosInfo = await Promise.all(
        //   playlistData?.data?.map((item) => getVideoByIdAPI(item?.videoId))
        // );
        // // // Tạo mảng mới chỉ chứa thông tin chi tiết của video
        // const detailedData = videosInfo.map((info) => info.items[0]);

        // const data = playlistData?.data.map((item, index) => ({
        //   playlistId: item.playlistId,
        //   video: detailedData[index],
        // }));

        // // Đảo ngược thứ tự của mảng data
        // const reversedData = data.reverse();

        // setVideoPlaylist(reversedData);

        let videosInfo = await Promise.all(
          playlistData?.data?.map((item) => getVideoByIdAPI(item?.videoId))
        );

        // Tạo mảng mới chỉ chứa thông tin chi tiết của video
        const detailedData = videosInfo.map((info) => info.items[0]);

        const data = playlistData?.data.map((item, index) => ({
          playlistId: item.playlistId,
          updatedAt: item.updatedAt,
          video: detailedData[index],
        }));

        // Sắp xếp mảng data theo updatedAt
        data.sort((a, b) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        setVideoPlaylist(data);
      } else {
        setVideoPlaylist([]);
      }
    } catch (error) {
      console.log(error);
      setVideos([]);
      setVideoPlaylist([]);
    }

    changeLoading(false);
    setIsLoading(false);
  };

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
  }, []);

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-pink-50 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
          {!isLoading && (
            <>
              {videoPlaylist.slice(0, 6).map((item) => {
                // if (item.type !== "video") return false;
                return <MixedPlaylistCard key={item?.id} data={item} />;
              })}

              {videos.map((item) => {
                // if (item.type !== "video") return false;
                return <VideoCard key={item?.id} video={item} />;
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
