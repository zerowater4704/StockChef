import React, { useState } from "react";
import { registerUser } from "../../services/userService";
import RegisterUserPage from "../../pages/register/RegisterUserPage";
import { useNavigate } from "react-router-dom";

interface RegisterUserProps {
  name: string;
  email: string;
  password: string;
  role: "employee";
}

const RegisterUser: React.FC = ({}) => {
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
    setServerError(null);
    try {
      const response = await registerUser(formData);
      console.log(response);
      if (!response.type) {
        navigate("/login-user");
      } else {
        if (response.type === "validation") {
          const newErrors = { ...errors };
          response.message.forEach((message: string, index: number) => {
            newErrors[Object.keys(errors)[index]] = message;
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
      console.log("catch error");
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
