import React from "react";
import { Link } from "react-router-dom";
import { abbreviateNumber } from "js-abbreviation-number";
import { BsFillCheckCircleFill } from "react-icons/bs";
import moment from "moment";
import "moment/locale/vi";

const PostCard = ({ data }) => {
  moment.locale("vi");

  return (
    <>
      {/* <div className="flex flex-col md:flex-row mb-8 md:mb-3 lg:bg-gray-500 rounded-xl md:p-4"> */}
      <div class="flex bg-gray-50 shadow-lg rounded-lg md:mx-auto max-w-md md:max-w-2xl ">
        <div class="bg-gray-50 text-black rounded-lg  w-[34rem] space-y-6 p-4">
          <div class="flex space-x-4 items-center ">
            <div class="w-12 h-12">
              <img
                alt="avatar"
                src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
                class="rounded-full w-full h-full object-cover "
              />
              <div></div>
            </div>
            <div class="space-y-2">
              <div class="flex space-x-2 items-center">
                <h2 class="text-base"> Thành Luân </h2>
                <svg
                  class="h-4 w-4 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p class=" text-xs text-black">5 phút trước</p>
            </div>
          </div>
          <div>
            <p class="text-sm leading-6 text-black">
              Tailwind là một khung CSS nguồn mở. Tính năng chính của thư viện
              này là, không giống như các khung CSS khác như Bootstrap, nó không
              cung cấp một loạt các lớp được xác định trước cho các thành phần
              như nút hoặc bảng.
            </p>
          </div>

          <div class="flex justify-between pt-5">
            <div class="flex justify-start">
              <svg
                class="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                />
              </svg>
              <div class="text-black text-sm pl-1">
                <p>29 Lượt thích</p>
              </div>
            </div>

            <div class="text-black text-sm">
              <p>29 bình luận</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
