import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { abbreviateNumber } from "js-abbreviation-number";
import { BsFillCheckCircleFill } from "react-icons/bs";
import moment from "moment";
import "moment/locale/vi";
import { useSelector } from "react-redux";
import { likePostAPI, unLikePostAPI } from "../../services/postService";
import toast from "react-hot-toast";

const PostCardAdmin = ({ data }) => {
  moment.locale("vi");
  const [like, setLike] = useState(0);
  const [isLike, setIsLike] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    setLike(data?.countLikes);
  }, []);

  useEffect(() => {
    setIsLike(
      data?.likes?.some((i) => {
        return i?._id === auth?.id;
      })
    );
  }, []);

  return (
    <>
      {/* <div className="flex flex-col md:flex-row mb-8 md:mb-3 lg:bg-gray-500 rounded-xl md:p-4"> */}
      <div class="flex bg-gray-100 shadow-lg rounded-lg md:mx-auto max-w-md md:max-w-2xl">
        <div class="bg-gray-100 text-black rounded-lg  w-[42rem] space-y-6 p-4 border border-gray-300">
          <div class="flex space-x-4 items-center ">
            <div class="w-12 h-12">
              <img
                alt="avatar"
                src={data?.user?.avatar}
                class="rounded-full w-full h-full object-cover "
              />
            </div>
            <div class="space-y-2">
              <div class="flex space-x-2 items-center">
                <h2 class="text-base"> {data?.user?.name} </h2>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-4 h-4 text-blue-700"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <p class=" text-xs text-black">
                {moment(data?.createdAt).fromNow()}
              </p>
            </div>
          </div>
          <div>
            <p class="text-sm text-black">
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.content,
                }}
              />
            </p>
          </div>

          <div className="grid grid-flow-col ">
            {data?.images &&
              data?.images?.map((image, index) => {
                return (
                  <div className="" key={index}>
                    <img
                      className="w-20 h-auto rounded-md"
                      alt={`Image`}
                      src={`http://localhost:3001/${image?.path}`}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCardAdmin;
