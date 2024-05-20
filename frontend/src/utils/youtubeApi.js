import axios from "axios";

// AIzaSyAE4TMUijiy75K8KQpv5bOjZocnZ-BlRdQ
// AIzaSyBWqhobrT6nFXBQyYjuJcNg6IgsoCy0i48
// AIzaSyC_1mkYjf6AOZRMqYYe_puF7pJEUqvO4vs
// AIzaSyDZKB8sPVuoOpO_1c9hCxojeKurS0p4YJM
// AIzaSyAraMilMfXIV2OaQ3R0DinsbEfUdT7zw7U

const instance = axios.create({
  baseURL: "https://youtube.googleapis.com/youtube/v3/",
  params: {
    key: "AIzaSyDZKB8sPVuoOpO_1c9hCxojeKurS0p4YJM",
  },
});

instance.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    if (error.response) {
      // Xử lý lỗi từ response HTTP
      const { status, data } = error.response;

      // Thông báo lỗi cho người dùng nếu cần thiết
      if (status === 401) {
        // Xử lý lỗi xác thực, chẳng hạn chuyển hướng đến trang đăng nhập
        console.log("Unauthorized error:", data);
      } else {
        // Hiển thị thông báo lỗi cho người dùng
        console.log("An error occurred:", data);
      }
    } else if (error.request) {
      // Xử lý lỗi không có response từ server
      console.log("No response received from server:", error.request);
    } else {
      // Xử lý lỗi khác (lỗi trong quá trình gửi request)
      console.log("Error in request:", error.message);
    }

    // Ghi log hệ thống
    // logErrorToServer(error);

    // Trả về một object chứa thông tin lỗi
    return {
      data: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
      headers: error.response ? error.response.headers : null,
    };
  }
);

export default instance;
