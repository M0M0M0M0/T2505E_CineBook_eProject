import React, { useState, useEffect } from "react";
import "./FoodSelection.css";

export default function FoodSelection({
  selectedSeats,
  seatTotal, // Đã là USD
  onComplete,
  selectedFoods,
  setSelectedFoods,
  onBack,
  bookingId, // ⬅️ THÊM PROP MỚI: Nhận Booking ID
}) {
  const [foodMenu, setFoodMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/foods";

  useEffect(() => {
    const fetchFoods = async () => {
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

  // ✅ SỬA LẠI HÀM NÀY: XỬ LÝ GỌI API TRƯỚC KHI CHUYỂN BƯỚC
  const handleContinueWithApi = async () => {
    if (!bookingId) {
      alert("Lỗi: Booking ID không tìm thấy. Vui lòng chọn lại ghế.");
      if (onBack) onBack();
      return;
    }

    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      window.location.href = "/login";
      return;
    }

    // ✅ SỬA LẠI: Chuyển đổi format foods để gửi API
    const foodsToSend = Object.entries(selectedFoods).map(
      ([name, quantity]) => {
        // ✅ TÌM food item TRONG scope của map function
        const foodItem = foodMenu.find((item) => item.name === name);

        return {
          food_id: foodItem?.id || null,
          food_name: name,
          quantity: quantity,
          price: foodItem?.price || 0, // ✅ THÊM PRICE
        };
      }
    );

    console.log("🍿 DEBUG Food - Data to send:", { foods: foodsToSend });

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/foods`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ foods: foodsToSend }),
        }
      );

      console.log("🍿 DEBUG Food - Response status:", response.status);

      const result = await response.json();
      console.log("🍿 DEBUG Food - Response data:", result);

      if (response.ok && result.success) {
        // API thành công → chuyển sang bước tiếp theo
        onComplete({
          foods: selectedFoods,
          total: foodTotal,
        });
      } else {
        alert(result.message || "Không thể lưu lựa chọn đồ ăn.");
      }
    } catch (error) {
      console.error("Lỗi cập nhật snapshot đồ ăn:", error);
      alert("Đã xảy ra lỗi không mong muốn khi cập nhật đồ ăn.");
    }
  };

  if (loading) return <div>Đang tải menu đồ ăn...</div>;
  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;

  return (
    <div className="food-selection">
      <h4>Food Selection</h4>
      <div className="food-list">
        {foodMenu.map((item) => (
          <div className="food-item food-item-grid" key={item.id || item.name}>
            <span className="food-name">{item.name}</span>

            <span className="food-price food-price-col">
              {formatCurrency(item.price)}
            </span>

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
                −
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
        <p>Seat total: {formatCurrency(seatTotal || 0)}</p>
        <p>Food total: {formatCurrency(foodTotal)}</p>
        <p>
          <strong>
            Grand total: {formatCurrency((seatTotal || 0) + foodTotal)}
          </strong>
        </p>
      </div>

      <div className="total-buttons">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
        )}

        <button
          disabled={!selectedSeats.length}
          onClick={handleContinueWithApi}
          className="total-button"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
