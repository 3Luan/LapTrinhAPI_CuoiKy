import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import LeftNav from "../components/LeftNav";
import LikedVideoCard from "../components/card/LikedVideoCard";
import { searchVideosAPI } from "../services/videoService";
import { Context } from "../context/contextApi";
import { getLikedVideosAPI } from "../services/likeVideoService";
import PostCard from "../components/card/PostCard";

const Community = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { changeLoading } = useContext(Context);

  useEffect(() => {
    document.getElementById("root").classList.add("custom-h");
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    changeLoading(true);

    try {
      const data = await getLikedVideosAPI();
      console.log(data);
      if (data?.code === 0) {
        setData(data?.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
      setData([]);
    }

    changeLoading(false);
    setLoading(false);
  };

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
  }, []);

  return (
    <div className="flex flex-row h-[calc(100%-56px)] ">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black custom-scrollbar">
        <div className="text-white px-5 py-3 font-bold text-2xl text-center">
          Cộng đồng
        </div>
        <div className="grid grid-cols-1 gap-2 p-5">
          {data?.map((item) => {
            return <PostCard key={item?.id?.videoId} data={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Community;
