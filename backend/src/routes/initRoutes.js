const authRoute = require("./authRoute");
const postsRoute = require("./postsRoute");
const historyRoute = require("./historyRoute");
const playlistRoute = require("./playlistRoute");
const likeVideoRoute = require("./likeVideoRoute");

let initRoutes = (app) => {
  app.use("/api/playlist", playlistRoute);
  app.use("/api/likeVideo", likeVideoRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/post", postsRoute);
  app.use("/api/history", historyRoute);

  return app;
};

module.exports = initRoutes;
