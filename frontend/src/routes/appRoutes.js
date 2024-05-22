import { Routes, Route } from "react-router-dom";
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

const AppRoutes = () => {
  const auth = useSelector((state) => state.auth);

  if (auth?.isLoading) {
    return (
      <>
        <div className="flex flex-col h-full ">
          <Header />
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex flex-col h-full ">
        <Header />
        <Routes>
          {/* Home */}
          <Route path="/" exact element={<Home />} />

          {/* Tìm kiếm */}
          <Route path="/searchResult/:searchQuery" element={<SearchResult />} />

          {/* Trang chi tiết video */}
          <Route path="/video/:id" element={<VideoDetails />} />

          {/* Trang chi tiết video của danh sách phát */}
          <Route
            path="/playlist/:playlistId/video/:videoId"
            element={<VideoPlaylistDetails />}
          />

          {/* Video thịnh hành */}
          <Route path="/trending" element={<Trending />} />

          {/* Video đã xem */}
          <Route
            path="/history"
            element={
              <PrivateRoutes>
                <History />
              </PrivateRoutes>
            }
          />
          {/* Danh sách phát */}
          <Route
            path="/playlist"
            element={
              <PrivateRoutes>
                <Playlist />
              </PrivateRoutes>
            }
          />

          {/* Video đã thích */}
          <Route
            path="/likedVideo"
            element={
              <PrivateRoutes>
                <LikedVideo />
              </PrivateRoutes>
            }
          />

          {/* Cộng đồng */}
          <Route
            path="/community"
            element={
              <PrivateRoutes>
                <Community />
              </PrivateRoutes>
            }
          />

          {/* Trang cá nhân */}
          <Route
            path="/profile"
            element={
              <PrivateRoutes>
                <Profile />
              </PrivateRoutes>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;
