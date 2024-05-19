import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SearchResult from "../pages/SearchResult";
import VideoDetails from "../pages/VideoDetails";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import Playlist from "../pages/Playlist";
import PrivateRoutes from "./privateRoutes";

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

          {/* Danh sách phát */}
          <Route
            path="/playlist"
            element={
              <PrivateRoutes>
                <Playlist />
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
