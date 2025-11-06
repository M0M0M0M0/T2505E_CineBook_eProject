import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup, Image } from 'react-bootstrap';
// KHÔNG CẦN import ảnh phim tĩnh (latMatImage, doraemonImage, etc.) nữa
import backgroundImage from '../../assets/img/background-theater.jpg';
import './TheaterPage.css';

/**
 * Tạo 7 ngày tiếp theo, bắt đầu từ hôm nay.
 */
const generateDates = () => {
  const dates = [];
  const today = new Date();
  const formatter = new Intl.DateTimeFormat('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const parts = formatter.formatToParts(date);
    const weekday = parts.find(p => p.type === 'weekday').value;
    const day = parts.find(p => p.type === 'day').value;

    dates.push({
      value: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
      label: i === 0 ? 'Hôm nay' : `${weekday}, ${day}`,
    });
  }
  return dates;
};

// Dữ liệu cứng (theatersData) đã bị xóa.
// Dữ liệu sẽ được tải từ API.

const availableDates = generateDates();

// ===================================================================
// Component Card Phim (Không cần thay đổi)
// Nó tự động nhận 'movie.poster' là URL từ API
// ===================================================================
const MovieCard = ({ movie, selectedDate }) => {
  const showtimesForSelectedDate = movie.showtimes.find(st => st.date === selectedDate);

  if (!showtimesForSelectedDate || showtimesForSelectedDate.times.length === 0) {
    return null;
  }

  return (
    <ListGroup.Item className="px-0 py-3"  style={{ backgroundColor: '#000000ff' }}>
      <Row className="g-3 align-items-start">
        <Col sm={3} m={2}>
          <Image 
            src={movie.poster} // 'poster' bây giờ là URL từ API
            alt={`Poster phim ${movie.title}`} 
            fluid 
            rounded 
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x150/cccccc/FFFFFF?text=Error'; }}
          />
        </Col>
        <Col xs={9} sm={10}>
          <h5 className="fw-bold mb-1" style={{ color: '#ffd27a' }}>{movie.title}</h5>
          <p className=" medium mb-2" style={{ color: '#ffd27a' }}><i className="bi bi-clock-fill me-2"></i>Showtimes</p>
          <div className="d-flex flex-wrap gap-2">
            {showtimesForSelectedDate.times.map(time => (
              <Button 
                key={time} 
                variant="outline" 
                size="lg"
                style={{ 
                  color: '#ffd27a',
                  borderColor: '#ffd27a',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 0 10px #ffd27a';
                  e.target.style.backgroundColor = '#ffd27a20';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {time}
              </Button>
            ))}
          </div>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

// ===================================================================
// Component Card Rạp (Không cần thay đổi)
// ===================================================================
const TheaterCard = ({ theater, selectedDate }) => {
  // Lọc các phim CÓ suất chiếu vào ngày đã chọn
  const moviesForSelectedDate = theater.movies.filter(movie =>
    movie.showtimes.some(st => st.date === selectedDate)
  );

  return (
    <Card className="mb-4 shadow-sm" style={{ backgroundColor: 'black' }}>
      <Card.Body>
        <Card.Title as="h3" className="fw-bold" style={{ color: '#ffd27a' }}>
          {theater.name}
        </Card.Title>
        <Card.Subtitle className="mb-2" style={{ color: '#ffd27a' }}>
          <i className="bi bi-geo-alt-fill me-2" ></i>{theater.address}
        </Card.Subtitle>
      </Card.Body>
      <Card.Body className="border-top" style={{ color: '#ffd27a' }}>
        <h4 className="h6 text-uppercase "><i className="bi bi-film me-2"></i>Now Showing</h4>
        <ListGroup variant="flush">
          {moviesForSelectedDate.length > 0 ? (
            moviesForSelectedDate.map(movie => <MovieCard key={movie.id} movie={movie} selectedDate={selectedDate} />)
          ) : (
            // Ghi chú này sẽ không bao giờ hiển thị nếu logic lọc bên ngoài là đúng
            <p className="text-muted text-center py-3">Không có suất chiếu phù hợp.</p>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

// ===================================================================
// Component Chính (Đã được cập nhật với useEffect)
// ===================================================================
export default function Theaters() {
  // --- THÊM STATE ĐỂ LƯU DATA TỪ API ---
  const [allTheatersData, setAllTheatersData] = useState([]); // Lưu data từ API
  const [isLoading, setIsLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(null); // Lưu lỗi nếu có

  // --- State cho các bộ lọc ---
  const [selectedRegion, setSelectedRegion] = useState('All Cities');
  const [selectedDate, setSelectedDate] = useState(availableDates[0].value);
  const [selectedTheaterId, setSelectedTheaterId] = useState('All Theaters');

  // --- useEffect: Tải dữ liệu từ API khi component được render lần đầu ---
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setIsLoading(true); // Bắt đầu tải
        setError(null); // Xóa lỗi cũ
        
        // URL của Laravel API (đảm bảo Laravel server đang chạy)
        const response = await fetch('http://localhost:8000/api/showtimes-by-theater');
        
        if (!response.ok) {
          throw new Error('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
        }

        const data = await response.json();
        setAllTheatersData(data); // Lưu dữ liệu vào state
      } catch (err) {
        setError(err.message); // Lưu lại lỗi
      } finally {
        setIsLoading(false); // Kết thúc tải (dù thành công hay lỗi)
      }
    };

    fetchShowtimes(); // Gọi hàm fetch
  }, []); // Mảng rỗng [] nghĩa là chỉ chạy 1 lần khi component mount

  // --- CẬP NHẬT CÁC HÀM useMemo ĐỂ DÙNG `allTheatersData` TỪ STATE ---
  
  // Tính toán danh sách khu vực (regions) từ dữ liệu API
  const regions = useMemo(() => {
    return ['All Cities', ...new Set(allTheatersData.map(t => t.region))];
  }, [allTheatersData]); // Phụ thuộc vào allTheatersData

  // Tính toán danh sách rạp (theaters) dựa trên khu vực đã chọn
  const availableTheaters = useMemo(() => {
    if (selectedRegion === 'All Cities') {
      return []; // Không hiển thị rạp nào nếu chưa chọn khu vực
    }
    return allTheatersData.filter(t => t.region === selectedRegion);
  }, [selectedRegion, allTheatersData]); // Phụ thuộc vào allTheatersData

  // Cập nhật hàm xử lý khi đổi khu vực
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedTheaterId('All Theaters'); // Reset chọn rạp về "Tất cả rạp"
  }; 

  // Lọc ra các rạp cuối cùng để hiển thị
  const filteredTheaters = useMemo(() => {
    let theaters = allTheatersData; // Bắt đầu với TẤT CẢ data từ API

    // 1. Lọc theo khu vực (Region)
    if (selectedRegion !== 'All Cities') {
      theaters = theaters.filter(theater => theater.region === selectedRegion);
    }

    // 2. Lọc theo rạp cụ thể (Theater)
    if (selectedTheaterId !== 'All Theaters') {
      theaters = theaters.filter(theater => theater.id.toString() === selectedTheaterId);
    }

    // 3. Lọc theo ngày (Date)
    // Chỉ giữ lại các rạp CÓ ÍT NHẤT 1 phim có suất chiếu vào ngày đã chọn
    return theaters.filter(theater => 
      theater.movies.some(movie => 
        movie.showtimes.some(st => st.date === selectedDate)
      )
    );
  }, [selectedRegion, selectedTheaterId, selectedDate, allTheatersData]); // Phụ thuộc vào allTheatersData

  // --- XỬ LÝ GIAO DIỆN KHI ĐANG TẢI HOẶC BỊ LỖI ---
  
  // Hiển thị khi đang tải
  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <h1 style={{ color: '#ffd27a' }}>Đang tải lịch chiếu...</h1>
      </Container>
    );
  }

  // Hiển thị khi có lỗi
  if (error) {
    return (
      <Container className="py-5 text-center">
        <h1 style={{ color: 'red' }}>Lỗi: {error}</h1>
      </Container>
    );
  }

  // --- RENDER GIAO DIỆN CHÍNH (Khi đã có data) ---
  return (
    <div
      className="width auto"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Container className="py-5">
        <header className="text-center mb-5">
          <h1 className="display-4 fw-bold " style={{ color: '#ffd27a' }} >Movies Schedules</h1>
          <p className="lead text-muted">Chọn rạp và đặt vé ngay hôm nay!</p>
        </header>

        {/* --- Hàng bộ lọc --- */}
        <Row className="justify-content-center mb-4 g-3">
          {/* Bộ lọc Khu vực */}
          <Col md={5} lg={4}>
            <Form.Select value={selectedRegion} onChange={handleRegionChange} className="custom-select-dark">
                {/* `regions` bây giờ được tạo tự động từ API */}
                {regions.map(region => <option key={region} value={region}>{region}</option>)}
            </Form.Select>
          </Col>
          
          {/* Bộ lọc Rạp */}
          <Col md={5} lg={4}>
            <Form.Select
              value={selectedTheaterId}
              onChange={(e) => setSelectedTheaterId(e.target.value)}
              disabled={selectedRegion === 'All Cities'} // Tắt khi chưa chọn khu vực
              className="custom-select-dark"
            >
              <option value="All Theaters">Tất cả rạp</option> 
              {availableTheaters.map(theater => (
                <option key={theater.id} value={theater.id}>
                  {theater.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        
        {/* --- Hàng bộ lọc Ngày --- */}
        <Row className="justify-content-center mb-5">
          <Col xs={12}>
            <div className="d-flex justify-content-center flex-wrap gap-2 date-filter-container">
              {availableDates.map(date => (
                <Button
                  key={date.value}
                  variant={selectedDate === date.value ? 'primary' : 'outline-secondary'}
                  onClick={() => setSelectedDate(date.value)}
                >
                  {date.label}
                </Button>
              ))}
            </div>
          </Col>
        </Row>

        {/* --- Hiển thị kết quả --- */}
        <main>
          <Row>
            <Col md={12} lg={10} xl={8} className="mx-auto">
              {/* Kiểm tra nếu có rạp để hiển thị */}
              {filteredTheaters.length > 0 ? (
                filteredTheaters.map(theater => (
                  <TheaterCard key={theater.id} theater={theater} selectedDate={selectedDate} />
                ))
              ) : (
                // Thông báo khi không tìm thấy rạp/suất chiếu phù hợp
                <div className="text-center bg-black p-5 rounded shadow-sm" style={{ color: '#ffd27a' }}>
                  <h2 className="h4" >Không có lịch chiếu phù hợp.</h2>
                  <p className=" mt-2">Vui lòng thử chọn khu vực hoặc ngày khác.</p>
                </div>
              )}
            </Col>
          </Row>
        </main>
      </Container>
    </div>
  );
}