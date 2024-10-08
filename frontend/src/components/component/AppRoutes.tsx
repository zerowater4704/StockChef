import React from "react";
import { Route, Routes } from "react-router-dom";
import RegisterPage from "../../pages/register/RegisterPage";
import RegisterOwner from "../../components/User/RegisterOwner";
import RegisterUser from "../../components/User/RegisterUser";
import LoginOwner from "../../components/User/LoginOwner";
import LoginUser from "../../components/User/LoginUser";
import JoiningKey from "../../components/User/JoiningKey";
import AddNewRestaurantForm from "../restaurant/AddNewRestaurantForm";
import AllRestaurant from "../restaurant/AllRestaurant";
import CategoryList from "../category/CategoryList";
import SubmitShift from "../shift/SubmitShift";

interface AppRoutesProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setRestaurantName: React.Dispatch<React.SetStateAction<string>>;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  setIsAuthenticated,
  setRestaurantName,
}) => {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-owner" element={<RegisterOwner />} />
      <Route path="/register-user" element={<RegisterUser />} />
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
      <Route
        path="/add-restaurant"
        element={
          <AddNewRestaurantForm setIsAuthenticated={setIsAuthenticated} />
        }
      />
      <Route
        path="all-restaurant"
        element={
          <AllRestaurant
            setIsAuthenticated={setIsAuthenticated}
            setRestaurantName={setRestaurantName}
          />
        }
      />
      <Route
        path="add-category"
        element={<CategoryList setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route path="/submit-shift" element={<SubmitShift />} />
    </Routes>
  );
};

export default AppRoutes;
