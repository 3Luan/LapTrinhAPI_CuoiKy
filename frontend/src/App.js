import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "./context/contextApi";
import { handleRefresh } from "./redux/auth/authAction";
import AppRoutes from "./routes/appRoutes";
import { Toaster } from "react-hot-toast";
import { handleRefreshAdmin } from "./redux/authAdmin/authAdminAction";
import { useLocation, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const authAdmin = useSelector((state) => state.authAdmin);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(handleRefresh());
  }, [dispatch, auth?.auth, location.pathname]);

  useEffect(() => {
    dispatch(handleRefresh());

    if (location.pathname.startsWith("/admin")) {
      dispatch(handleRefreshAdmin());
    }
  }, []);

  useEffect(() => {
    if (
      auth.auth &&
      (location.pathname === "/login" || location.pathname === "/register")
    ) {
      navigate("/");
    }
  }, [auth.auth, location.pathname]);

  useEffect(() => {
    if (authAdmin.auth && location.pathname === "/admin/login") {
      navigate("/admin");
    }
  }, [location.pathname, authAdmin.auth]);

  return (
    <AppContext>
      <AppRoutes />

      <Toaster position="bottom-right" reverseOrder={true} />
    </AppContext>
  );
};

export default App;
