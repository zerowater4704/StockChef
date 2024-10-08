import axios from "axios";

const API_URL = "http://localhost:3000/api/restaurant";

// オーナーが従業員をレストランに参加させる
export const addEmployeeToRestaurant = async (employeeEmail: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { type: "custom", message: "ログインしてください" };
    }
    const response = await axios.post(
      `${API_URL}/employee`,
      { employeeEmail },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};

// 新しいレストラン追加
export const addNewRestaurant = async (data: {
  name: string;
  location: string;
}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { type: "custom", message: "ログインしてください" };
    }

    const response = await axios.post(`${API_URL}/newRestaurant`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};

// レストランに所属している従業員取得
export const getEmployeesByRestaurant = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { type: "custom", message: "ログインしてください" };
    }
    const response = await axios.get(`${API_URL}/employees`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};

// 特定のレストランの情報を取得
export const getRestaurantById = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { type: "custom", message: "ログインしてください" };
    }
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.restaurant;
  } catch (error: any) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};

// オーナーのすべてのレストラン取得
export const getAllRestaurant = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { type: "custom", message: "ログインしてください" };
    }

    const response = await axios.get(`${API_URL}/allRestaurant`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.restaurant;
  } catch (error: any) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};

// 特定のレストランの削除
export const deleteRestaurant = async (restaurantId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { type: "custom", message: "ログインしてください" };
    }
    const response = await axios.delete(`${API_URL}/${restaurantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};
