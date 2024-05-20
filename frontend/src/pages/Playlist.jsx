import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/contextApi";
import LeftNav from "../components/LeftNav";
import { getPlaylistIdAPI } from "../services/playlistService";
import { useSelector } from "react-redux";
import PlaylistCard from "../components/card/PlaylistCard";

const Playlist = () => {
  const { changeLoading } = useContext(Context); // Thêm useContext để sử dụng Context
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && auth?.auth) getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    changeLoading(true);
    try {
      const data = await getPlaylistIdAPI(auth?.accessToken);
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
    setIsLoading(false);
  };

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
  }, []);

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-pink-50 custom-scrollbar">
        <div className="text-black px-5 py-3 font-bold text-2xl">
          Danh sách phát
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
          {!isLoading &&
            data.map((item) => {
              return <PlaylistCard key={item?.id} data={item} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
