import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  addVideoToPlaylistAPI,
  getPlaylistIdAPI,
  createPlaylistAndAddVideoAPI,
} from "../../services/playlistService";
import Loading from "../../components/Loading";
import { RiPlayList2Fill } from "react-icons/ri";
import { IoAdd } from "react-icons/io5";
import toast from "react-hot-toast";

const AddPlaylistModal = ({ openModal, setOpenModal, videoId }) => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    getData();
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const data = await getPlaylistIdAPI();
      if (data?.code === 0) setPlaylists(data?.data);
      else setPlaylists([]);
    } catch (error) {
      console.log(error);
      setPlaylists([]);
    }
    setIsLoading(false);
  };

  const handleAddToPlaylist = async (playlistId) => {
    setIsLoadingAdd(true);
    try {
      const data = await addVideoToPlaylistAPI(playlistId, videoId);
      if (data?.code === 0)
        toast.success("Thêm video vào danh sách phát thành công");
      else toast.error(data?.message);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi thêm video vào danh sách phát");
    }
    setIsLoadingAdd(false);
    handleCloseModal();
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistTitle) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    setIsLoadingAdd(true);
    try {
      const data = await createPlaylistAndAddVideoAPI(
        newPlaylistTitle,
        videoId
      );
      if (data?.code === 0)
        toast.success("Thêm video vào danh sách phát thành công");
      else toast.error(data?.message);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi tạo danh sách phát mới");
    }
    setIsLoadingAdd(false);
    handleCloseModal();
  };

  return (
    <>
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 pb-40">
          <div className="bg-white rounded-lg w-96 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Lưu video vào...</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-800"
              >
                x
              </button>
            </div>
            <ul className="divide-y divide-gray-200">
              {isLoading ? (
                <Loading />
              ) : (
                <>
                  {playlists.map((playlist) => (
                    <li key={playlist.id} className="py-2">
                      <button
                        className="w-full flex items-center px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          handleAddToPlaylist(playlist?.id);
                        }}
                      >
                        <RiPlayList2Fill className="mr-2" />
                        {playlist?.snippet?.localized?.title}
                      </button>
                    </li>
                  ))}
                  <li className="py-2">
                    {!isCreatingPlaylist ? (
                      <button
                        className="w-full flex items-center px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsCreatingPlaylist(true)}
                      >
                        <IoAdd className="mr-2 text-xl" />
                        Tạo danh sách phát mới
                      </button>
                    ) : (
                      <div className="flex flex-col items-start px-4 py-2">
                        <input
                          type="text"
                          className="w-full mb-2 p-2 border border-gray-300 rounded"
                          placeholder="Nhập tiêu đề"
                          value={newPlaylistTitle}
                          onChange={(e) => setNewPlaylistTitle(e.target.value)}
                        />
                        <button
                          className="w-full flex items-center justify-center px-4 py-2 text-base text-white bg-gray-600 hover:bg-gray-700 rounded"
                          onClick={handleCreatePlaylist}
                        >
                          Tạo
                        </button>
                      </div>
                    )}
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPlaylistModal;
