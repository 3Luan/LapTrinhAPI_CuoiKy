import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import LeftNav from "../components/LeftNav";
import { Context } from "../context/contextApi";
import { getLikedVideosAPI } from "../services/likeVideoService";
import PostCard from "../components/card/PostCard";
import { useDispatch, useSelector } from "react-redux";


const Profile = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { changeLoading } = useContext(Context);
  const auth = useSelector((state) => state.auth);

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
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-pink-50 custom-scrollbar">
        <section class="w-full overflow-hidden dark:bg-gray-900 min-h-full">
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
                  <button class="border-b-4 border-blue-600 lg:text-xl md:text-xl xs:text-lg">
                    Bài viết
                  </button>
                  <button class="border-blue-600 lg:text-xl md:text-xl xs:text-lg">
                    Danh sách phát
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
