import React, { useState } from "react";
import { addEmployeeToRestaurant } from "../../services/ownerRestaurantService";

interface AddEmployeeAuthenticated {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddEmployee: React.FC<AddEmployeeAuthenticated> = ({
  setIsAuthenticated,
}) => {
  const [employeeEmail, setEmployeeEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setErrors("");

    try {
      const response = await addEmployeeToRestaurant(employeeEmail);
      if (response.type === "custom") {
        setErrors(response.message);
      } else if (response.type === "server") {
        setErrors("予期せぬエラーが発生しました");
      } else {
        setMessage("従業員がついかできました");
        setIsAuthenticated(true);
      }
    } catch (error) {
      setErrors("従業員追加に失敗しました");
    }
  };
  return (
    <div>
      <h2>従業員追加</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>従業員メールアドレス</label>
          <input
            type="email"
            id="employeeEmail"
            value={employeeEmail}
            onChange={(e) => setEmployeeEmail(e.target.value)}
            required
          />
        </div>
        {message && <p>{message}</p>}
        {errors && <p>{errors}</p>}
        <div>
          <button type="submit">従業員追加</button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
