import React, { useEffect, useRef, useState } from "react";
import { BsFillCheckCircleFill } from "react-icons/bs";
import moment from "moment";
import "moment/locale/vi";
import { useSelector } from "react-redux";
import {
  deletePosttAPI,
  likePostAPI,
  unLikePostAPI,
} from "../../services/postService";
import toast from "react-hot-toast";
import EditPostModal from "../modals/EditPostModal";

const PostCard = ({ data }) => {
  moment.locale("vi");
  const [like, setLike] = useState(0);
  const [isLike, setIsLike] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);
  const auth = useSelector((state) => state.auth);
  const [openModalEditPost, setOpenModalEditPost] = useState(false);

  useEffect(() => {
    setLike(data?.countLikes);
  }, [data]);

  useEffect(() => {
    setIsLike(data?.likes?.some((i) => i?._id === auth?.id));
  }, [data, auth]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const onclickToggleLike = async () => {
    setIsLoading(true);
    if (isLike) {
      await toast.promise(unLikePostAPI(data?._id), {
        loading: "Loading...",
        success: (result) => {
          if (result.code === 0) {
            setLike(result?.data);
            return result.message;
          } else {
            throw new Error(result.message);
          }
        },
        error: (error) => error.message,
      });
      setIsLike(false);
    } else {
      await toast.promise(likePostAPI(data?._id), {
        loading: "Loading...",
        success: (result) => {
          if (result.code === 0) {
            setLike(result?.data);
            return result.message;
          } else {
            throw new Error(result.message);
          }
        },
        error: (error) => error.message,
      });
      setIsLike(true);
    }
    setIsLoading(false);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleEdit = () => {
    toggleMenu();
    setOpenModalEditPost(true);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (confirmed) {
      setIsLoading(true);
      await toast.promise(deletePosttAPI(data._id), {
        loading: "Đang xóa...",
        success: (data) => {
          if (data.code === 0) {
            // deletePost(data._id);
            return data.message;
          } else {
            throw new Error(data.message);
          }
        },
        error: (error) => {
          return error.message;
        },
      });

      toggleMenu(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex bg-gray-100 shadow-lg rounded-lg md:mx-auto max-w-md md:max-w-2xl">
        <div className="bg-gray-100 text-black rounded-lg w-[42rem] space-y-6 p-4 border border-gray-300">
          <div className="flex space-x-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12">
                <img
                  alt="avatar"
                  src={data?.user?.avatar}
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex space-x-2 items-center">
                  <h2 className="text-base">{data?.user?.name}</h2>
                  <BsFillCheckCircleFill className="w-4 h-4 text-blue-700" />
                </div>
                <p className="text-xs text-black">
                  {moment(data?.createdAt).fromNow()}
                </p>
              </div>
            </div>
            {(auth?.id === data?.user?._id || auth?.isAdmin) && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={toggleMenu}
                  className="focus:outline-none pb-6"
                >
                  •••
                </button>
                {menuVisible && (
                  <div className="absolute right-0 top-6 mt-2 w-48 bg-white border rounded-md shadow-lg">
                    {auth?.id === data?.user?._id && (
                      <button
                        onClick={handleEdit}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Chỉnh sửa
                      </button>
                    )}
                    <button
                      onClick={handleDelete}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Xóa bài viết
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-black">
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.content,
                }}
              />
            </p>
          </div>

          <div className="grid grid-flow-col ">
            {data?.images &&
              data?.images?.map((image, index) => (
                <div className="" key={index}>
                  <img
                    className="w-20 h-auto rounded-md"
                    alt={`Image`}
                    src={`http://localhost:3001/${image?.path}`}
                  />
                </div>
              ))}
          </div>

          <div className="flex justify-between pt-2">
            <div className="flex justify-start">
              {isLike ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 text-red-500"
                  onClick={onclickToggleLike}
                >
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  onClick={onclickToggleLike}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                  />
                </svg>
              )}
              <div className="text-black text-sm pl-1">{like || 0}</div>
            </div>
            <div></div>
          </div>
        </div>

        {openModalEditPost && (
          <EditPostModal
            openModal={openModalEditPost}
            setOpenModal={setOpenModalEditPost}
            // postId={post?._id}
            // addPost={addPost}
            // deletePost={deletePost}
            data={data}
          />
        )}
      </div>
    </>
  );
};

export default PostCard;
