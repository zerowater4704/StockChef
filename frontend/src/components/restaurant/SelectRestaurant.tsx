import { useEffect, useState } from "react";
import { getRestaurantById } from "../../services/ownerRestaurantService";
import { useParams } from "react-router-dom";

interface Restaurant {
  name: string;
  location: string;
}

interface AllRestaurantAuthenticated {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectRestaurant: React.FC<AllRestaurantAuthenticated> = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      try {
        const response = await getRestaurantById(id as string);
        setRestaurant(response);
      } catch (error) {
        console.log("エラーがあります", error);
      }
    };

    fetchRestaurant();
  }, [id]);

  return (
    <>
      <div>
        {restaurant ? (
          <>
            <h1>{restaurant.name}</h1>
            <p>selectレストランページ</p>
          </>
        ) : (
          <p>読み込み中....</p>
        )}
      </div>
    </>
  );
};

export default SelectRestaurant;
