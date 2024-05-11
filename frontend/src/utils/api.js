const axios = require("axios");

const options = {
  method: "GET",
  url: "https://youtube-v2.p.rapidapi.com/video/details",
  params: {
    video_id: "PuQFESk0BrA",
  },
  headers: {
    "X-RapidAPI-Key": "6084b3baf9msh1e664919b0b05a9p1c6450jsn3eaca78b0c53",
    "X-RapidAPI-Host": "youtube-v2.p.rapidapi.com",
  },
};
