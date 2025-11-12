import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns'; // Dùng để format ngày tháng

// ĐỊNH NGHĨA URL GỐC CỦA BACKEND API
// !!! VUI LÒNG THAY THẾ BẰNG URL BACKEND THỰC TẾ CỦA BẠN
const API_BASE_URL = 'http://localhost:8000'; // Giữ nguyên URL của bạn

// --- Biểu tượng (Icons) 
// Icon cho việc chọn sao (khi viết review)
const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="cursor-pointer text-warning" // Bootstrap 5 có class text-warning
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{ width: '28px', height: '28px', marginRight: '4px' }} // Kích thước sao khi viết review
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Icon sao chỉ đọc (hiển thị review cũ)
const ReadOnlyStarIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "#ffc107" : "#e4e5e9"}
    stroke={filled ? "#ffc107" : "#e4e5e9"}
    className=""
    style={{ width: '20px', height: '20px', marginRight: '2px', display: 'inline-block' }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Icon thùng rác
const TrashIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className} // className sẽ được truyền từ nơi gọi
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);


// --- Component Rating (Giữ nguyên) ---

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
        <ReadOnlyStarIcon
          key={index}
          filled={index < rating}
        />
      ))}
    </div>
  );
};

// --- Component ReviewSection Chính (Đã cập nhật API) ---

export default function ReviewSection({ movieId }) {
  // Lấy thông tin xác thực từ localStorage
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  // *** SỬA LỖI LOGIC 1: Giữ ID user là STRING ***
  const storedUserId = localStorage.getItem('userId');
  // Giữ nguyên là string (hoặc null) để so sánh với string từ backend
  const currentUserId = storedUserId ? storedUserId : null;

  // State của component
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitMessage, setSubmitMessage] = useState(null); // { type: 'success' | 'danger', text: '...' }
  const [isLoading, setIsLoading] = useState(false);

  // --- HÀM GỌI API ---

  // 1. Hàm tải danh sách reviews
  const fetchReviews = useCallback(async () => {
    if (!movieId) return; 
    
    setIsLoading(true);
    setSubmitMessage(null); 
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/movies/${movieId}/reviews`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error ${response.status}: ${errorText.substring(0, 150)}...`);
      }
      
      const data = await response.json();
      
      // *** SỬA LỖI LOGIC 2: Xử lý Pagination (paginate()) ***
      // Dữ liệu thật nằm trong data.data
      setReviews(data.data || []); 
      
    } catch (error) {
      console.error('Lỗi khi tải reviews:', error);
      // Giữ nguyên text tiếng Anh của bạn
      setSubmitMessage({ type: 'danger', text: error.message || 'Error loading reviews.' });
    } finally {
      setIsLoading(false);
    }
  }, [movieId]); 

  // 2. useEffect để gọi fetchReviews
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]); 

  // 3. Hàm xử lý khi gửi review mới
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Giữ nguyên text tiếng Anh của bạn
    if (newRating === 0 || newComment.trim() === '') {
      setSubmitMessage({ type: 'danger', text: 'Please leave a comments.' });
      return;
    }
    
    if (!isAuthenticated || !token) {
      setSubmitMessage({ type: 'danger', text: 'You need to log in .' });
      return;
    }

    setIsLoading(true);
    setSubmitMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/movies/${movieId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          comment: newComment,
          rating: newRating
        })
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = 'Failed to submit.';

        if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } else {
            const errorText = await response.text();
            errorMessage = `Server error ${response.status}: ${errorText.substring(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      // *** SỬA LỖI LOGIC 3: Đọc response JSON từ Controller ***
      const data = await response.json(); // Đọc response 201

      setNewComment('');
      setNewRating(0);
      // Lấy message từ response
      setSubmitMessage({ type: 'success', text: data.message || 'Submitted successfully!' });
      
      fetchReviews(); 

    } catch (error) {
      console.error('Error submiting review:', error);
      setSubmitMessage({ type: 'danger', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Hàm xử lý khi xóa review
  const handleDeleteReview = async (reviewId) => {
    if (!isAuthenticated || !token) {
      alert('You need to log in to do this action.');
      return;
    }

    setIsLoading(true); 
    setSubmitMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        // (Logic xử lý lỗi của bạn đã ổn)
        const contentType = response.headers.get("content-type");
        let errorMessage = 'Can not delete commnet.';

        if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } else {
            const errorText = await response.text();
            errorMessage = `Server error ${response.status}: ${errorText.substring(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      // *** SỬA LỖI LOGIC 4: Đọc response JSON từ Controller ***
      const data = await response.json(); // Đọc response 200

      setSubmitMessage({ type: 'success', text: data.message || 'Deleted.' });
      fetchReviews();

    } catch (error) {
      console.error('Error deleting comment:', error);
      setSubmitMessage({ type: 'danger', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };


  // --- RENDER COMPONENT ---
  return (
    // Thêm data-bs-theme="dark" để đổi nền card sang tối (Bootstrap 5.3+)
    <div 
      className="card mt-4" 
      data-bs-theme="dark" 
      style={{ maxWidth: '900px', margin: '2rem auto' }}
    >
      <div className="card-header">
        {/* Giữ nguyên text tiếng Anh của bạn */}
        <h5 className="mb-0">Reviews & Comments</h5>
      </div>

      {/* Phần gửi review mới (chỉ hiển thị khi đã đăng nhập) */}
      {isAuthenticated && (
        <div className="card-body border-bottom">
          <form onSubmit={handleSubmitReview}>
            <div className="mb-3">
              {/* Giữ nguyên text tiếng Anh của bạn */}
              <label className="form-label text-white">Your Rating:</label>
              <StarRating rating={newRating} setRating={setNewRating} />
            </div>
            <div className="mb-3">
              {/* Giữ nguyên text tiếng Anh của bạn */}
              <label htmlFor="reviewComment" className="form-label text-white">Write a comment:</label>
              <textarea
                id="reviewComment"
                className="form-control"
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Cảm nhận của bạn về bộ phim..."
              ></textarea>
            </div>
            {/* Nút gửi và thông báo */}
            <div className="d-flex align-items-center">
              {/* Giữ nguyên text tiếng Anh của bạn */}
              <button 
                type="submit" 
                className="btn btn-warning" 
                disabled={isLoading} 
              >
                {isLoading ? 'Submiting...' : 'Submit Review'}
              </button>
              
              {/* Thông báo (lỗi hoặc thành công) */}
              {submitMessage && (
                <div className={`ms-3 alert alert-${submitMessage.type} py-2 px-3 mb-0`}>
                  {submitMessage.text}
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Phần hiển thị danh sách reviews */}
      <div className="card-body">
        {/* Hiển thị loading */}
        {isLoading && reviews.length === 0 && (
          <div className="text-center">
            <div className="spinner-border text-warning" role="status"> {/* Đổi sang màu vàng */}
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Không có review */}
        {!isLoading && reviews.length === 0 && (
          // Giữ nguyên text tiếng Anh của bạn
          <p className="text-muted text-center">No reviews and comments.</p>
        )}

        {/* Danh sách review */}
        <ul className="list-group list-group-flush">
          {reviews.map((review) => (
            <li key={review.id} className="list-group-item px-0 py-3">
              <div className="d-flex w-100">
                {/* Thông tin user (bạn có thể thay bằng avatar) */}
                <div className="flex-shrink-0 me-3">
                  <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    {/* *** SỬA LỖI LOGIC 5: Đọc 'user.full_name' *** */}
                    {review.user?.full_name ? review.user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                
                {/* Nội dung review */}
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      {/* *** SỬA LỖI LOGIC 6: Đọc 'user.full_name' *** */}
                      {review.user?.full_name || 'Anonymous User'}
                    </h6>
                    <small className="text-muted">
                      {format(new Date(review.created_at), 'dd/MM/yyyy')}
                    </small>
                  </div>
                  <div className="my-1">
                    <ReadOnlyStars rating={review.rating} />
                  </div>
                  <p className="mb-1">{review.comment}</p>

                  {/* Nút Xóa (chỉ hiển thị đúng chủ review) */}
                  {/* *** SỬA LỖI LOGIC 7: So sánh '==' *** */}
                  {currentUserId == review.web_user_id && (
                       <button
                         className="btn btn-sm btn-outline-warning mt-2 d-inline-flex align-items-center" 
                         onClick={() => handleDeleteReview(review.id)}
                         title="Delete review" // Dịch sang tiếng Anh
                         disabled={isLoading} 
                       >
                         <TrashIcon 
                           className="me-1" 
                           style={{ width: '14px', height: '14px' }} 
                          /> Delete {/* *** SỬA LỖI LOGIC 8: Dịch sang tiếng Anh *** */}
                       </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}