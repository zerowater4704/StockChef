import axios from "axios";

const API_URL = "http://localhost:3000/api/user";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: "employee";
}) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      const errorsMessages = validationErrors.map(
        (err: { msg: string }) => err.msg
      );
      return { type: "validation", message: errorsMessages };
    }

    if (error.response && error.response.data && error.response.data.message) {
      return { type: "custom", message: error.response.data.message };
    }

    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("userId", response.data.user.id);
      console.log(response.data);
      return response.data;
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      const errorsMessages = validationErrors.map(
        (err: { msg: string }) => err.msg
      );
      return { type: "validation", message: errorsMessages };
    }

    if (error.response && error.response.data && error.response.data.message) {
      return { type: "custom", message: error.response.data.message };
    }

    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};

export const joiningRestaurant = async (joiningKey: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { type: "custom", message: "ログインしてください" };
    }

    const response = await axios.post(
      `${API_URL}/joinRestaurant`,
      {
        joiningKey,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      const errorsMessages = validationErrors.map(
        (err: { msg: string }) => err.msg
      );
      return { type: "validation", message: errorsMessages };
    }

    if (error.response && error.response.data && error.response.data.message) {
      return { type: "custom", message: error.response.data.message };
    }

    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};
