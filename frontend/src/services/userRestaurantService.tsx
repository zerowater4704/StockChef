import axios from "axios";

const API_URL = "http://localhost:3000/api/user/restaurant";

export const getAllRestaurantByEmployee = async () => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      return { type: "custom", message: "ログインしてください" };
    }

    const response = await axios.get(`${API_URL}/userRestaurant`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.restaurants;
  } catch (error: any) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};

export const getRestaurantById = async (id: string) => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      return { type: "custom", message: "ログインしてください" };
    }

    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.restaurant;
  } catch (error: any) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};
