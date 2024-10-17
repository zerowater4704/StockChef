import React from "react";
import { Route, Routes } from "react-router-dom";
import RegisterPage from "../../pages/register/RegisterPage";
import RegisterOwner from "../../components/User/RegisterOwner";
import RegisterUser from "../../components/User/RegisterUser";
import LoginOwner from "../../components/User/LoginOwner";
import LoginUser from "../../components/User/LoginUser";
import AddNewRestaurantForm from "../restaurant/AddNewRestaurantForm";
import AllRestaurant from "../restaurant/AllRestaurant";
import CategoryList from "../category/CategoryList";
import SelectRestaurant from "../restaurant/SelectRestaurant";
import UserAllRestaurant from "../restaurant/UserAllRestaurant";
import AddEmployee from "../restaurant/AddEmployee";
import UserShiftCalendar from "../shifts/UserShiftCalendar";

interface AppRoutesProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setRestaurantName: React.Dispatch<React.SetStateAction<string>>;
  setRestaurantSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setRole: React.Dispatch<React.SetStateAction<string>>;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  setIsAuthenticated,
  setRestaurantName,
  setRestaurantSelected,
  setRole,
}) => {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-owner" element={<RegisterOwner />} />
      <Route path="/register-user" element={<RegisterUser />} />
      <Route
        path="/login-owner"
        element={
          <LoginOwner
            setIsAuthenticated={setIsAuthenticated}
            setRole={setRole}
          />
        }
      />
      <Route
        path="/login-user"
        element={
          <LoginUser
            setIsAuthenticated={setIsAuthenticated}
            setRole={setRole}
          />
        }
      />
      <Route
        path="/owner-restaurant"
        element={
          <AllRestaurant
            setRestaurantName={setRestaurantName}
            setRestaurantSelected={setRestaurantSelected}
          />
        }
      />
      <Route
        path="/owner/:id"
        element={<SelectRestaurant setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route
        path="/owner/:id/add-employee"
        element={<AddEmployee setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route
        path="/add-restaurant"
        element={
          <AddNewRestaurantForm setIsAuthenticated={setIsAuthenticated} />
        }
      />
      <Route
        path="add-category"
        element={<CategoryList setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route
        path="/:id"
        element={<SelectRestaurant setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route
        path="/user-restaurant"
        element={
          <UserAllRestaurant
            setRestaurantName={setRestaurantName}
            setRestaurantSelected={setRestaurantSelected}
          />
        }
      />
      <Route
        path="/user/:id/user-request-shift"
        element={<UserShiftCalendar setIsAuthenticated={setIsAuthenticated} />}
      />
    </Routes>
  );
};

export default AppRoutes;
