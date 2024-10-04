import axios from "axios";

const API_URL = "http://localhost:3000/api/item";

export const addItemToCategory = async (
  categoryId: string,
  itemData: { name: string; stock: number }
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return console.log("ログインしてください、tokenがありません");
    }
    const response = await axios.post(
      `${API_URL}/${categoryId}/item`,
      itemData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("addItemToCategory エラーです", error);
  }
};

export const updateItem = async (
  id: string,
  updateData: { name: string; stock: number }
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return console.log("ログインしてください、tokenがありません");
    }

    const response = await axios.put(`${API_URL}/${id}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return console.log("updateItemのエラーです", error);
  }
};

export const deleteItem = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return console.log("ログインしてください、tokenがありません");
    }
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    response.data;
  } catch (error) {
    return console.log("deleteItem エラーです", error);
  }
};
