// const { OAuth2Client } = require("google-auth-library");
// const userModel = require("../models/UserModel");

// const oAuth2Client = new OAuth2Client(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET
// );

// const checkAndUpdateAccessToken = async (req, res, next) => {
//   try {
//     const userId = req.userId;
//     const user = await userModel.findById(userId);

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     const { accessToken, refreshToken } = user;
//     oAuth2Client.setCredentials({ access_token: accessToken });

//     // Kiểm tra xem accessToken có hợp lệ hay không
//     try {
//       await oAuth2Client.getTokenInfo(accessToken);
//       // accessToken hợp lệ
//       next();
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         // accessToken hết hạn, cần làm mới bằng refreshToken
//         oAuth2Client.setCredentials({ refresh_token: refreshToken });
//         const newTokens = await oAuth2Client.refreshAccessToken();
//         const newAccessToken = newTokens.credentials.access_token;

//         // Cập nhật accessToken mới vào cơ sở dữ liệu
//         user.accessToken = newAccessToken;
//         await user.save();

//         // Tiếp tục với accessToken mới
//         next();
//       } else {
//         // Xử lý các lỗi khác nếu cần thiết
//         return res.status(500).send("Failed to verify token");
//       }
//     }
//   } catch (error) {
//     console.error("Error in checkAndUpdateAccessToken:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// module.exports = checkAndUpdateAccessToken;
