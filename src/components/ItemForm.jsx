import { useState } from "react";
import "../css/dashboard.css";
function ItemForm({ addItem }) {
  const [value, setValue] = useState("");

  // handles adding a new item
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addItem(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={value}
        size="11"
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}

export default ItemForm;
