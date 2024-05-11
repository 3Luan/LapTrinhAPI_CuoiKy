// import React, { createContext, useState, useEffect } from "react";

// import { fetchDataFromApi } from "../utils/api";
// export const Context = createContext();

// export const AppContext = (props) => {
//     const [loading, setLoading] = useState(false);
//     const [searchResults, setSearchResults] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState("New");
//     const [mobileMenu, setMobileMenu] = useState(false);

//     useEffect(() => {
//         fetchSelectedCategoryData(selectedCategory);
//     }, [selectedCategory]);

//     const fetchSelectedCategoryData = (query) => {
//         setLoading(true);
//         fetchDataFromApi(`search/?q=${query}`).then(({ contents }) => {
//             console.log(contents);
//             setSearchResults(contents);
//             setLoading(false);
//         });
//     };

//     return (
//         <Context.Provider
//             value={{
//                 loading,
//                 setLoading,
//                 searchResults,
//                 selectedCategory,
//                 setSelectedCategory,
//                 mobileMenu,
//                 setMobileMenu,
//             }}
//         >
//             {props.children}
//         </Context.Provider>
//     );
// };

import React, { createContext, useState, useEffect } from "react";
import { fetchDataFromApi } from "../utils/api";

export const Context = createContext();

export const AppContext = (props) => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Đổi thành null hoặc undefined ban đầu
  const [mobileMenu, setMobileMenu] = useState(false);

  // useEffect(() => {
  //   fetchSelectedCategoryData(selectedCategory);
  // }, [selectedCategory]);

  // const fetchSelectedCategoryData = (query) => {
  //   setLoading(true);
  //   fetchDataFromApi()
  //     .then((response) => {
  //       // Kiểm tra dữ liệu phản hồi từ API và xử lý nó tùy thuộc vào cấu trúc dữ liệu cụ thể
  //       console.log(response);
  //       // Dựa vào cấu trúc dữ liệu của API, truy cập vào thông tin cần thiết và cập nhật searchResults
  //       setSearchResults(response.data); // Ví dụ: giả sử API trả về một đối tượng với một trường 'data'
  //       setLoading(false);

  //       console.log("response", response);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     });
  // };

  const changeLoading = (loading) => {
    setLoading(loading);
  };

  return (
    <Context.Provider
      value={{
        loading,
        setLoading,
        searchResults,
        selectedCategory,
        setSelectedCategory,
        mobileMenu,
        setMobileMenu,
        changeLoading,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
