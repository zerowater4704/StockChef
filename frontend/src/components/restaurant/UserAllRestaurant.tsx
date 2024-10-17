import { useEffect, useState } from "react";
import { getAllRestaurantByEmployee } from "../../services/userRestaurantService";
import { useNavigate } from "react-router-dom";

interface Restaurant {
  _id: string;
  name: string;
}

interface UserAllRestaurantProps {
  setRestaurantName: React.Dispatch<React.SetStateAction<string>>;
  setRestaurantSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserAllRestaurant: React.FC<UserAllRestaurantProps> = ({
  setRestaurantName,
  setRestaurantSelected,
}) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      const response = await getAllRestaurantByEmployee();
      console.log("UserAllRestaurant response: ", response);
      if (Array.isArray(response)) {
        setRestaurants(response);
      } else {
        setErrors("レストラン情報取得に失敗しました");
      }
    };
    fetchRestaurant();
  }, []);

  const handelRestaurantSelect = (restaurant: Restaurant) => {
    setRestaurantName(restaurant.name);
    setRestaurantSelected(true);
    localStorage.setItem("restaurantId", restaurant._id);
    localStorage.setItem("restaurantName", restaurant.name);

    navigate(`/user/${restaurant._id}/user-request-shift`);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center my-4">
        すべてのレストラン
      </h1>
      {errors && <p className="text-red-500 text-center">{errors}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gpa-6 p-4">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            <button
              onClick={() => handelRestaurantSelect(restaurant)}
              className="w-full h-full text-left"
            >
              <div className="p-4">
                <h1 className="text-xl mb-2">{restaurant.name}</h1>
                <p className="text-gray-700">Userレストラン</p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserAllRestaurant;
