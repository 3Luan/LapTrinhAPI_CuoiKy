import React from "react";
import { AiFillHome, AiOutlineFlag } from "react-icons/ai";
import { MdLocalFireDepartment } from "react-icons/md";
import { CgMusicNote } from "react-icons/cg";
import { RiFeedbackLine } from "react-icons/ri";
import { FiSettings, FiHelpCircle } from "react-icons/fi";
import { RiPlayList2Fill } from "react-icons/ri";
import { MdOutlineReplay } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { IoPeople } from "react-icons/io5";

export const categories = [
  { name: "Trang chủ", icon: <AiFillHome />, type: "home", link: "/" },
  {
    name: "Thịnh hành",
    icon: <MdLocalFireDepartment />,
    type: "category",
    link: "/trending",
    divider: true,
  },
  {
    name: "Cộng đồng",
    icon: <IoPeople />,
    type: "category",
    link: "/community",
  },
  {
    name: "Video đã xem",
    icon: <MdOutlineReplay />,
    type: "category",
    link: "/",
  },
  {
    name: "Danh sách phát",
    icon: <RiPlayList2Fill />,
    type: "category",
    link: "/playlist",
  },
  {
    name: "Video đã thích",
    icon: <AiFillLike />,
    type: "category",
    divider: true,
    link: "/likedVideo",
  },

  { name: "Cài đặt", icon: <FiSettings />, type: "menu", link: "/" },
  { name: "Nhật ký báo cáo", icon: <AiOutlineFlag />, type: "menu", link: "/" },
  { name: "Trợ giúp", icon: <FiHelpCircle />, type: "menu", link: "/" },
  {
    name: "Gửi ý kiến phản hồi",
    icon: <RiFeedbackLine />,
    type: "menu",
    link: "/",
  },
];
