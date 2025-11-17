import React from 'react';
import './Offers.css';

function Offers() {
  return (
    <div className="offers-section">
      <h2 className="offers-title">Special Offers</h2>
      <ul className="offers-list">
        <li className="offer-item">50% off on tickets for students</li>
        <li className="offer-item">Buy 1 get 1 free on Tuesdays</li>
      </ul>
    </div>
  );
}

export default Offers;
