import React, { useState, useEffect, useContext } from "react";
import LeftNav from "../components/LeftNav";
import { getPopularMusicVideosAPI } from "../services/videoService";
import { Context } from "../context/contextApi";
import TrendingVideoCard from "../components/card/TrendingVideoCard";
import trending from "../images/trending.png";

const Trending = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { changeLoading } = useContext(Context);

  useEffect(() => {
    document.getElementById("root").classList.add("custom-h");
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    changeLoading(true);
    try {
      const data = await getPopularMusicVideosAPI();
      if (data && data?.items) {
        setData(data?.items);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
      setData([]);
    }
    changeLoading(false);

    setIsLoading(false);
  };

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
  }, []);

  return (
    <div className="flex flex-row h-[calc(100%-56px)] ">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-pink-50 custom-scrollbar">
        <div className="text-black px-5 py-3 font-bold text-4xl flex items-center justify-center">
          <img className="h-14 w-14"
          src={trending}
          alt="Trending"
          />
         <span className="ml-2">Thịnh hành</span> 
        </div>
        <div className="px-5 text-black flex space-x-5 font-medium">
          <button>Mới nhất</button>
          <button>Âm nhạc</button>
          <button>Trò chơi</button>
          <button>Phim ảnh</button>
        </div>
        <div className="grid grid-cols-1 gap-2 p-5">
          {data?.map((item) => {
            return <TrendingVideoCard key={item?.id?.videoId} data={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Trending;
