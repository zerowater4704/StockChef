import { useEffect, useState } from "react";
import { getAllRestaurant } from "../../services/ownerRestaurantService";
import { Link, useNavigate } from "react-router-dom";

interface Restaurant {
  _id: string;
  name: string;
  location: string;
}

interface AllRestaurantAuthenticated {
  setRestaurantName: React.Dispatch<React.SetStateAction<string>>;
  setRestaurantSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

const AllRestaurant: React.FC<AllRestaurantAuthenticated> = ({
  setRestaurantName,
  setRestaurantSelected,
}) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]); // オブジェクトの配列を使用
  const [errors, setErrors] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      const response = await getAllRestaurant();
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
    navigate(`/owner/${restaurant._id}`);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center my-4">
        すべてのレストラン
      </h1>
      <Link to="/add-restaurant">レストラン使い</Link>
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
                <h2 className="text-xl mb-2">{restaurant.name}</h2>
                <p className="text-gray-700">{restaurant.location}</p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AllRestaurant;
