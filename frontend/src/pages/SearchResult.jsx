import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import LeftNav from "../components/LeftNav";
import SearchResultVideoCard from "../components/card/SearchResultVideoCard";
import { searchVideosAPI } from "../services/videoService";
import { Context } from "../context/contextApi";

const SearchResult = () => {
  const { searchQuery } = useParams();
  const [video, setVideo] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { changeLoading } = useContext(Context); // Thêm useContext để sử dụng Context

  useEffect(() => {
    document.getElementById("root").classList.add("custom-h");
    getData();
  }, [searchQuery]);

  const getData = async () => {
    setLoading(true);
    changeLoading(true);

    if (searchQuery) {
      try {
        const data = await searchVideosAPI(searchQuery);
        console.log(data);
        if (data && data?.items) {
          setVideo(data?.items);
        } else {
          setVideo([]);
        }
      } catch (error) {
        console.log(error);
        setVideo([]);
      }
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
        <div className="grid grid-cols-1 gap-2 p-5">
          {video?.map((item) => {
            return (
              <SearchResultVideoCard key={item?.id?.videoId} video={item} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
