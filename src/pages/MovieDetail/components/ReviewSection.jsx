import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import "./ReviewSection.css";

const API_BASE_URL = "http://localhost:8000";

//  ICONS 
const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="cursor-pointer text-warning"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{ width: "28px", height: "28px", marginRight: "4px" }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ReadOnlyStarIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "#ffc107" : "#e4e5e9"}
    stroke={filled ? "#ffc107" : "#e4e5e9"}
    style={{
      width: "20px",
      height: "20px",
      marginRight: "2px",
      display: "inline-block",
    }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TrashIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ width: "18px", height: "18px" }}
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

//  COMPONENTS 
const StarRating = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const handleMouseEnter = (index) => setHoverRating(index);
  const handleMouseLeave = () => setHoverRating(0);
  const handleClick = (index) => setRating(index);
  const currentRating = hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="d-flex">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i + 1}
          filled={i + 1 <= currentRating}
          onClick={() => handleClick(i + 1)}
          onMouseEnter={() => handleMouseEnter(i + 1)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
};

const ReadOnlyStars = ({ rating }) => {
  return (
    <div className="d-flex">
      {[...Array(5)].map((_, index) => (
        <ReadOnlyStarIcon key={index} filled={index < rating} />
      ))}
    </div>
  );
};

//  MAIN COMPONENT 
export default function ReviewSection({ movieId }) {
  // Auth
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  const currentUserId = localStorage.getItem("user_id");
  const userType = localStorage.getItem("user_type"); 
  const isAdmin = userType === "staff" || userType === "admin";
  const getUserData = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing user data:", e);
      return null;
    }
  };
  const userData = getUserData();

  // State
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitMessage, setSubmitMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //  Filter state
  const [sortBy, setSortBy] = useState("newest"); 
  const [filterRating, setFilterRating] = useState("all");

  // Confirm delete dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  //  API CALLS 
  const fetchReviews = useCallback(async () => {
    if (!movieId) return;

    setIsLoading(true);
    setSubmitMessage(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/movies/${movieId}/reviews`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server error ${response.status}: ${errorText.substring(0, 150)}...`
        );
      }

      const data = await response.json();
      setReviews(data.data || []);
    } catch (error) {
      console.error("Error loading reviews:", error);
      setSubmitMessage({
        type: "danger",
        text: error.message || "Error loading reviews.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  //  Apply filters
  useEffect(() => {
    let result = [...reviews];

    // Filter by rating
    if (filterRating !== "all") {
      const ratingValue = parseInt(filterRating);
      result = result.filter((review) => review.rating === ratingValue);
    }

    // Sort by date
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    setFilteredReviews(result);
  }, [reviews, sortBy, filterRating]);

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (newRating === 0 || newComment.trim() === "") {
      setSubmitMessage({
        type: "danger",
        text: "Please leave a rating and comment.",
      });
      return;
    }

    if (!isAuthenticated || !token) {
      setSubmitMessage({ type: "danger", text: "You need to log in." });
      return;
    }

    setIsLoading(true);
    setSubmitMessage(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/movies/${movieId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comment: newComment,
            rating: newRating,
          }),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Failed to submit.";

        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = `Server error ${
            response.status
          }: ${errorText.substring(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setNewComment("");
      setNewRating(0);
      setSubmitMessage({
        type: "success",
        text: data.message || "Submitted successfully!",
      });
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitMessage({ type: "danger", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  //  Confirm delete
  const confirmDelete = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteConfirm(true);
  };

  //  Delete review
  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;

    setIsLoading(true);
    setSubmitMessage(null);
    setShowDeleteConfirm(false);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/${reviewToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Cannot delete comment.";

        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = `Server error ${
            response.status
          }: ${errorText.substring(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSubmitMessage({ type: "success", text: data.message || "Deleted." });
      fetchReviews();
    } catch (error) {
      console.error("Error deleting comment:", error);
      setSubmitMessage({ type: "danger", text: error.message });
    } finally {
      setIsLoading(false);
      setReviewToDelete(null);
    }
  };

  //  RENDER 
  return (
    <div
      className="card mt-4"
      data-bs-theme="dark"
      style={{ width: "100%", margin: "2rem 0" }}
    >
      <div className="card-header">
        <h5 className="mb-0">Reviews & Comments</h5>
      </div>

      {/* Submit new review */}
      {isAuthenticated && (
        <div className="card-body border-bottom">
          <form onSubmit={handleSubmitReview}>
            <div className="mb-3">
              <label className="form-label text-white">Your Rating:</label>
              <StarRating rating={newRating} setRating={setNewRating} />
            </div>
            <div className="mb-3">
              <label htmlFor="reviewComment" className="form-label text-white">
                Write a comment:
              </label>
              <textarea
                id="reviewComment"
                className="form-control"
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this movie..."
              ></textarea>
            </div>
            <div className="d-flex align-items-center">
              <button
                type="submit"
                className="btn btn-warning"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Review"}
              </button>

              {submitMessage && (
                <div
                  className={`ms-3 alert alert-${submitMessage.type} py-2 px-3 mb-0`}
                >
                  {submitMessage.text}
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      {/*  FILTERS */}
      <div className="card-body border-bottom">
        <div className="row g-3">
          {/* Sort by date */}
          <div className="col-md-6">
            <label className="form-label text-white">Sort by:</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Filter by rating */}
          <div className="col-md-6">
            <label className="form-label text-white">Filter by rating:</label>
            <select
              className="form-select"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
              <option value="4">⭐⭐⭐⭐ (4 stars)</option>
              <option value="3">⭐⭐⭐ (3 stars)</option>
              <option value="2">⭐⭐ (2 stars)</option>
              <option value="1">⭐ (1 star)</option>
            </select>
          </div>
        </div>

        {/* Show filter results count */}
        <div className="mt-2">
          <small className="text-muted">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </small>
        </div>
      </div>

      {/* Reviews list */}
      <div className="card-body">
        {isLoading && reviews.length === 0 && (
          <div className="text-center">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!isLoading && filteredReviews.length === 0 && reviews.length > 0 && (
          <p className="text-muted text-center">
            No reviews match your filter criteria.
          </p>
        )}

        {!isLoading && reviews.length === 0 && (
          <p className="text-muted text-center">No reviews and comments yet.</p>
        )}

        <div className="review-list-container">
          <ul className="list-group list-group-flush">
            {filteredReviews.map((review) => (
              <li key={review.id} className="list-group-item px-0 py-3">
                <div className="d-flex w-100">
                  {/* User avatar */}
                  <div className="flex-shrink-0 me-3">
                    <div
                      className={`text-white rounded-circle d-flex align-items-center justify-content-center ${
                        review.user_type === "staff"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                      style={{ width: "40px", height: "40px" }}
                    >
                      {review.user?.full_name
                        ? review.user.full_name.charAt(0).toUpperCase()
                        : review.user_type === "staff"
                        ? "A"
                        : "U"}
                    </div>
                  </div>

                  {/* Review content */}
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-0 d-flex align-items-center gap-2">
                          {review.user?.full_name ||
                            (review.staff_id ? "Admin" : "Anonymous User")}

                          {(review.user_type === "staff" ||
                            review.staff_id) && (
                            <span className="badge bg-danger text-white">
                              Admin
                            </span>
                          )}
                        </h6>
                        <small className="text-muted">
                          {format(
                            new Date(review.created_at),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </small>
                      </div>

                      {/* Delete button - show for owner OR admin */}
                      {(currentUserId == review.web_user_id ||
                        (review.staff_id && currentUserId == review.staff_id) ||
                        isAdmin) && (
                        <button
                          className="btn btn-sm btn-outline-danger d-inline-flex align-items-center"
                          onClick={() => confirmDelete(review.id)}
                          title="Delete review"
                          disabled={isLoading}
                        >
                          <TrashIcon className="me-1" />
                          Delete
                        </button>
                      )}
                    </div>

                    <div className="my-2">
                      <ReadOnlyStars rating={review.rating} />
                    </div>
                    <p className="mb-0">{review.comment}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/*  DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" data-bs-theme="dark">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDeleteConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete this review? This action
                  cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteReview}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
