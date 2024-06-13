import React, { useEffect, useRef, useState } from "react";
import {
  createPostAPI,
  getPostDetailByIdAPI,
  updatePostAPI,
} from "../../services/postService";
import ReactQuill from "react-quill";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Loading from "../Loading";
import { useLocation } from "react-router-dom";
import TextInput from "../../admin/components/TextInput";

const EditPostModal = ({
  openModal,
  setOpenModal,
  postId,
  addPost,
  deletePost,
  data,
}) => {
  const auth = useSelector((state) => state.auth);
  const [content, setContent] = useState("");
  const [loadUpdatePost, setLoadUpdatePost] = useState(false);
  const [images, setImages] = useState([]);
  const quillRef = useRef();
  const location = useLocation();

  useEffect(() => {
    if (data) {
      setContent(data?.content);
      setImages(data?.images);
    }
  }, [data]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleImageUpload = (e) => {
    const selectedImages = Array.from(e.target.files);
    if (selectedImages.length + images.length > 10) {
      toast.error("Chỉ có thể tải lên tối đa 10 ảnh.");
      return;
    }
    setImages((prevImages) => [...prevImages, ...selectedImages]);
  };

  const onclickUpdatePosts = async () => {
    if (!content) {
      return toast.error("Nội dung không được bỏ trống!");
    } else {
      setLoadUpdatePost(true);

      const formData = new FormData();
      formData.append("postId", data?._id);
      formData.append("content", content);

      for (let i = 0; i < images.length; i++) {
        if (images[i]?._id) {
          formData.append("imagesOld", images[i]._id);
        } else {
          formData.append("images", images[i]);
        }
      }

      await toast.promise(updatePostAPI(formData), {
        loading: "Bài viết đang được sửa...",
        success: (data) => {
          if (data.code === 0) {
            deletePost(data?.data?._id);
            const newData = { ...data?.data, countLikes: 0 };

            console.log("newData", newData);
            addPost(newData);
            handleCloseModal();
            return data.message;
          } else {
            throw new Error(data.message);
          }
        },
        error: (error) => {
          return error.message;
        },
      });

      setLoadUpdatePost(false);
    }
  };

  return (
    <>
      {openModal && (
        <>
          {!data ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div
                id="static-modal"
                data-modal-backdrop="static"
                tabIndex="-1"
                aria-hidden="true"
                className="relative z-50 w-full max-w-2xl overflow-y-auto bg-white rounded-lg shadow-lg"
              >
                <div className="relative p-4 md:p-5 border-b rounded-t">
                  <h3 className="text-xl text-center font-semibold text-gray-900">
                    <Loading />
                  </h3>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="pt-20 fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                <div className="fixed inset-0 bg-black opacity-50"></div>
                <div
                  id="static-modal"
                  data-modal-backdrop="static"
                  tabIndex="-1"
                  aria-hidden="true"
                  className="relative z-50 w-full max-w-2xl overflow-y-auto bg-white rounded-lg shadow-lg"
                >
                  {/* Modal content */}
                  <div className="relative p-4 md:p-5 border-b rounded-t">
                    <h3 className="text-xl text-center font-semibold text-gray-900">
                      Chỉnh sửa
                    </h3>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="absolute top-0 right-0 px-4 py-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg focus:outline-none"
                    >
                      <i className="fa-solid fa-x"></i>
                    </button>
                  </div>
                  <div className="bg-white px-4 rounded-lg my-2">
                    <ReactQuill
                      ref={quillRef}
                      value={content}
                      onChange={setContent}
                      formats={EditPostModal.formats}
                      modules={EditPostModal.modules}
                      placeholder="Nội dung bài viết..."
                    />

                    <div className="flex gap-3 items-center my-3">
                      {/* Thêm ảnh */}
                      <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer">
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          className="hidden"
                          accept=".jpg, .png, .jpeg, image/*"
                          multiple
                        />
                        <i className="fa-solid fa-image"></i>
                        <span>Thêm ảnh</span>
                      </label>
                    </div>

                    {/* Hiển thị danh sách hình ảnh */}
                    <div className="flex flex-wrap gap-1">
                      {/* Hiển thị cả ảnh đã có và ảnh mới được thêm */}
                      {images?.map((image, index) => {
                        return (
                          <div key={index} className="relative">
                            <img
                              src={
                                image._id
                                  ? `http://localhost:3001/${image.path}`
                                  : URL.createObjectURL(image)
                              }
                              alt={`Image ${index}`}
                              className="w-auto h-32 rounded"
                            />
                            <div className="text-center">{image.name}</div>
                            <button
                              type="button"
                              className="absolute top-0 right-0 px-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <i className="fa-solid fa-x"></i>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* footer */}
                  <div className="relative p-4 md:p-5 border rounded-t flex justify-end">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg focus:outline-none mr-2 border"
                    >
                      Đóng
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onclickUpdatePosts();
                      }}
                      className="px-4 py-2 text-black hover:bg-teal-300 hover:text-gray-900 rounded-lg focus:outline-none border bg-teal-500"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

EditPostModal.modules = {
  toolbar: [["bold", "italic", "underline"]],
  clipboard: {
    matchVisual: false,
  },
};

EditPostModal.formats = ["bold", "italic", "underline"];

export default EditPostModal;
