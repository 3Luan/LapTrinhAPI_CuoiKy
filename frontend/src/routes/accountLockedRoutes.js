import { useSelector } from "react-redux";
import Header from "../components/Header";
import LeftNav from "../components/LeftNav";
import { Button } from "semantic-ui-react";
import GgLogo from "../images/google.png";

const AccountLockedRoutes = (props) => {
  const auth = useSelector((state) => state.auth);

  const handleOnclickLogin = () => {
    window.open("http://localhost:3001/api/auth/google", "_self");
  };

  if (auth?.auth && auth?.isBan) {
    return (
      <>
        <div className="flex flex-row h-[calc(100%-56px)]">
          <LeftNav />

          <div className=" w-[calc(100%-240px)] h-full flex-col flex items-center justify-center bg-pink-50 custom-scrollbar pb-44">
            <div className=" text-red-600 text-4xl font-bold">
              Tài khoản của bạn đã bị khóa!{" "}
            </div>
            <br />
            <div className="text-white py-0 font-bold text-2xl flex items-center justify-center">
              <button
                className=" bg-blue-500 w-full rounded-full flex items-center justify-center  p-3"
                onClick={() => {
                  handleOnclickLogin();
                }}
              >
                <img className="h-7 w-7 " src={GgLogo} alt="Google" />
                <span className="ml-2 ">Tiếp tục với Google</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{props.children}</>;
};

export default AccountLockedRoutes;
