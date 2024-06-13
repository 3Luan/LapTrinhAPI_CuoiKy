import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { createPostAPI } from "../../services/postService";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS

const CreatePostModal = ({ openModal, setOpenModal, addPost }) => {
  const auth = useSelector((state) => state.auth);
  const [post, setPost] = useState();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const quillRef = useRef();
  const location = useLocation();

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
      setIsLoading(true);

      const formData = new FormData();
      formData.append("content", content);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await toast.promise(createPostAPI(formData), {
        loading: "Bài viết đang được tạo...",
        success: (data) => {
          if (data.code === 0) {
            console.log("data", data);
            const newData = { ...data?.data, countLikes: 0 };

            addPost(newData);
            setContent("");
            setImages([]);
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

      setIsLoading(false);
    }
  };

  return (
    <>
      {openModal && (
        <>
          <div className="pb-40 fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
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
                  Tạo bài viết
                </h3>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="absolute top-0 right-0 px-3 py-1 m-2 bg-gray-300 rounded-md focus:outline-none hover:bg-red-500"
                >
                  <span className="text-white"> x </span>
                </button>
              </div>
              <div className="bg-white px-4 rounded-lg my-2 text-black">
                <ReactQuill
                  ref={quillRef}
                  value={content}
                  onChange={setContent}
                  formats={CreatePostModal.formats}
                  modules={CreatePostModal.modules}
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
                  {images.map((image, index) => {
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
                        {/* <div className="text-center">{image.name}</div> */}
                        <button
                          type="button"
                          className="absolute top-0 right-0 px-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <i className="fa-solid fa-x">x</i>
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
                  onClick={() => {
                    onclickUpdatePosts();
                  }}
                  className="px-4 py-2  hover:bg-blue-900 text-white rounded-lg focus:outline-none border bg-blue-800"
                >
                  Đăng bài
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

CreatePostModal.modules = {
  toolbar: [["bold", "italic", "underline"]],
  clipboard: {
    matchVisual: false,
  },
};

CreatePostModal.formats = ["bold", "italic", "underline"];

export default CreatePostModal;
