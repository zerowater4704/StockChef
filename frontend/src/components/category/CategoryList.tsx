import { useEffect, useState } from "react";
import {
  addCategory,
  deleteCategory,
  getCategories,
} from "../../services/categoryService";
import CategoryModal from "./CategoryModal";
import {
  addItemToCategory,
  deleteItem,
  updateItem,
} from "../../services/itemService";

interface Category {
  _id: string;
  name: string;
  items: Item[];
}

interface Item {
  _id: string;
  name: string;
  stock: number;
}

interface AddCategoryAuthenticated {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoryList: React.FC<AddCategoryAuthenticated> = ({
  setIsAuthenticated,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [addingItem, setAddingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: "", stock: 0 });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedStock, setEditedStock] = useState<number | null>(null);

  const fetchCategories = async () => {
    const response = await getCategories();
    setCategories(
      Array.isArray(response.categories) ? response.categories : []
    );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategory = async (categoryName: string) => {
    const response = await addCategory(categoryName);
    if (response) {
      fetchCategories();
      setIsAuthenticated(true);
    } else {
      setShowModal(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const response = await deleteCategory(id);
    if (response) {
      fetchCategories();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddItem = async (id: string) => {
    if (!newItem.name || newItem.stock < 0) {
      alert("アイテム名と在庫数を入力してください");
      return;
    }

    const response = await addItemToCategory(id, newItem);

    if (response) {
      fetchCategories();
      setAddingItem(null);
      setNewItem({ name: "", stock: 0 });
    }
  };

  const handelUpdateItem = async (
    id: string,
    name: string,
    newStock: number
  ) => {
    await updateItem(id, { name, stock: newStock });
    fetchCategories();
    setEditingItemId(null);
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("本当にこのアイテムを削除しますか？")) {
      await deleteItem(id);
      fetchCategories();
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">カテゴリ一覧</h1>
      <button onClick={() => setShowModal(true)}>追加</button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category) => (
            <div
              className="bg-white p-4 shadow-md rounded-lg flex flex-col"
              key={category._id}
            >
              <div className=" flex justify-between">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <button onClick={() => handleDeleteCategory(category._id)}>
                  削除
                </button>
              </div>
              <div>
                {category.items.length > 0 && (
                  <ul className="w-full">
                    {category.items.map((item) => (
                      <li
                        key={item._id}
                        className="flex justify-between items-center border-b border-gray-300 py-2"
                      >
                        <span>{item.name}</span>

                        {editingItemId === item._id ? (
                          <input
                            type="number"
                            value={
                              editedStock !== null ? editedStock : item.stock
                            }
                            onChange={(e) =>
                              setEditedStock(Number(e.target.value))
                            }
                          />
                        ) : (
                          <span>{item.stock}</span>
                        )}

                        {editingItemId === item._id ? (
                          <button
                            onClick={() =>
                              handelUpdateItem(
                                item._id,
                                item.name,
                                editedStock ?? item.stock
                              )
                            }
                          >
                            決定
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingItemId(item._id);
                              setEditedStock(item.stock);
                            }}
                          >
                            編集
                          </button>
                        )}
                        <button onClick={() => handleDeleteItem(item._id)}>
                          削除
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {addingItem === category._id ? (
                  <div className="w-full mt-4">
                    <input
                      type="text"
                      className="border border-gray-300 p-2 rounded w-full mb-2"
                      placeholder="アイテム名"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className="border border-gray-300 p-2 rounded w-full mb-2"
                      placeholder="在庫数"
                      value={newItem.stock}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          stock: Number(e.target.value),
                        })
                      }
                    />
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-700"
                      onClick={() => handleAddItem(category._id)}
                    >
                      追加
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded w-full mt-2 hover:bg-gray-700"
                      onClick={() => setAddingItem(null)}
                    >
                      キャンセル
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setAddingItem(category._id)}>
                    アイテム追加
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>カテゴリがありません</p>
        )}
      </div>

      {showModal && (
        <CategoryModal
          onClose={handleCloseModal}
          onAddCategory={handleCategory}
        />
      )}
    </div>
  );
};

export default CategoryList;
