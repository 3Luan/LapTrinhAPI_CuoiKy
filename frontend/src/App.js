import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "./context/contextApi";
import { handleRefresh } from "./redux/auth/authAction";
import AppRoutes from "./routes/appRoutes";
import { Toaster } from "react-hot-toast";

const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(handleRefresh());
  }, [dispatch, auth?.auth]);

  return (
    <AppContext>
      <AppRoutes />

      <Toaster position="bottom-right" reverseOrder={true} />
    </AppContext>
  );
};

export default App;
