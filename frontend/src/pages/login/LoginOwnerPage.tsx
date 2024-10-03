import { Link } from "react-router-dom";
import InputForm from "../../components/User/InputForm";

interface LoginOwnerProps {
  email: string;
  password: string;
  errors: string[];
  handleChange: (field: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const LoginOwnerPage: React.FC<LoginOwnerProps> = ({
  email,
  password,
  errors,
  handleChange,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">ログイン</button>
      <Link to="/register">新規登録</Link>

      {errors.length > 0 && (
        <div style={{ color: "red" }}>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </form>
  );
};

export default LoginOwnerPage;
