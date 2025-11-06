import React, { useState, useEffect } from "react";
import "./FoodSelection.css";

export default function FoodSelection({
  selectedSeats,
  seatTotal, // Lưu ý: VND
  onComplete,
  selectedFoods,
  setSelectedFoods,
  onBack,
}) {
  const [foodMenu, setFoodMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/foods";

  useEffect(() => {
    const fetchFoods = async () => {
      // ... (Phần gọi API giữ nguyên như trước, lấy giá USD)
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const processedMenu = result.data.map((item) => ({
          name: item.food_name,
          price: item.base_price,
          id: item.food_id,
        }));
        setFoodMenu(processedMenu);
        setError(null);
      } catch (e) {
        console.error("Failed to fetch food menu:", e);
        setError("Không thể tải menu đồ ăn. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const updateFoodQuantity = (foodName, quantity) => {
    const qty = Math.max(0, quantity);
    const updatedFoods = { ...selectedFoods };
    if (qty === 0) {
      delete updatedFoods[foodName];
    } else {
      updatedFoods[foodName] = qty;
    }
    setSelectedFoods(updatedFoods);
  };

  const foodTotal = Object.entries(selectedFoods).reduce((sum, [name, qty]) => {
    const item = foodMenu.find((x) => x.name === name);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  if (loading) return <div>Đang tải menu đồ ăn...</div>;
  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;

  return (
    <div className="food-selection">
      <h4>Food Selection (Giá bằng USD)</h4>
      <div className="food-list">
        {foodMenu.map((item) => (
          // Thêm lớp 'food-item-grid' để điều khiển căn chỉnh
          <div className="food-item food-item-grid" key={item.id || item.name}>
            <span className="food-name">{item.name}</span>
            {/* Thêm lớp 'food-price-col' để căn chỉnh giá */}
            <span className="food-price food-price-col">
              ${formatCurrency(item.price)}
            </span>

            {/* THAY THẾ INPUT NUMBER BẰNG BỘ ĐẾM NGANG */}
            <div className="quantity-controls">
              {/* Nút TRỪ */}
              <button
                onClick={() =>
                  updateFoodQuantity(
                    item.name,
                    (selectedFoods[item.name] || 0) - 1
                  )
                }
                disabled={(selectedFoods[item.name] || 0) === 0}
              >
                –
              </button>

              {/* Hiển thị số lượng */}
              <span className="quantity-display">
                {selectedFoods[item.name] || 0}
              </span>

              {/* Nút CỘNG */}
              <button
                onClick={() =>
                  updateFoodQuantity(
                    item.name,
                    (selectedFoods[item.name] || 0) + 1
                  )
                }
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="food-summary">
        {/* Giữ nguyên hiển thị tiền VND */}
        <p>Seat total: {(seatTotal || 0).toLocaleString("vi-VN")} VND</p>

        {/* Giữ nguyên hiển thị tiền Food USD */}
        <p>Food total: {formatCurrency(foodTotal)}</p>

        <p>
          <strong>
            Grand total:{" "}
            {/* ➡️ THỰC HIỆN PHÉP CỘNG TRỰC TIẾP và hiển thị theo định dạng USD */}
            {formatCurrency((seatTotal || 0) + foodTotal)}
          </strong>
        </p>
      </div>
      {/* ... (Phần nút bấm giữ nguyên) ... */}
      <div className="total-buttons">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
        )}

        <button
          disabled={!selectedSeats.length}
          onClick={() =>
            onComplete({
              foods: selectedFoods,
              total: foodTotal,
            })
          }
          className="total-button"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
