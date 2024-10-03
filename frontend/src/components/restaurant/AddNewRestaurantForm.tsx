import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addNewRestaurant } from "../../services/restaurantService";

interface AddNewRestaurantAuthenticated {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddNewRestaurantForm: React.FC<AddNewRestaurantAuthenticated> = ({
  setIsAuthenticated,
}) => {
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      const response = await addNewRestaurant({ name, location });
      if (!response.type) {
        setIsAuthenticated(true);
        navigate("/");
      } else {
        if (response.type === "custom") {
          setErrors([response.message]);
        } else if (response.type === "server") {
          setErrors([response.message]);
        }
      }
    } catch (error: any) {
      setErrors(["予期せぬエラーが発生しました"]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>レストラン追加</h1>
      <div>
        <label>レストラン名</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>場所</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      {errors.length > 0 && (
        <div>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <Link to="/">戻る</Link>
      <button type="submit">追加</button>
    </form>
  );
};

export default AddNewRestaurantForm;
