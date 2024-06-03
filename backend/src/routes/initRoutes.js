const authRoute = require("./authRoute");
const postsRoute = require("./postsRoute");
const historyRoute = require("./historyRoute");
const playlistRoute = require("./playlistRoute");
const likeVideoRoute = require("./likeVideoRoute");
const adminRoute = require("./adminRoute");
const userRoute = require("./userRoute");

let initRoutes = (app) => {
  app.use("/api/playlist", playlistRoute);
  app.use("/api/likeVideo", likeVideoRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/post", postsRoute);
  app.use("/api/history", historyRoute);
  app.use("/api/user", userRoute);

  // Admin
  app.use("/api/admin", adminRoute);

  return app;
};

module.exports = initRoutes;
