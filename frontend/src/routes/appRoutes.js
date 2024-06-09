import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import SearchResult from "../pages/SearchResult";
import VideoDetails from "../pages/VideoDetails";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import Playlist from "../pages/Playlist";
import PrivateRoutes from "./privateRoutes";
import LikedVideo from "../pages/LikedVideo";
import Trending from "../pages/Trending";
import Community from "../pages/Community";
import Profile from "../pages/Profile";
import VideoPlaylistDetails from "../pages/VideoPlaylistDetails";
import History from "../pages/History";
import LoginAdmin from "../admin/pages/LoginAdmin";
import PrivateAdminRoutes from "./privateAdminRoutes";
import HomeAdmin from "../admin/pages/HomeAdmin";
import Account from "../admin/pages/Account";
import AccountLockedRoutes from "./accountLockedRoutes";
import PostDelete from "../admin/pages/PostDelete";

const AppRoutes = () => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  if (auth.isInit && auth?.isLoading) {
    return (
      <>
        <div className="flex flex-col h-full ">
          {!location.pathname.startsWith("/admin") && <Header />}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full ">
        {!location.pathname.startsWith("/admin") && <Header />}

        <Routes>
          {/* Home */}
          <Route path="/" exact element={<Home />} />

          {/* Tìm kiếm */}
          <Route path="/searchResult/:searchQuery" element={<SearchResult />} />

          {/* Trang chi tiết video */}
          <Route path="/video/:id" element={<VideoDetails />} />

          {/* Video thịnh hành */}
          <Route path="/trending" element={<Trending />} />

          {/* Video đã xem */}
          <Route
            path="/history"
            element={
              <PrivateRoutes>
                <AccountLockedRoutes>
                  <History />
                </AccountLockedRoutes>
              </PrivateRoutes>
            }
          />
          {/* Danh sách phát */}
          <Route
            path="/playlist"
            element={
              <PrivateRoutes>
                <AccountLockedRoutes>
                  <Playlist />
                </AccountLockedRoutes>
              </PrivateRoutes>
            }
          />

          {/* Trang chi tiết video của danh sách phát */}
          <Route
            path="/playlist/:playlistId/:autoPlaylistId/video/:videoId"
            element={
              <PrivateRoutes>
                <AccountLockedRoutes>
                  <VideoPlaylistDetails />
                </AccountLockedRoutes>
              </PrivateRoutes>
            }
          />

          {/* Video đã thích */}
          <Route
            path="/likedVideo"
            element={
              <PrivateRoutes>
                <AccountLockedRoutes>
                  <LikedVideo />
                </AccountLockedRoutes>
              </PrivateRoutes>
            }
          />

          {/* Cộng đồng */}
          <Route
            path="/community"
            element={
              <PrivateRoutes>
                <AccountLockedRoutes>
                  <Community />
                </AccountLockedRoutes>
              </PrivateRoutes>
            }
          />

          {/* Trang cá nhân */}
          <Route
            path="/profile"
            element={
              <PrivateRoutes>
                <AccountLockedRoutes>
                  <Profile />
                </AccountLockedRoutes>
              </PrivateRoutes>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginAdmin />} />

          <Route
            path="/admin"
            element={
              <PrivateAdminRoutes>
                <Account />
              </PrivateAdminRoutes>
            }
          />

          <Route
            path="/admin/quan-ly-tai-khoan"
            element={
              <PrivateAdminRoutes>
                <Account />
              </PrivateAdminRoutes>
            }
          />

          <Route
            path="/admin/quan-ly-bai-viet"
            element={
              <PrivateAdminRoutes>
                <PostDelete />
              </PrivateAdminRoutes>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;
