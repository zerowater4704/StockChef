import { Link } from "react-router-dom";
import InputForm from "../../components/User/InputForm";

interface LoginUserPageProps {
  email: string;
  password: string;
  errors: string[];
  handleChange: (field: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const LoginUserPage: React.FC<LoginUserPageProps> = ({
  email,
  password,
  errors,
  handleChange,
  handleSubmit,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto p-4 bg-white shadow-md rounded"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        従業員ログイン
      </h2>
      <InputForm
        label="メールアドレス"
        type="email"
        name="email"
        value={email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <InputForm
        label="パスワード"
        type="password"
        name="password"
        value={password}
        onChange={(e) => handleChange("password", e.target.value)}
      />
      {errors.length > 0 && (
        <div style={{ color: "red" }}>
          {errors.map((error, index) => (
            <p key={index} className="text-red-500 text-xs font-bold mt-2">
              {error}
            </p>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <Link
          to="/register"
          className="hover:text-red-700 py-2 px-4 focus:shadow-outline focus:outline-none"
        >
          戻る
        </Link>
        <button
          type="submit"
          className="hover:text-lime-700 py-2 px-4 focus:shadow-outline focus:outline-none"
        >
          ログイン
        </button>
      </div>
    </form>
  );
};

export default LoginUserPage;
