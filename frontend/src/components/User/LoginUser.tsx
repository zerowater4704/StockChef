import { loginUser } from "../../services/userService";
import { useState } from "react";
import LoginUserPage from "../../pages/login/LoginUserPage";
import { useNavigate } from "react-router-dom";

interface LoginUserAuthenticated {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginUser: React.FC<LoginUserAuthenticated> = ({
  setIsAuthenticated,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      const response = await loginUser({ email, password });
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
    <LoginUserPage
      email={email}
      password={password}
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default LoginUser;
