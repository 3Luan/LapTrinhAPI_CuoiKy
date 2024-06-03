import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import CustomPagination from "../../components/CustomPagination";
import { useLocation } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import { getDeletePostsAPI } from "../../services/postService";
import PostCardAdmin from "../components/PostCardAdmin";
import TextInput from "../components/TextInput";
import CustomButton from "../components/CustomButton";

const PostDelete = ({}) => {
  const dispatch = useDispatch();
  const [countPosts, setCountPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [keywordSearch, setKeywordSearch] = useState("");

  const location = useLocation();

  useEffect(() => {
    getDeletePosts(1);
  }, []);

  const handleSearch = async (currentPage) => {
    // if (keywordSearch) {
    //   let data;
    //   setIsLoading(true);
    //   data = await searchAdminRoleAPI(currentPage, keywordSearch);
    //   setUser(data?.data);
    //   setCount(data?.count);
    //   setIsLoading(false);
    // }
  };

  const getDeletePosts = async (currentPage) => {
    setIsLoading(true);

    try {
      const data = await getDeletePostsAPI(currentPage);

      if (data?.code === 0) {
        setData(data?.data);
        setCountPosts(data.count);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
      setData([]);
    }

    setIsLoading(false);
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    getDeletePosts(selectedPage.selected + 1);
  };

  return (
    <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-gray-200 lg:rounded-lg h-screen overflow-hidden">
      <HeaderAdmin />

      <div className="w-full flex gap-2 lg:gap-4  h-full">
        <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          <SidebarAdmin />
        </div>

        {/* CENTER */}

        <div className="flex-1 h-full flex flex-col  overflow-y-auto rounded-lg bg-white mt-4">
          <div className="flex mt-4 mx-4 items-center justify-between">
            <div className="flex items-center"></div>

            <div className="flex justify-start items-center">
              <TextInput
                styles="-mt-2 rounded-md border border-gray-200 bg-gray-200 text-gray-600 transition duration-300 ease-in w-auto"
                placeholder="Tìm kiếm..."
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(currentPage);
                  }
                }}
              />

              <CustomButton
                title={<i className="fa-solid fa-magnifying-glass my-1"></i>}
                containerStyles={`bg-blue-700 text-white text-xl py-3 px-4 rounded-md font-semibold text-sm`}
                onClick={() => {
                  handleSearch(currentPage);
                }}
              />
            </div>
          </div>

          <div className="pt-2 grid gap-3">
            {isLoading ? (
              <Loading />
            ) : data?.length > 0 ? (
              <>
                {data?.map((item) => {
                  return <PostCardAdmin data={item} />;
                })}
                <div className="flex justify-center mb-10">
                  <CustomPagination
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageCount={Math.ceil(countPosts / 10)}
                    previousLabel="<"
                    currentPage={currentPage}
                  />
                </div>
              </>
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">
                  Không tìm thấy bài viết nào
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDelete;
