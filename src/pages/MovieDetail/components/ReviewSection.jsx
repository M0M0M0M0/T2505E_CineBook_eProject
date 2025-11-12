import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns'; // Dùng để format ngày tháng

// ĐỊNH NGHĨA URL GỐC CỦA BACKEND API
// !!! VUI LÒNG THAY THẾ BẰNG URL BACKEND THỰC TẾ CỦA BẠN
const API_BASE_URL = 'https://localhost:8000'; // Ví dụ: http://localhost:8000

// --- Biểu tượng (Icons) ---
// Giữ nguyên các component SVG icon đã tạo trước đó

const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 cursor-pointer text-warning"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
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
    className="w-5 h-5"
    style={{ marginRight: '2px', display: 'inline-block' }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TrashIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
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
  const storedUserId = localStorage.getItem('userId');
  const currentUserId = storedUserId ? Number(storedUserId) : null;

  // State của component
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitMessage, setSubmitMessage] = useState(null); // { type: 'success' | 'danger', text: '...' }
  const [isLoading, setIsLoading] = useState(false);

  // --- HÀM GỌI API ---

  // 1. Hàm tải danh sách reviews (dùng useCallback để tối ưu)
  const fetchReviews = useCallback(async () => {
    if (!movieId) return; // Không làm gì nếu chưa có movieId
    
    setIsLoading(true);
    setSubmitMessage(null); // Xóa thông báo cũ
    
    try {
      // *** GỌI API: LẤY REVIEWS ***
      const response = await fetch(`${API_BASE_URL}/api/movies/${movieId}/reviews`);

      if (!response.ok) {
        throw new Error('Không thể tải danh sách đánh giá.');
      }

      const data = await response.json();
      // Giả định API trả về một mảng các reviews
      // Nếu API trả về { reviews: [...] } thì dùng data.reviews
      setReviews(data); 
    } catch (error) {
      console.error('Lỗi khi tải reviews:', error);
      setSubmitMessage({ type: 'danger', text: error.message || 'Đã xảy ra lỗi khi tải đánh giá.' });
    } finally {
      setIsLoading(false);
    }
  }, [movieId]); // Chỉ chạy lại hàm này nếu movieId thay đổi

  // 2. useEffect để gọi fetchReviews khi component mount hoặc movieId thay đổi
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]); // Phụ thuộc vào hàm useCallback ở trên

  // 3. Hàm xử lý khi gửi review mới
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu
    if (newRating === 0 || newComment.trim() === '') {
      setSubmitMessage({ type: 'danger', text: 'Vui lòng cho điểm và viết bình luận.' });
      return;
    }
    
    // Kiểm tra đăng nhập
    if (!isAuthenticated || !token) {
      setSubmitMessage({ type: 'danger', text: 'Bạn cần đăng nhập để gửi đánh giá.' });
      return;
    }

    setIsLoading(true);
    setSubmitMessage(null);

    try {
      // *** GỌI API: GỬI REVIEW MỚI ***
      const response = await fetch(`${API_BASE_URL}/api/movies/${movieId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Gửi token xác thực
        },
        body: JSON.stringify({
          comment: newComment,
          rating: newRating
          // Backend sẽ tự lấy web_user_id từ token
        })
      });

      if (!response.ok) {
        // Thử đọc lỗi từ backend
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gửi đánh giá thất bại.');
      }

      // Thành công!
      setNewComment('');
      setNewRating(0);
      setSubmitMessage({ type: 'success', text: 'Đã gửi đánh giá thành công!' });
      
      // Tải lại danh sách review để hiển thị review mới
      fetchReviews(); 

    } catch (error) {
      console.error('Lỗi khi gửi review:', error);
      setSubmitMessage({ type: 'danger', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Hàm xử lý khi xóa review
  const handleDeleteReview = async (reviewId) => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated || !token) {
      alert('Bạn cần đăng nhập để thực hiện hành động này.');
      return;
    }

    // Không cần confirm cho nhanh, hoặc bạn có thể thêm modal confirm sau
    // if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
    //   return;
    // }

    setIsLoading(true); // Hiển thị loading
    setSubmitMessage(null);

    try {
      // *** GỌI API: XÓA REVIEW ***
      const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // Gửi token để xác thực
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa đánh giá.');
      }

      // Thành công!
      setSubmitMessage({ type: 'success', text: 'Đã xóa đánh giá.' });
      
      // Tải lại danh sách review
      fetchReviews();

    } catch (error) {
      console.error('Lỗi khi xóa review:', error);
      setSubmitMessage({ type: 'danger', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };


  // --- RENDER COMPONENT ---
  return (
    <div className="card mt-4">
      <div className="card-header">
        <h5 className="mb-0">Đánh giá & Bình luận</h5>
      </div>

      {/* Phần gửi review mới (chỉ hiển thị khi đã đăng nhập) */}
      {isAuthenticated && (
        <div className="card-body border-bottom">
          <form onSubmit={handleSubmitReview}>
            <div className="mb-3">
              <label className="form-label">Cho điểm của bạn:</label>
              <StarRating rating={newRating} setRating={setNewRating} />
            </div>
            <div className="mb-3">
              <label htmlFor="reviewComment" className="form-label">Viết bình luận:</label>
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
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading} // Vô hiệu hóa nút khi đang tải
              >
                {isLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
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
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Không có review */}
        {!isLoading && reviews.length === 0 && (
          <p className="text-muted text-center">Chưa có đánh giá nào cho bộ phim này.</p>
        )}

        {/* Danh sách review */}
        <ul className="list-group list-group-flush">
          {reviews.map((review) => (
            <li key={review.id} className="list-group-item px-0 py-3">
              <div className="d-flex w-100">
                {/* Thông tin user (bạn có thể thay bằng avatar) */}
                <div className="flex-shrink-0 me-3">
                  <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    {/* Lấy chữ cái đầu, giả sử `web_user` có `username` */}
                    {review.web_user?.username ? review.web_user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                
                {/* Nội dung review */}
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      {/* Giả sử `web_user` là một object lồng nhau */}
                      {review.web_user?.username || 'Người dùng ẩn danh'}
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
                  {currentUserId === review.web_user_id && (
                     <button
                       className="btn btn-sm btn-outline-danger mt-2 d-inline-flex align-items-center"
                       onClick={() => handleDeleteReview(review.id)}
                       title="Xóa đánh giá"
                       disabled={isLoading} // Vô hiệu hóa khi đang tải
                     >
                       <TrashIcon className="w-4 h-4 me-1" /> Xóa
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