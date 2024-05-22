
import React, { useState, useEffect, useContext } from "react";
import LeftNav from "../components/LeftNav";
import { getPopularMusicVideosAPI, getPopularGameVideosAPI, getPopularSportVideosAPI } from "../services/videoService";
import { Context } from "../context/contextApi";
import TrendingVideoCard from "../components/card/TrendingVideoCard";
import trending from "../images/trending.png";

const Trending = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { changeLoading } = useContext(Context);
  const [selectedCategory, setSelectedCategory] = useState("music");

  useEffect(() => {
    document.getElementById("root").classList.add("custom-h");
    getData(selectedCategory); // Load default category on mount
  }, []);

  useEffect(() => {
    return () => {
      document.getElementById("root").classList.remove("custom-h");
    };
  }, []);

  const getData = async (category) => {
    setIsLoading(true);
    changeLoading(true);
    try {
      let response;
      if (category === "music") {
        response = await getPopularMusicVideosAPI();
      } else if (category === "games") {
        response = await getPopularGameVideosAPI();
      } else if (category === "sport") {
        response = await getPopularSportVideosAPI();
      }
      if (response && response.items) {
        setData(response.items);
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    getData(category);
  };

  return (
    <div className="flex flex-row h-[calc(100%-56px)] ">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-pink-50 custom-scrollbar">
        <div className="text-black px-5 py-3 font-bold text-4xl flex items-center justify-center">
          <img className="h-14 w-14" src={trending} alt="Trending" />
          <span className="ml-2">Thịnh hành</span>
        </div>
        <div className="px-5 text-black flex space-x-5 font-medium">
          <button 
            onClick={() => handleCategoryChange("music")}
            className={`border-b-2 ${selectedCategory === "music" ? "border-black" : "border-gray-400"} hover:border-black`}>
            Âm nhạc
          </button>
          <button 
            onClick={() => handleCategoryChange("games")}
            className={`border-b-2 ${selectedCategory === "games" ? "border-black" : "border-gray-400"} hover:border-black`}>
            Trò chơi
          </button>
          <button 
            onClick={() => handleCategoryChange("sport")}
            className={`border-b-2 ${selectedCategory === "sport" ? "border-black" : "border-gray-400"} hover:border-black`}>
            Thể thao
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2 p-5">
          {data.map((item) => (
            <TrendingVideoCard key={item.id.videoId} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trending;
