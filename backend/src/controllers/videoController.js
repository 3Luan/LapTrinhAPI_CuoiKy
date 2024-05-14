// const axios = require("axios");

// let getVideo = async (req, res) => {
//   try {
//     // const options = {
//     //   method: "GET",
//     //   url: "https://youtube-v2.p.rapidapi.com/search/",
//     //   params: {
//     //     // query: "Sơn tùng",
//     //     lang: "vi",
//     //     // order_by: "this_month",
//     //     country: "vn",
//     //   },
//     //   headers: {
//     //     "X-RapidAPI-Key": "6084b3baf9msh1e664919b0b05a9p1c6450jsn3eaca78b0c53",
//     //     "X-RapidAPI-Host": "youtube-v2.p.rapidapi.com",
//     //   },
//     // };

//     const options = {
//       method: "GET",
//       url: "https://cheap-youtube-api.p.rapidapi.com/popular",
//       params: {
//         country: "VN", // Mã quốc gia cho Việt Nam
//       },
//       headers: {
//         "X-RapidAPI-Key": "6084b3baf9msh1e664919b0b05a9p1c6450jsn3eaca78b0c53",
//         "X-RapidAPI-Host": "cheap-youtube-api.p.rapidapi.com",
//       },
//     };

//     const response = await axios.request(options);
//     const videoData = response.data; // Giải nén chuỗi JSON thành đối tượng JavaScript

//     // Xử lý dữ liệu phản hồi từ API một cách chính xác tại đây
//     // Ví dụ: Trích xuất thông tin video và gửi lại cho client
//     res.status(200).json({
//       code: 0,
//       message: "getVideo thành công",
//       videoData,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       code: 1,
//       message: "Lỗi: getVideo",
//     });
//   }
// };

// module.exports = {
//   getVideo,
// };
