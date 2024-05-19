import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
