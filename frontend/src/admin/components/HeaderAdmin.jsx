import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ytLogoBlack from "../../images/yt-logo-black.png";
import { handleLogoutAdmin } from "../../redux/authAdmin/authAdminAction";
import CustomButton from "./CustomButton";

const HeaderAdmin = () => {
  const authAdmin = useSelector((state) => state.authAdmin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pathname = window.location.pathname;

  const onClickLogout = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmed) {
      dispatch(handleLogoutAdmin(navigate));
    }
  };

  return (
    <div className="topbar w-full flex items-center justify-between py-3 md:py-3 px-4 bg-white rounded-b-lg">
      <Link to="/" className="flex gap-2 items-center">
        <div className="w-32 rounded text-white">
          <img src={ytLogoBlack} alt="" />
        </div>
        <span className="text-xl md:text-2xl text-blue-700 font-bold">
          Admin
        </span>
      </Link>

      <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
        <div>
          <CustomButton
            onClick={() => onClickLogout()}
            title="Đăng xuất"
            containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
