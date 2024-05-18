import { useSelector } from "react-redux";

const PrivateRoutes = (props) => {
  const auth = useSelector((state) => state.auth);

  const handleOnclickLogin = () => {
    window.open("http://localhost:3001/api/auth/google", "_self");
  };

  if (!auth.auth) {
    return (
      <>
        <div className="alert text-center" role="alert">
          <h4 className="alert-heading text-danger">
            Bạn không thể tao tác khi chưa đăng nhập!
          </h4>
        </div>
        <div className="centered-wrapper">
          <div
            className="login-in-private"
            onClick={() => {
              handleOnclickLogin();
            }}
          >
            <div className="login_google">
              {/* <img src="/assets/images/logo_google.png" alt="" /> */}
              <span>Tiếp tục với Google</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{props.children}</>;
};

export default PrivateRoutes;
