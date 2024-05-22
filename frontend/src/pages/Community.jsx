import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import LeftNav from "../components/LeftNav";
import LikedVideoCard from "../components/card/LikedVideoCard";
import { searchVideosAPI } from "../services/videoService";
import { Context } from "../context/contextApi";
import { getLikedVideosAPI } from "../services/likeVideoService";
import PostCard from "../components/card/PostCard";
import CreatePostModal from "../components/modals/CreatePostModal";
import { getPostsAPI } from "../services/postService";

const Community = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { changeLoading } = useContext(Context);
  const [openModal, setOpenModal] = useState(false);

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
      const data = await getPostsAPI(1);
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

  const onclickCreatePost = () => {
    setOpenModal(true);
  };

  const addPost = (data) => {
    setData((posts) => [data, ...posts]);
  };

  return (
    <div className="flex flex-row h-[calc(100%-56px)] ">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-pink-50 custom-scrollbar">
        <div className="flex justify-center">
          <div className="text-black px-5 py-3 font-bold text-2xl text-center">
            Cộng đồng
          </div>
          <button
            className="text-black px-5 py-3 font-bold text-2xl text-center"
            onClick={() => {
              onclickCreatePost();
            }}
          >
            +
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2 p-5">
          {data?.map((item) => {
            return <PostCard data={item} />;
          })}
        </div>
      </div>

      {openModal && (
        <CreatePostModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          addPost={addPost}
        />
      )}
    </div>
  );
};

export default Community;
