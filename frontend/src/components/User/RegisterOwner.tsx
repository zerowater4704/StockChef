import React, { useState } from "react";
import { registerOwner } from "../../services/ownerService";
import RegisterOwnerPage from "../../pages/register/RegisterOwnerPage";
import { useNavigate } from "react-router-dom";

interface RegisterOwnerProps {
  name: string;
  email: string;
  password: string;
  restaurantName: string;
  location: string;
}

const RegisterOwner: React.FC = ({}) => {
  const [formData, setFormData] = useState<RegisterOwnerProps>({
    name: "",
    email: "",
    password: "",
    restaurantName: "",
    location: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    name: "",
    email: "",
    password: "",
    restaurantName: "",
    location: "",
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrors({ ...errors, [name]: "" });

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    try {
      const response = await registerOwner(formData);
      console.log("APIレスポンス:", response);
      if (!response.type) {
        navigate("/login-owner");
      } else {
        if (response.type === "validation") {
          const newErrors = { ...errors };
          console.log("バリデーションエラー:", response.type);
          console.log("バリデーションエラー:", response.message);
          response.message.forEach((message: string, index: number) => {
            // メッセージの順番に応じて特定のフィールドに割り当てる
            const fields = Object.keys(errors);
            newErrors[fields[index]] = message;
          });

          setErrors(newErrors);
          return;
        } else if (response.type === "custom") {
          setServerError(response.message);
          return;
        } else if (response.type === "server") {
          setServerError(response.message);
          return;
        }
      }
    } catch (error) {
      console.error("catch ブロックに入ったエラー:", error);
      setServerError(
        "サーバーに接続できませんでした。後ほど再試行してください。"
      );
    }
  };

  return (
    <RegisterOwnerPage
      formData={formData}
      errors={errors}
      serverError={serverError}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default RegisterOwner;
