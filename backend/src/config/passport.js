const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
require("dotenv").config();
const { google } = require("googleapis");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["https://www.googleapis.com/auth/youtube.readonly"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let data = {
          accessToken: accessToken,
          profile: profile,
        };

        // const auth = new google.auth.OAuth2();
        // auth.setCredentials({ access_token: accessToken });

        // const youtube = google.youtube({ version: "v3", auth });

        // const response = await youtube.channels.list({
        //   part: "id",
        //   mine: true,
        // });

        // const channels = response.data.items;

        // if (channels.length) {
        //   const channelId = channels[0].id;

        //   const playlistsResponse = await youtube.playlists.list({
        //     part: "snippet,contentDetails",
        //     channelId: channelId,
        //     maxResults: 25,
        //   });

        //   const playlists = playlistsResponse.data.items;
        //   profile.playlists = playlists;
        //   if (playlists.length) {
        //     console.log("Playlists:");
        //     playlists.forEach((playlist) => {
        //       console.log(`${playlist.snippet.title} (${playlist.id})`);
        //     });
        //   } else {
        //     console.log("No playlists found.");
        //   }
        // } else {
        //   console.log("No channel found.");
        // }

        return cb(data);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);
