import React from "react";
import { Link } from "react-router-dom";

interface NavigationProps {
  role: string;
  restaurantName: string;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navigation: React.FC<NavigationProps> = ({
  role,
  restaurantName,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
  };

  const renderNavLinks = () => {
    if (role === "admin" && isAuthenticated) {
      return (
        <>
          <Link to="/">
            <li>{restaurantName ? `${restaurantName}` : "読み込み中..."}</li>
          </Link>
          <li>
            <Link to="/ingredients" className="p-2 hover:text-black">
              材料
            </Link>
          </li>
          <li>
            <Link to="/shifts" className="p-2 hover:text-black">
              シフト確認
            </Link>
          </li>
          <li>
            <Link to="/update-user" className="p-2 hover:text-black">
              ユーザー情報を更新
            </Link>
          </li>
          <Link to="/add-restaurant" className="p-2 hover:text-black">
            レストラン追加
          </Link>
          <li>
            <Link to="/all-restaurant" className="p-2 hover:text-black">
              レストラン一覧
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              onClick={handleLogout}
              className="p-2 hover:text-black"
            >
              ログアウト
            </Link>
          </li>
        </>
      );
    } else if ((role === "manager" || role === "employee") && isAuthenticated) {
      return (
        <>
          <li>{restaurantName ? `${restaurantName}` : "読み込み中..."}</li>
          <li>
            <Link to="/shifts" className="p-2 hover:text-black">
              シフト確認
            </Link>
          </li>
          <li>
            <Link to="/submit-shift" className="p-2 hover:text-black">
              シフト提出
            </Link>
          </li>
          <li>
            <Link to="/update-user" className="p-2 hover:text-black">
              ユーザー情報を更新
            </Link>
          </li>
          <li>
            <Link to="/joiningKey" className="p-2 hover:text-black">
              レストランに参加
            </Link>
          </li>
          <Link
            to="/register"
            onClick={handleLogout}
            className="p-2 hover:text-black"
          >
            ログアウト
          </Link>
        </>
      );
    } else {
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
  };

  return (
    <nav className="h-screen px-8 py-16 md:w-52 bg-slate-400 text-white rounded-r-md">
      <ul className="flex flex-col space-y-4">{renderNavLinks()}</ul>
    </nav>
  );
};

export default Navigation;
