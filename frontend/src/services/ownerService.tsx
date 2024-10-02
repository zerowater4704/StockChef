import axios from "axios";

const API_URL = "http://localhost:3000/api/owner";

export const registerOwner = async (data: {
  name: string;
  email: string;
  password: string;
  restaurantName: string;
  location: string;
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

export const loginOwner = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    localStorage.setItem("token", response.data.token);
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
