// import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useState } from "react";
import Navigation from "./components/component/Navigation";
import AppRoutes from "./components/component/AppRoutes";
import { getAllRestaurant } from "./services/restaurantService";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [restaurantName, setRestaurantName] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (token && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }

    getAllRestaurant().then((restaurants) => {
      if (restaurants.length > 0) {
        setRestaurantName(restaurants[0].name);
      }
    });
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="flex">
        <Navigation
          role={role}
          restaurantName={restaurantName}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <div className="flex-grow p-4">
          <AppRoutes
            setIsAuthenticated={setIsAuthenticated}
            setRestaurantName={setRestaurantName}
          />
        </div>
      </div>
    </Router>
  );
};

export default App;
