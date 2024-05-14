import React, { createContext, useState, useEffect } from "react";
export const Context = createContext();

export const AppContext = (props) => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Đổi thành null hoặc undefined ban đầu
  const [mobileMenu, setMobileMenu] = useState(false);

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
