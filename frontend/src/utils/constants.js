import React from "react";

import { AiFillHome, AiOutlineFlag } from "react-icons/ai";
import { MdLocalFireDepartment, MdLiveTv } from "react-icons/md";
import { CgMusicNote } from "react-icons/cg";
import { FiFilm } from "react-icons/fi";
import { IoGameControllerSharp } from "react-icons/io5";
import { RiFeedbackLine } from "react-icons/ri";
import { FiSettings, FiHelpCircle } from "react-icons/fi";
import { RiPlayList2Fill } from "react-icons/ri";
import { MdOutlineReplay } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { IoPeople } from "react-icons/io5";

export const categories = [
  { name: "Trang chủ", icon: <AiFillHome />, type: "home" },
  { name: "Thịnh hành", icon: <MdLocalFireDepartment />, type: "category" },
  { name: "Âm nhạc", icon: <CgMusicNote />, type: "category", divider: true },
  { name: "Cộng đồng", icon: <IoPeople />, type: "category" },
  { name: "Video đã xem", icon: <MdOutlineReplay />, type: "category" },
  { name: "Danh sách phát", icon: <RiPlayList2Fill />, type: "playlist" },
  {
    name: "Video đã thích",
    icon: <AiFillLike />,
    type: "category",
    divider: true,
  },

  { name: "Cài đặt", icon: <FiSettings />, type: "menu" },
  { name: "Nhật ký báo cáo", icon: <AiOutlineFlag />, type: "menu" },
  { name: "Trợ giúp", icon: <FiHelpCircle />, type: "menu" },
  { name: "Gửi ý kiến phản hồi", icon: <RiFeedbackLine />, type: "menu" },
];
