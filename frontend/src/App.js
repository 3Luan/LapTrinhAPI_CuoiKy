import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import Feed from "./components/Feed";
import SearchResult from "./components/SearchResult";
import VideoDetails from "./components/VideoDetails";
import { AppContext } from "./context/contextApi";
import { handleRefresh } from "./redux/auth/authAction";
import AppRoutes from "./routes/appRoutes";

const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(handleRefresh());
  }, [dispatch, auth?.auth]);

  return (
    <AppContext>
      <AppRoutes />
    </AppContext>
  );
};

export default App;
