import axios from "axios";

const API_URL = "http://localhost:3000/api/owner";

export const addNewRestaurant = async (data: {
  name: string;
  location: string;
}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { type: "custom", message: "ログインしてください" };
    }

    const response = await axios.post(`${API_URL}/addNewRestaurant`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};

export const getAllRestaurant = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { type: "custom", message: "ログインしてください" };
    }

    const response = await axios.get(`${API_URL}/restaurant`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.restaurant;
  } catch (error: any) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};

export const getRestaurant = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/restaurant/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.restaurant;
  } catch (error: any) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};
