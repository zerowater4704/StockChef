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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto p-4 bg-white shadow-md rounded"
    >
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
      <div className="flex items-center justify-between">
        <Link
          to="/register"
          className="hover:text-red-700 py-2 px-4 focus:shadow-outline focus:outline-none"
        >
          戻る
        </Link>
        {serverError && (
          <p className="text-red-500 text-xs font-bold mt-2">{serverError}</p>
        )}
        <button
          type="submit"
          className="hover:text-lime-700 py-2 px-4 focus:shadow-outline focus:outline-none"
        >
          登録
        </button>
      </div>
    </form>
  );
};

export default RegisterOwnerPage;
