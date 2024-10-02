import React from "react";
import { Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-green-100 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">新規登録</h1>
        <div className="flex justify-between">
          <Link
            to="/register-owner"
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            オーナー登録
          </Link>
          <Link
            to="/register-user"
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            従業員登録
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
