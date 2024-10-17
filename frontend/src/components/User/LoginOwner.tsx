import { loginOwner } from "../../services/ownerService";
import { useState } from "react";
import LoginOwnerPage from "../../pages/login/LoginOwnerPage";
import { useNavigate } from "react-router-dom";

interface LoginOwnerAuthenticated {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setRole: React.Dispatch<React.SetStateAction<string>>;
}

const LoginOwner: React.FC<LoginOwnerAuthenticated> = ({
  setIsAuthenticated,
  setRole,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      const response = await loginOwner({ email, password });
      console.log("LoginOwner: ", response);
      if (!response.type) {
        localStorage.setItem("role", response.owner.role);
        setRole(response.owner.role);
        setIsAuthenticated(true);

        navigate("/owner-restaurant");
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
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }

    if (field === "email" && value) {
      setErrors(
        errors.filter(
          (error) => error !== "有効なメールアドレスを入力してください"
        )
      );
    } else if (field === "password" && value) {
      setErrors(
        errors.filter((error) => error !== "パスワードが間違っています")
      );
    }
  };

  return (
    <LoginOwnerPage
      email={email}
      password={password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errors={errors}
    />
  );
};

export default LoginOwner;
