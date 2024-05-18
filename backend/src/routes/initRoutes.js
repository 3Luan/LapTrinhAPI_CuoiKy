const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const postsRoute = require("./postsRoute");
const playlistRoute = require("./playlistRoute");

let initRoutes = (app) => {
  app.use("/api/playlist", playlistRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/posts", postsRoute);

  return app;
};

module.exports = initRoutes;
