import React from "react";
import { Link } from "react-router-dom";

const SidebarAdmin = () => {
  return (
    <div className="w-full h-screen bg-white shadow-sm px-6 py-5 mt-4 rounded-lg">
      <div className="w-full flex flex-col gap-2 py-3">
        <div className="w-full flex items-center justify-between border-b py-2 pt-4 border-[#66666645]">
          <div className="flex flex-col justify-center">
            <p className="text-lg font-medium text-ascent-1">Quản lý</p>
          </div>
        </div>
        {/* <Link
          to="/admin"
          className="w-full flex items-center gap-4 py-2 cursor-pointer h-full"
        >
          <span>Thống kê</span>
        </Link> */}
        <Link
          to="/admin/quan-ly-tai-khoan"
          className="w-full flex items-center gap-4 py-2 cursor-pointer h-full"
        >
          <span>Tài khoản</span>
        </Link>
        <Link
          to="/admin/quan-ly-bai-viet"
          className="w-full flex items-center  gap-4 py-2 cursor-pointer h-full"
        >
          <span>Bài viết</span>
        </Link>
      </div>
    </div>
  );
};

export default SidebarAdmin;
