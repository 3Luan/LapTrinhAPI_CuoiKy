import React, { useContext, useEffect, useState } from "react";

import { Context } from "../context/contextApi";
import LeftNav from "./LeftNav";
import VideoCard from "./VideoCard";
import { popularVideosAPI } from "../services/videoService";

const Feed = () => {
  const { changeLoading } = useContext(Context); // Thêm useContext để sử dụng Context
  const [videos, setVideos] = useState([]);
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
    } catch (error) {
      console.log(error);
      setVideos([]);
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
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
          {!isLoading &&
            videos.map((item) => {
              //   if (item.type !== "video") return false;
              return <VideoCard key={item?.id} video={item} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default Feed;
