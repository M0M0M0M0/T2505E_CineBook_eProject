import React, { useState } from "react";
import "./FoodSelection.css";

export default function FoodSelection({
  selectedSeats,
  seatTotal,
  onComplete,
  selectedFoods, // thêm giá trị mặc định
  setSelectedFoods,
  onBack, // thêm prop callback quay lại
}) {
  const foodMenu = [
    { name: "Popcorn", price: 50000 },
    { name: "Soda", price: 30000 },
    { name: "Hotdog", price: 40000 },
    { name: "Combo Popcorn + Soda", price: 70000 },
  ];

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

  return (
    <div className="food-selection">
      <h4>Chọn đồ ăn</h4>
      <div className="food-list">
        {foodMenu.map((item) => (
          <div className="food-item" key={item.name}>
            <span className="food-name">{item.name}</span>
            <span className="food-price">
              {item.price.toLocaleString("vi-VN")} VND
            </span>
            <input
              type="number"
              min="0"
              value={selectedFoods[item.name] || 0}
              onChange={(e) =>
                updateFoodQuantity(item.name, parseInt(e.target.value) || 0)
              }
            />
          </div>
        ))}
      </div>

      <div className="food-summary">
        <p>Tổng tiền ghế: {(seatTotal || 0).toLocaleString("vi-VN")} VND</p>
        <p>Tổng tiền đồ ăn: {foodTotal.toLocaleString("vi-VN")} VND</p>
        <p>
          <strong>
            Tổng cộng: {((seatTotal || 0) + foodTotal).toLocaleString("vi-VN")}{" "}
            VND
          </strong>
        </p>

        <div className="food-buttons">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              ← Quay lại
            </button>
          )}

          <button
            disabled={!selectedSeats.length}
            onClick={() =>
              onComplete({
                foods: Object.entries(selectedFoods).map(
                  ([name, qty]) => `${name} x${qty}`
                ),
                total: foodTotal,
              })
            }
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
