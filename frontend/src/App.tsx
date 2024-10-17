// import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useState } from "react";
import Navigation from "./components/component/Navigation";
import AppRoutes from "./components/component/AppRoutes";
import axios from "axios";

axios.defaults.withCredentials = true;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [restaurantSelected, setRestaurantSelected] = useState<boolean>(false);

  useEffect(() => {
    console.log("useEffect triggered");
    const storedRole = localStorage.getItem("role");
    // Roleに基づいて、適切なトークンを選択
    let token: string | null = null;

    if (storedRole === "admin") {
      token = localStorage.getItem("ownerToken"); // オーナー用のトークンを取得
    } else if (storedRole === "employee" || storedRole === "manager") {
      token = localStorage.getItem("userToken"); // ユーザー用のトークンを取得
    }

    const storedRestaurantId = localStorage.getItem("restaurantId");
    const storedRestaurantName = localStorage.getItem("restaurantName");

    if (storedRole) {
      setRole(storedRole);
      console.log("storedRole: ", storedRole);
    }

    if (storedRestaurantId) {
      setRestaurantId(storedRestaurantId);
      setRestaurantSelected(true);
    } else {
      setRestaurantSelected(false);
    }

    if (!storedRestaurantName) {
      setRestaurantName("");
    } else {
      setRestaurantSelected(true);
      setRestaurantName(storedRestaurantName);
    }
  }, []);

  return (
    <Router>
      <Navigation
        role={role}
        restaurantName={restaurantName}
        restaurantId={restaurantId}
        restaurantSelected={restaurantSelected}
        isAuthenticated={isAuthenticated}
        setRestaurantSelected={setRestaurantSelected}
        setIsAuthenticated={setIsAuthenticated}
      />
      <div className="flex items-center justify-center h-screen">
        <AppRoutes
          setRestaurantSelected={setRestaurantSelected}
          setIsAuthenticated={setIsAuthenticated}
          setRestaurantName={setRestaurantName}
          setRole={setRole}
        />
      </div>
    </Router>
  );
};

export default App;
