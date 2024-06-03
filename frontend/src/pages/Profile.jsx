import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import LeftNav from "../components/LeftNav";
import { Context } from "../context/contextApi";
import { getLikedVideosAPI } from "../services/likeVideoService";
import PostCard from "../components/card/PostCard";
import { useDispatch, useSelector } from "react-redux";
import { getPostsByUserIdAPI } from "../services/postService";
import { getAutoPlaylistAPI } from "../services/playlistService";
import MixedPlaylistCard from "../components/card/MixedPlaylistCard";
import { getVideoByIdAPI } from "../services/videoService";

const Profile = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { changeLoading } = useContext(Context);
  const auth = useSelector((state) => state.auth);
  const [tab, setTab] = useState("posts");

  useEffect(() => {
    getData("posts");
  }, []);

  const getData = async (nameTab) => {
    setLoading(true);
    changeLoading(true);

    try {
      if (nameTab === "posts") {
        const data = await getPostsByUserIdAPI(auth?.id, 1);
        if (data?.code === 0) {
          setData(data?.data);
        } else {
          setData([]);
        }
      } else {
        const data = await getAutoPlaylistAPI();

        if (data?.code === 0) {
          let videosInfo = await Promise.all(
            data?.data?.map((item) => getVideoByIdAPI(item?.videoId))
          );
          // // Tạo mảng mới chỉ chứa thông tin chi tiết của video
          const detailedData = videosInfo.map((info) => info.items[0]);

          const playlist = data?.data.map((item, index) => ({
            playlistId: item.playlistId,
            video: detailedData[index],
          }));

          // Đảo ngược thứ tự của mảng data
          const reversedData = playlist.reverse();

          setData(reversedData);
          console.log("reversedData", reversedData);
        } else {
          setData([]);
        }
      }
    } catch (error) {
      console.log(error);
      setData([]);
    }

    changeLoading(false);
    setLoading(false);
  };

  const onclickChangeTab = (nameTab) => {
    if (tab !== nameTab) {
      setTab(nameTab);
      getData(nameTab);
    }
  };

  return (
    <div className="flex flex-row h-[calc(100%-56px)] ">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-pink-50 custom-scrollbar">
        <section class="w-full overflow-hidden min-h-full">
          <div class="flex flex-col">
            <img
              src={
                auth?.coverAvatar === ""
                  ? "https://yt3.googleusercontent.com/KbPMUbosgKFr-A5ihp_5n39G-XJnOY3Un6CnAxfqLpWh6Lh0pm_1SXc-uwCAk2DgO1-PG8lO"
                  : auth?.coverAvatar
              }
              alt="User Cover"
              class="rounded-md w-full h-[12rem] xl:h-[12rem] lg:h-[10rem] md:h-[8rem] sm:h-[6rem] xs:h-[4rem] object-cover"
            />

            <div class="sm:w-[80%] xs:w-[90%] mx-auto flex">
              <img
                src={auth?.avatar}
                alt="User Profile"
                class="rounded-full lg:w-[10rem] lg:h-[10rem] md:w-[8rem] md:h-[8rem] sm:w-[6rem] sm:h-[6rem] xs:w-[5rem] xs:h-[5rem]    relative lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]"
              />

              <div class="w-full text-left sm:mx-4 xs:pl-4 text-gray-800 lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl">
                <div className="font-bold">{auth?.name}</div>
                <div className="text-gray-400 lg:text-lg md:text-md sm:text-sm xs:text-xs">
                  {auth?.customUrl} ‧{" "}
                  {auth?.subscriberCount === "" ? 0 : auth?.subscriberCount}{" "}
                  người đăng ký
                </div>
              </div>
            </div>

            <div class="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
              <div class="w-full my-auto py-6 flex flex-col justify-center gap-2">
                <div class=" xs:w-full xs:h-[10rem] flex text-black gap-3">
                  <button
                    class={`${
                      tab === "posts" ? "border-b-4" : ""
                    } border-blue-600 lg:text-xl md:text-xl xs:text-lg`}
                    onClick={() => {
                      onclickChangeTab("posts");
                    }}
                  >
                    Bài viết
                  </button>

                  <button
                    class={`${
                      tab === "autoPlaylist" ? "border-b-4" : ""
                    } border-blue-600 lg:text-xl md:text-xl xs:text-lg`}
                    onClick={() => {
                      onclickChangeTab("autoPlaylist");
                    }}
                  >
                    Danh sách kết hợp
                  </button>
                </div>
                <hr />
                {tab === "posts" ? (
                  <div className="grid grid-cols-1 gap-2 p-5">
                    {data?.map((item) => {
                      return <PostCard data={item} />;
                    })}
                  </div>
                ) : (
                  <div className="grow w-full overflow-y-auto bg-pink-50 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
                      {data?.map((item) => {
                        console.log(item);

                        return <MixedPlaylistCard key={item?.id} data={item} />;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
