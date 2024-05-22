import React, { useState, useEffect, useContext } from "react";
import LeftNav from "../components/LeftNav";
import {
  getPopularMusicVideosAPI,
  getVideoByIdAPI,
} from "../services/videoService";
import { Context } from "../context/contextApi";
import HistoryVideoCard from "../components/card/HistoryVideoCard";
import trending from "../images/trending.png";
import { getHistoryAPI } from "../services/historyService";

const History = () => {
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
      const historyData = await getHistoryAPI();
      if (historyData?.code === 0 && historyData?.data) {
        // Lấy danh sách các video IDs từ mảng history
        const videoIds = historyData.data.map((item) => item.video._id);

        let videosInfo = await Promise.all(
          videoIds.map((videoId) => getVideoByIdAPI(videoId))
        );
        // Tạo mảng mới chỉ chứa thông tin chi tiết của video
        const detailedData = videosInfo.map((info) => info.items[0]);
        console.log(detailedData);
        setData(detailedData);
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

  return (
    <div className="flex flex-row h-[calc(100%-56px)] ">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-pink-50 custom-scrollbar">
        <div className="text-black px-5 py-3 font-bold text-4xl flex items-center justify-center">
          {/* <img className="h-14 w-14" src={trending} alt="Trending" /> */}
          <span className="ml-2">Video đã xem</span>
        </div>
        <div className="grid grid-cols-1 gap-2 p-5">
          {data?.map((item) => {
            return <HistoryVideoCard key={item?.id?.videoId} data={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default History;
