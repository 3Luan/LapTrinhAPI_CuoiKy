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
import { useSelector } from "react-redux";
import CustomPagination from "../components/CustomPagination";

const Community = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { changeLoading } = useContext(Context);
  const [openModal, setOpenModal] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState();
  const [count, setCount] = useState();

  useEffect(() => {
    document.getElementById("root").classList.add("custom-h");
  }, []);

  useEffect(() => {
    getData(1);
  }, []);

  const getData = async (selectedPage) => {
    setLoading(true);
    changeLoading(true);

    try {
      const data = await getPostsAPI(selectedPage);
      if (data?.code === 0) {
        setData(data?.data);
        setCount(data?.count);
      } else {
        setData([]);
        setCount(0);
      }
    } catch (error) {
      console.log(error);
      setData([]);
      setCount(0);
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

  const deletePost = (postId) => {
    setData((posts) => posts.filter((post) => post._id !== postId));
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    getData(selectedPage.selected + 1);
  };

  return (
    <div className="flex flex-row h-[calc(100%-56px)] ">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-pink-50 custom-scrollbar">
        <div className="flex justify-center">
          <div className="text-black px-5 py-3 font-bold text-2xl text-center">
            Cộng đồng
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 p-5">
          <div class="flex bg-gray-100 shadow-lg rounded-lg md:mx-auto max-w-md md:max-w-2xl ">
            <div class="bg-gray-100 text-black rounded-lg w-[42rem] space-y-6 p-4 border border-gray-300 ">
              <div class="flex space-x-2 items-center ">
                <div class="w-12 h-12">
                  <img alt="avatar" src={auth?.avatar} class="rounded-full" />
                </div>
                <button
                  class="bg-slate-300 flex space-x-2 items-center border font-medium border-gray-400 px-2 py-2 w-full rounded-3xl hover:bg-gray-200 text-gray-500"
                  onClick={() => {
                    onclickCreatePost();
                  }}
                >
                  <div>Chia sẻ suy nghĩ của bạn, {auth?.name}</div>
                </button>
              </div>
            </div>
          </div>

          {data?.map((item) => {
            return (
              <PostCard data={item} deletePost={deletePost} addPost={addPost} />
            );
          })}

          <div className="flex justify-center mb-10">
            <CustomPagination
              nextLabel=">"
              onPageChange={handlePageClick}
              pageCount={Math.ceil(count / 10)}
              previousLabel="<"
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>

      {openModal && (
        <CreatePostModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          addPost={addPost}
          deletePost={deletePost}
        />
      )}
    </div>
  );
};

export default Community;
