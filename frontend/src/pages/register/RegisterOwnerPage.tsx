import React from "react";
import { Link } from "react-router-dom";
import InputForm from "../../components/User/InputForm";

interface RegisterOwnerProps {
  name: string;
  email: string;
  password: string;
  restaurantName: string;
  location: string;
}

interface RegisterOwnerPageProps {
  formData: RegisterOwnerProps;
  errors: { [key: string]: string };
  serverError: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const RegisterOwnerPage: React.FC<RegisterOwnerPageProps> = ({
  formData,
  errors,
  serverError,
  handleChange,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <InputForm
        label="名前"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      <InputForm
        label="メールアドレス"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <InputForm
        label="パスワード"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <InputForm
        label="店舗名"
        type="text"
        name="restaurantName"
        value={formData.restaurantName}
        onChange={handleChange}
        error={errors.restaurantName}
      />
      <InputForm
        label="住所"
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        error={errors.location}
      />
      {serverError && <p>{serverError}</p>}
      <Link to="/register">戻る</Link>
      <button type="submit">登録</button>
    </form>
  );
};

export default RegisterOwnerPage;
