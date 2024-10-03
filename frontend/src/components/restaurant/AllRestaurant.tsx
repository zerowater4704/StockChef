import { useEffect, useState } from "react";
import { getAllRestaurant } from "../../services/restaurantService";
import { Link } from "react-router-dom";

interface Restaurant {
  _id: string;
  name: string;
  location: string;
}

interface AllRestaurantAuthenticated {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setRestaurantName: React.Dispatch<React.SetStateAction<string>>;
}

const AllRestaurant: React.FC<AllRestaurantAuthenticated> = ({
  setIsAuthenticated,
  setRestaurantName,
}) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]); // オブジェクトの配列を使用
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await getAllRestaurant();
        setIsAuthenticated(true);
        setRestaurants(response); // レストランのリストをセット
      } catch (error) {
        console.log("レストラン情報取得に失敗しました。");
        setErrors(["レストラン情報取得に失敗しました"]);
      }
    };

    fetchRestaurant();
  }, [setIsAuthenticated]);

  return (
    <>
      <h1>すべてのレストラン</h1>
      {errors.length > 0 && <p>{errors[0]}</p>}
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant._id}>
            <Link
              to={`/${restaurant._id}`}
              onClick={() => setRestaurantName(restaurant.name)}
            >
              <h2>{restaurant.name}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AllRestaurant;
