import React from "react";
import { Link } from "react-router-dom";
import { logoutOwner } from "../../services/ownerService";
import { logoutUser } from "../../services/userService";

interface NavigationProps {
  role: string;
  isAuthenticated: boolean;
  restaurantId: string;
  restaurantName: string;
  restaurantSelected: boolean;
  setRestaurantSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navigation: React.FC<NavigationProps> = ({
  role,
  isAuthenticated,
  restaurantName,
  restaurantId,
  restaurantSelected,
  setRestaurantSelected,
  setIsAuthenticated,
}) => {
  const handleLogout = async (role: string) => {
    if (role === "admin") {
      await logoutOwner();
    } else if (role === "manager" || role === "employee") {
      await logoutUser();
    } else {
      console.error("ログアウト時にロールが不明です");
    }
    setRestaurantSelected(false);
    setIsAuthenticated(false);
  };
  const renderNavLinks = () => {
    // 認証されていない場合
    if (!isAuthenticated) {
      return (
        <>
          <li>
            <Link to="/register" className="p-2 hover:text-black">
              新規登録
            </Link>
          </li>
          <li>
            <Link to="/login-owner" className="p-2 hover:text-black">
              オーナーログイン
            </Link>
          </li>
          <li>
            <Link to="/login-user" className="p-2 hover:text-black">
              ユーザーログイン
            </Link>
          </li>
        </>
      );
    }

    // 認証済みでレストラン未選択の場合
    if (isAuthenticated && !restaurantSelected) {
      console.log(" !restaurantSelected : ", restaurantSelected);
      console.log("isAuthenticated  : ", isAuthenticated);
      console.log("role: ", role ? role : "ロールが設定されていません");
      if (role === "admin") {
        return (
          <>
            <li>
              <Link to="/owner-restaurant" className="p-2 hover:text-black">
                Ownerレストラン一覧
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                onClick={() => handleLogout(role)}
                className="p-2 hover:text-black"
              >
                ログアウト
              </Link>
            </li>
          </>
        );
      } else if (role === "manager" || role === "employee") {
        return (
          <>
            <li>
              <Link to="/user-restaurant" className="p-2 hover:text-black">
                Userレストラン一覧
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                onClick={() => handleLogout(role)}
                className="p-2 hover:text-black"
              >
                ログアウト
              </Link>
            </li>
          </>
        );
      }
    }

    // 認証済みでレストランが選択されている場合
    if (isAuthenticated && restaurantSelected) {
      return (
        <>
          <li>{restaurantName}</li>
          {role === "admin" && (
            <>
              <li>
                <Link to="/owner-restaurant" className="p-2 hover:text-black">
                  レストラン一覧
                </Link>
              </li>
              <li>
                <Link
                  to={`/owner/${restaurantId}/add-employee`}
                  className="p-2 hover:text-black"
                >
                  従業員追加
                </Link>
              </li>
            </>
          )}
          {(role === "manager" || role === "employee") && (
            <>
              <li>
                <Link to={`/user/${restaurantId}/user-request-shift`}>
                  シフト
                </Link>
              </li>
              <li>
                <Link to="/user-restaurant" className="p-2 hover:text-black">
                  レストラン一覧
                </Link>
              </li>
            </>
          )}
          <li>
            <Link
              to="/register"
              onClick={() => handleLogout(role)}
              className="p-2 hover:text-black"
            >
              ログアウト
            </Link>
          </li>
        </>
      );
    }

    return null;
  };

  return (
    <header className="bg-teal-600 text-white shadow-md py-5">
      <div className="container mx-auto flex justify-end items-center">
        <ul className="flex space-x-4">{renderNavLinks()}</ul>
      </div>
    </header>
  );
};

export default Navigation;
