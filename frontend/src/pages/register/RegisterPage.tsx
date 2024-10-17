import React from "react";
import { Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen font-m-plus">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          新規登録
        </h1>
        <div className="flex justify-between">
          <Link
            to="/register-owner"
            className="font-medium hover:text-gray-700 py-2 px-4 rounded"
          >
            オーナー登録
          </Link>
          <Link
            to="/register-user"
            className="font-medium hover:text-gray-700 py-2 px-4 rounded"
          >
            従業員登録
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
