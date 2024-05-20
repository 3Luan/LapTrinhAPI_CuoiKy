import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ytLogoBlack from "../images/yt-logo-black.png";
import ytLogo from "../images/yt-logo.png";
import ytLogoMobile from "../images/yt-logo-mobile.png";
import { Popup } from "semantic-ui-react";
import { SlMenu } from "react-icons/sl";
import { IoIosSearch } from "react-icons/io";
import { RiVideoAddLine } from "react-icons/ri";
import { FiBell } from "react-icons/fi";
import { CgClose } from "react-icons/cg";
import { Context } from "../context/contextApi";
import Loader from "../shared/loader";
import { useDispatch, useSelector } from "react-redux";
import { handleRefresh } from "../redux/auth/authAction";
import { logoutAPI } from "../services/authService";
import { getPlaylistIdAPI } from "../services/playlistService";
import profileUser from "../images/profile-user.png"
import logOut from "../images/logout.png"

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const auth = useSelector((state) => state.auth);
  const [showPopup, setShowPopup] = useState(false);
  const { loading, mobileMenu, setMobileMenu } = useContext(Context);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const searchQueryHandler = (event) => {
    if (
      (event?.key === "Enter" || event === "searchButton") &&
      searchQuery?.length > 0
    ) {
      navigate(`/searchResult/${searchQuery}`);
    }
  };

  const mobileMenuToggle = () => {
    setMobileMenu(!mobileMenu);
  };

  const handleLogout = async () => {
    const confirm = window.confirm("Bạn có chắc chắn đăng xuất không?");
    if (confirm) {
      setIsLoading(true);
      try {
        await logoutAPI();
        dispatch(handleRefresh());
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    window.open("http://localhost:3001/api/auth/google", "_self");
  };

  return (
    <div className="sticky top-0 z-10 flex flex-row items-center justify-between h-14 px-4 md:px-5 bg-pink-50">
      {loading && <Loader />}

      <div className="flex h-5 items-center">
        {/* {pageName !== "video" && ( */}
        <div
          className="flex md:hidden md:mr-6 cursor-pointer items-center justify-center h-10 w-10 rounded-full hover:bg-[#303030]/[0.6]"
          onClick={mobileMenuToggle}
        >
          {mobileMenu ? (
            <CgClose className="text-black text-xl" />
          ) : (
            <SlMenu className="text-black text-xl" />
          )}
        </div>
        {/* )} */}
        <Link to="/" className="flex h-5 items-center">
          <img
            className=" h-full hidden md:block text-black"
            src={ytLogoBlack}
            alt="Youtube"
          />
          <img className="h-full md:hidden" src={ytLogoMobile} alt="Youtube" />
        </Link>
      </div>
      <div className="group flex items-center">
        <div className="flex h-8 md:h-10 md:ml-10 md:pl-5 border border-[#303030] rounded-l-3xl group-focus-within:border-blue-500 md:group-focus-within:ml-5 md:group-focus-within:pl-0">
          <div className="w-10 items-center justify-center hidden group-focus-within:md:flex">
            <IoIosSearch className="text-black text-xl" />
          </div>
          <input
            type="text"
            className="bg-transparent outline-none text-black pr-5 pl-5 md:pl-0 w-44 md:group-focus-within:pl-0 md:w-64 lg:w-[500px]"
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={searchQueryHandler}
            placeholder="Tìm kiếm"
            value={searchQuery}
          />
        </div>
        <button
          className="w-[40px] md:w-[60px] h-8 md:h-10 flex items-center justify-center border border-l-0 border-[#303030] rounded-r-3xl bg-white/[0.1]"
          onClick={() => searchQueryHandler("searchButton")}
        >
          <IoIosSearch className="text-black text-xl" />
        </button>
      </div>
      <div className="flex items-center">
        <div className="hidden md:flex">
          <div className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-[#303030]/[0.6]">
            <RiVideoAddLine className="text-black text-xl cursor-pointer" />
          </div>
          <div className="flex items-center justify-center ml-2 h-10 w-10 rounded-full hover:bg-[#303030]/[0.6]">
            <FiBell className="text-black text-xl cursor-pointer" />
          </div>
        </div>

        <div className="flex h-8 w-8 overflow-hidden rounded-full md:ml-4">
          {auth?.auth ? (
            <>
              <Popup
                trigger={<img src={auth.avatar} alt="avatar" />}
                on="click"
                open={showPopup}
                onOpen={() => setShowPopup(true)}
                onClose={() => setShowPopup(false)}
                position="bottom right"
                className="bg-pink-50 px-7 py-7 rounded-md mt-4"
              >
                <Popup.Content>
                  
                  <Link to={`/profile`} className="flex items-center">
                    <img
                    className="h-5 w-5"
                    src = {profileUser}
                    alt = "profileuser"
                    />
                     <span className="ml-2">Trang cá nhân </span>
                  </Link>

                  <button
                    onClick={() => {
                      if (!isLoading) handleLogout();
                    }}
                    className="flex items-center pt-3"
                  >
                    <img
                    className="h-5 w-5"
                    src = {logOut}
                    alt = "logout"
                    />
                    <span className="ml-2">Đăng xuất </span>
                  </button>
                </Popup.Content>
              </Popup>
            </>
          ) : (
            <>
              <button onClick={() => handleLogin()}>
                <img src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
