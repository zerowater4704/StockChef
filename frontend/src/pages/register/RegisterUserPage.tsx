import React from "react";
import { Link } from "react-router-dom";
import InputForm from "../../components/User/InputForm";

interface RegisterUserProps {
  name: string;
  email: string;
  password: string;
  role: "employee" | "manager";
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
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          役割
        </label>
        <div className="flex items-center">
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="role"
              value="employee"
              checked={formData.role === "employee"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2 text-gray-700">従業員</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="role"
              value="manager"
              checked={formData.role === "manager"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2 text-gray-700">マネージャー</span>
          </label>
        </div>
        {errors.role && (
          <p className="text-red-500 text-xs font-bold mt-2">{errors.role}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <Link
          to="/register"
          className="hover:text-red-700 font-bold py-2 px-4 focus:shadow-outline focus:outline-none"
        >
          戻る
        </Link>
        {serverError && (
          <p className="text-red-500 text-xs font-bold mt-2">{serverError}</p>
        )}
        <button
          type="submit"
          className="hover:text-lime-700 font-bold py-2 px-4 focus:shadow-outline focus:outline-none"
        >
          登録
        </button>
      </div>
    </form>
  );
};

export default RegisterUserPage;
