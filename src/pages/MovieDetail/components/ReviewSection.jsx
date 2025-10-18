// ReviewSection.jsx
import React, { useState, useEffect } from "react";
import "./../MovieDetail.css";

/**
 * Props:
 *  - movieId: id of movie
 *  - initialReviews: array of reviews from JSON (optional)
 *
 * Each review: { id, user, text, rating, date } where date ISO string recommended
 */
export default function ReviewSection({ movieId, initialReviews = [] }) {
  const [reviews, setReviews] = useState(() => {
    // copy initial, ensure date objects
    return (initialReviews || []).map(r => ({ ...r }));
  });
  const [sortBy, setSortBy] = useState("date"); // or "rating"
  const [isLoggedIn] = useState(false); // <-- change to real auth logic later
  const [form, setForm] = useState({ user: "", rating: 5, text: "" });

  // sort when sortBy or reviews change
  useEffect(() => {
    const sorted = [...reviews].sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      return (b.rating || 0) - (a.rating || 0);
    });
    setReviews(sorted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  useEffect(() => {
    // If initialReviews changed externally, update
    setReviews((initialReviews || []).slice());
  }, [initialReviews]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Bạn cần đăng nhập để gửi đánh giá.");
      return;
    }
    const newReview = {
      id: Date.now(),
      user: form.user || "Anonymous",
      text: form.text,
      rating: Number(form.rating),
      date: new Date().toISOString(),
    };
    setReviews(prev => [newReview, ...prev]);
    setForm({ user: "", rating: 5, text: "" });
  }

  return (
    <div className="reviews-section">
      <div className="reviews-head">
        <h4>Reviews</h4>
        <div>
          <label style={{ marginRight: 8, color: "#6b7280" }}>Sort:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Newest</option>
            <option value="rating">Top Rating</option>
          </select>
        </div>
      </div>

      {!isLoggedIn ? (
        <div style={{ marginBottom: 10, color: "#6b7280" }}>
          <em>Vui lòng <a href="/login">đăng nhập</a> để gửi review.</em>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
          <input placeholder="Your name" value={form.user} onChange={e => setForm({...form, user: e.target.value})} />
          <select value={form.rating} onChange={e => setForm({...form, rating: e.target.value})}>
            <option value={5}>5</option>
            <option value={4}>4</option>
            <option value={3}>3</option>
            <option value={2}>2</option>
            <option value={1}>1</option>
          </select>
          <textarea placeholder="Write a review" value={form.text} onChange={e => setForm({...form, text: e.target.value})} />
          <button type="submit">Post review</button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 && <div style={{ color: "#6b7280" }}>No reviews yet.</div>}
        {reviews.map(r => (
          <div className="review-item" key={r.id}>
            <div className="review-meta">{r.user} • {new Date(r.date).toLocaleDateString()} • {r.rating}/5</div>
            <div className="review-body">{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
