import React from "react";
import { useState } from "react";
import { joiningRestaurant } from "../../services/userService";
import { Link, useNavigate } from "react-router-dom";

interface JoiningKeyAuthenticated {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const JoiningKey: React.FC<JoiningKeyAuthenticated> = ({
  setIsAuthenticated,
}) => {
  const [joinKey, setJoinKey] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      const response = await joiningRestaurant(joinKey);
      if (!response.type) {
        setIsAuthenticated(true);
        navigate("/");
      } else {
        if (response.type === "validation") {
          setErrors(response.message);
        } else if (response.type === "custom") {
          setErrors([response.message]);
        } else if (response.type === "server") {
          setErrors([response.message]);
        }
      }
    } catch (error: any) {
      setErrors(["予期せぬエラーが発生しました"]);
    }
  };

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case "joinKey":
        setJoinKey(value);
        break;
      default:
        break;
    }

    if (field === "joinKey" && value) {
      setErrors(
        errors.filter((error) => error !== "レストランが見つかりません")
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>レストランキーを入力してください</label>
      <input
        type="text"
        name="joinKey"
        value={joinKey}
        onChange={(e) => handleChange("joinKey", e.target.value)}
      />
      <button type="submit">参加</button>
      <Link to="/register">戻る</Link>

      {errors.length > 0 && (
        <div style={{ color: "red" }}>
          {errors.map((error, index) => {
            return <p key={index}>{error}</p>;
          })}
        </div>
      )}
    </form>
  );
};

export default JoiningKey;
