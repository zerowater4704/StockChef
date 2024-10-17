import axios from "axios";

const API_URL = "http://localhost:3000/api/user/shift";

// ユーザーがシフトのリクエストを送る
export const requestShifts = async (data: {
  year: number;
  month: number;
  shifts: any;
}) => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }
    const response = await axios.post(`${API_URL}/requestShifts`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return {
      type: "error",
      message: error.response?.data?.message || "予期せぬエラーが発生しました",
    };
  }
};

//　ユーザーが確定前のシフト確認
export const getPendingShifts = async (year: number, month: number) => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }

    const response = await axios.get(
      `${API_URL}/pending?year=${year}&month=${month}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("getPendingShifts", error);
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};

// ユーザーが確定後のシフト確認
export const getConfirmedShifts = async (year: number, month: number) => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }

    const response = await axios.get(
      `${API_URL}/confirmed?year=${year}&month=${month}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error: any) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};

// シフト更新(修正)
export const updateShift = async (data: {
  year: number;
  month: number;
  date: string;
  startTime: string;
  finishTime: string;
}) => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }

    const response = await axios.put(`${API_URL}/updateShift`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error: any) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};

export const deleteShift = async (data: {
  year: number;
  month: number;
  date: string;
}) => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }

    const response = await axios.delete(`${API_URL}/deleteShift`, {
      headers: { Authorization: `Bearer ${token}` },
      data,
    });

    return response.data;
  } catch (error: any) {
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};
