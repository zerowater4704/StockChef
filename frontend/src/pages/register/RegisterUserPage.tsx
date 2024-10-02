import React from "react";
import { Link } from "react-router-dom";
import InputForm from "../../components/User/InputForm";

interface RegisterUserProps {
  name: string;
  email: string;
  password: string;
  role: "employee";
}

interface RegisterUserPageProps {
  formData: RegisterUserProps;
  errors: { [key: string]: string };
  serverError: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const RegisterUserPage: React.FC<RegisterUserPageProps> = ({
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
      <button type="submit">登録</button>
      {serverError && <p>{serverError}</p>}
      <Link to="/register">戻る</Link>
    </form>
  );
};

export default RegisterUserPage;
