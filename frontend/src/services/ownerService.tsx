import axios from "axios";

const API_URL = "http://localhost:3000/api/owner";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    }
    try {
      const { data } = await axios.post(
        `${API_URL}/ownerToken`,
        {},
        { withCredentials: true }
      );
      const newAccessToken = data.accessToken;
      localStorage.setItem("ownerToken", newAccessToken);
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return axios(originalRequest);
    } catch (err) {
      localStorage.removeItem("ownerToken");
      window.location.href = "/login-owner";
    }
    return Promise.reject(error);
  }
);

export const registerOwner = async (data: {
  name: string;
  email: string;
  password: string;
  restaurantName: string;
  location: string;
}) => {
  try {
    const response = await instance.post("/signup", data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      const errorsMessages = validationErrors.map((err: any) => err.msg);
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
    const response = await instance.post("/login", data);
    const { ownerAccessToken, owner } = response.data;

    localStorage.setItem("ownerToken", ownerAccessToken);
    localStorage.setItem("role", owner.role);
    if (ownerAccessToken) {
      localStorage.getItem("ownerToken");
      localStorage.getItem("role");

      if (owner.restaurantId && owner.restaurantId.length > 0) {
        localStorage.setItem("restaurantId", owner.restaurantId);
        localStorage.setItem("restaurantName", owner.restaurantName);
      } else {
        localStorage.removeItem("restaurantId");
        localStorage.removeItem("restaurantName");
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

export const logoutOwner = async () => {
  try {
    await instance.post(
      "/ownerLogout",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ownerToken")}`,
        },
        withCredentials: true,
      }
    );
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("role");
    localStorage.removeItem("restaurantId");
    localStorage.removeItem("restaurantName");
  } catch (error) {
    console.error("オーナーのログアウト中にエラーが発生しました", error);
    return { type: "server", message: "予期せぬエラーが発生しました" };
  }
};
