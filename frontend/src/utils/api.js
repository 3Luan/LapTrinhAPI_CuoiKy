// import axios from "axios";

// const BASE_URL = "https://youtube138.p.rapidapi.com";

// const options = {
//   params: { hl: "en", gl: "US" },
//   headers: {
//     "X-RapidAPI-Key":
//       // process.env.REACT_APP_YOUTUBE_API_KEY || "YOUR_API_KEY",
//       "AIzaSyDZKB8sPVuoOpO_1c9hCxojeKurS0p4YJM",
//     "X-RapidAPI-Host": "youtube138.p.rapidapi.com",
//   },
// };

// export const fetchDataFromApi = async (url) => {
//   const { data } = await axios.get(`${BASE_URL}/${url}`, options);
//   return data;
// };
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

export const fetchDataFromApi = async () => {
  try {
    const { data } = await axios.get(options.url, {
      params: options.params,
      headers: options.headers,
    });

    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
