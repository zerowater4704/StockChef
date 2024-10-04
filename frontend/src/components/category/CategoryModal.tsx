import { useState } from "react";

interface CategoryModalProps {
  onClose: () => void;
  onAddCategory: (categoryNama: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  onClose,
  onAddCategory,
}) => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName) {
      onAddCategory(categoryName);
      setCategoryName("");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">カテゴリ追加</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full mb-4"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="カテゴリ名"
          />
          <div className="flex justify-end space-x-4">
            <button type="submit">追加</button>
            <button type="button" onClick={onClose}>
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
