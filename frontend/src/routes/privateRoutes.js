import { useSelector } from "react-redux";
import Header from "../components/Header";
import LeftNav from "../components/LeftNav";

const PrivateRoutes = (props) => {
  const auth = useSelector((state) => state.auth);

  const handleOnclickLogin = () => {
    window.open("http://localhost:3001/api/auth/google", "_self");
  };

  if (auth.auth) {
    return (
      <>
        <div className="flex flex-row h-[calc(100%-56px)]">
          <LeftNav />
          <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black custom-scrollbar text-white ">
            <div className="text-center">
              Bạn không thể tao tác khi chưa đăng nhập!{" "}
              <button
                className="text-center"
                onClick={() => {
                  handleOnclickLogin();
                }}
              >
                <div className="login_google">
                  {/* <img src="/assets/images/logo_google.png" alt="" /> */}
                  <span>Tiếp tục với Google</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{props.children}</>;
};

export default PrivateRoutes;
