import { Routes, Route } from "react-router-dom";
import Feed from "../components/Feed";
import SearchResult from "../components/SearchResult";
import VideoDetails from "../components/VideoDetails";
import Header from "../components/Header";
import { useSelector } from "react-redux";

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
          <Route path="/" exact element={<Feed />} />
          <Route path="/searchResult/:searchQuery" element={<SearchResult />} />
          <Route path="/video/:id" element={<VideoDetails />} />

          <Route path="*" element={<Feed />} />
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;
