import React, { useState } from "react";
import { registerUser } from "../../services/userService";
import RegisterUserPage from "../../pages/register/RegisterUserPage";
import { useNavigate } from "react-router-dom";

interface UserRegisterAuthenticated {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RegisterUserProps {
  name: string;
  email: string;
  password: string;
  role: "employee";
}

const RegisterUser: React.FC<UserRegisterAuthenticated> = ({
  setIsAuthenticated,
}) => {
  const [formData, setFormData] = useState<RegisterUserProps>({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    name: "",
    email: "",
    password: "",
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

    const response = await registerUser(formData);
    setIsAuthenticated(true);
    navigate("/login");

    if (response.type === "validation") {
      const newErrors = { ...errors };

      response.message.forEach((message: string, index: string) => {
        const field = response.validationErrors[index].param;
        newErrors[field] = message;
      });

      setErrors(newErrors);
    } else if (response.type === "custom") {
      setServerError(response.message);
    } else if (response.type === "server") {
      setServerError(response.message);
    }
  };

  return (
    <RegisterUserPage
      formData={formData}
      errors={errors}
      serverError={serverError}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default RegisterUser;
