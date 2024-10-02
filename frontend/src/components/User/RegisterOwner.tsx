import React, { useState } from "react";
import { registerOwner } from "../../services/ownerService";
import RegisterOwnerPage from "../../pages/register/RegisterOwnerPage";
import { useNavigate } from "react-router-dom";

interface OwnerRegisterAuthenticated {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RegisterOwnerProps {
  name: string;
  email: string;
  password: string;
  restaurantName: string;
  location: string;
}

const RegisterOwner: React.FC<OwnerRegisterAuthenticated> = ({
  setIsAuthenticated,
}) => {
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

    const response = await registerOwner(formData);
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
