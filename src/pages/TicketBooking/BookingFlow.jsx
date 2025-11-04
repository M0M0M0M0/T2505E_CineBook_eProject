import React, { useState } from "react";
import TotalSection from "./TotalSection";
import PaymentSection from "./PaymentSection";
import "./BookingFlow.css"; // thêm CSS chuyển cảnh

export default function BookingFlow(props) {
  const [step, setStep] = useState("total"); // "total" | "payment"

  const handleNext = () => {
    setStep("transition"); // bước trung gian để chạy animation
    setTimeout(() => setStep("payment"), 400); // sau 0.4s chuyển hẳn sang PaymentSection
  };

  const handleBack = () => setStep("total");

  const handleFinish = () => {
    alert("✅ Cảm ơn bạn đã đặt vé!");
    setStep("total");
  };

  return (
    <div className={`booking-container ${step}`}>
      <div className="slide total-slide">
        <TotalSection {...props} onNext={handleNext} />
      </div>

      <div className="slide payment-slide">
        <PaymentSection {...props} onBack={handleBack} onFinish={handleFinish} />
      </div>
    </div>
  );
}
