import axios from "axios";

const API_URL = "http://localhost:3000/api/user";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.endsWith("/userLogout")) {
      return Promise.reject(error); // ログアウトはインターセプトしない
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    }
    try {
      const { data } = await axios.post(
        `${API_URL}/userToken`,
        {},
        { withCredentials: true }
      );
      const newAccessToken = data.accessToken;
      localStorage.setItem("userToken", newAccessToken);
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return axios(originalRequest);
    } catch (err) {
      localStorage.removeItem("userToken");
      window.location.href = "/login-user";
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: "employee" | "manager";
}) => {
  try {
    const response = await instance.post("/signup", data);
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
    const response = await instance.post("/login", data);
    const { userAccessToken, user } = response.data;
    if (userAccessToken) {
      localStorage.setItem("userToken", userAccessToken);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);

      if (user.restaurantId && user.restaurantId.length > 0) {
        localStorage.setItem("restaurantId", user.restaurantId);
        localStorage.setItem("restaurantName", user.restaurantName);
      } else {
        console.log("まだ参加しているレストランがありません");
      }
    }
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

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("userToken"); // ユーザー用のトークンが取得できているか確認
    if (!token) {
      throw new Error("トークンがありません");
    }
    await instance.post(
      "/userLogout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    localStorage.removeItem("restaurantId");
    localStorage.removeItem("restaurantName");
  } catch (error) {
    console.error("ユーザーのログアウト中にエラーが発生しました", error);
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
