import axios from "axios";

const API_URL = "http://localhost:3000/api/category";

export const addCategory = async (categoryName: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return console.log("ログインしてください、tokenがありません");
    }

    const response = await axios.post(
      `${API_URL}/`,
      { name: categoryName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("addCategoryからのエラーです。", error);
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    console.log("getCategoriesからのエラーです。");
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("deleteCategoryのエラーです");
  }
};
