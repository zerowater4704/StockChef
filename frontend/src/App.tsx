// import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState } from "react";
import RegisterPage from "./pages/register/RegisterPage";
import RegisterOwner from "./components/User/RegisterOwner";
import RegisterUser from "./components/User/RegisterUser";
import LoginOwner from "./components/User/LoginOwner";
import LoginUser from "./components/User/LoginUser";
import JoiningKey from "./components/User/JoiningKey";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/register">新規登録</Link>
          </li>
          <li>
            <Link to="/login-owner">オーナーログイン</Link>
          </li>
          <li>
            <Link to="/login-user">ユーザーログイン</Link>
          </li>
          <li>
            <Link to="/joiningKey">レストラン参加</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/register-owner"
          element={<RegisterOwner setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/register-user"
          element={<RegisterUser setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/login-owner"
          element={<LoginOwner setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/login-user"
          element={<LoginUser setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/joiningKey"
          element={<JoiningKey setIsAuthenticated={setIsAuthenticated} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
