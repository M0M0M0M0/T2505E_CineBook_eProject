import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup, Image } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { CalendarEvent } from 'react-bootstrap-icons'
// Import hook để đọc URL
import { useSearchParams } from 'react-router-dom';
import backgroundImage from '../../assets/img/background-theater.jpg';
import './TheaterPage.css';

const MovieCard = ({ movie, selectedDate }) => {
  const showtimesForSelectedDate = movie.showtimes.find(st => st.date === selectedDate);

  if (!showtimesForSelectedDate || showtimesForSelectedDate.times.length === 0) {
    return null;
  }

  return (
    <ListGroup.Item className="px-0 py-3" style={{ backgroundColor: '#000000ff' }}>
      <Row className="g-3 align-items-start">
        <Col sm={3} m={2}>
          <Image
            src={movie.poster}
            alt={`Poster for ${movie.title}`}
            fluid
            rounded
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x150/cccccc/FFFFFF?text=Error'; }}
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

const TheaterCard = ({ theater, selectedDate }) => {
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
            <p className="text-muted text-center py-3">No suitable showtimes found.</p>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default function Theaters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Đổi tên hàm để rõ nghĩa hơn: nó lấy region từ URL
  const getRegionFromUrl = () => {
    const regionFromUrl = searchParams.get('region');
    return regionFromUrl || 'All Cities';
  };

  const [allTheatersData, setAllTheatersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dùng hàm getRegionFromUrl để set state ban đầu
  const [selectedRegion, setSelectedRegion] = useState(getRegionFromUrl);
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [selectedTheaterId, setSelectedTheaterId] = useState('All Theaters');

  const formatDateToString = (date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const selectedDateString = useMemo(() => formatDateToString(selectedDate), [selectedDate]);

  // useEffect để tải data (không đổi)
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:8000/api/showtimes-by-theater');
        
        if (!response.ok) {
          throw new Error('Error loading data. Please try again later.');
        }

        const data = await response.json();
        setAllTheatersData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowtimes();
  }, []);

  // === CẬP NHẬT QUAN TRỌNG ===
  // useEffect này lắng nghe sự thay đổi của [searchParams]
  // (Khi bạn bấm link trên Header, searchParams thay đổi)
  useEffect(() => {
    const regionFromUrl = getRegionFromUrl();
    
    // Nếu region từ URL khác với region đang chọn trong state
    if (regionFromUrl !== selectedRegion) {
      setSelectedRegion(regionFromUrl); // Cập nhật state
      setSelectedTheaterId('All Theaters'); // Reset chọn rạp
    }
  }, [searchParams]); // Phụ thuộc vào searchParams
  // ==========================

  const regions = useMemo(() => {
    return ['All Cities', ...new Set(allTheatersData.map(t => t.region))];
  }, [allTheatersData]);

  const availableTheaters = useMemo(() => {
    if (selectedRegion === 'All Cities') {
      return [];
    }
    return allTheatersData.filter(t => t.region === selectedRegion);
  }, [selectedRegion, allTheatersData]);

  // Hàm này (khi người dùng tự đổi) sẽ cập nhật state VÀ URL
  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    setSelectedRegion(newRegion);
    setSelectedTheaterId('All Theaters');

    const newSearchParams = new URLSearchParams(searchParams);
    if (newRegion === 'All Cities') {
      newSearchParams.delete('region');
    } else {
      newSearchParams.set('region', newRegion);
    }
    setSearchParams(newSearchParams); // Cập nhật URL
  }; 

  const filteredTheaters = useMemo(() => {
    let theaters = allTheatersData;

    if (selectedRegion !== 'All Cities') {
      theaters = theaters.filter(theater => theater.region === selectedRegion);
    }

    if (selectedTheaterId !== 'All Theaters') {
      theaters = theaters.filter(theater => theater.id.toString() === selectedTheaterId);
    }

    return theaters.filter(theater => 
      theater.movies.some(movie => 
        movie.showtimes.some(st => st.date === selectedDateString)
      )
    );
  }, [selectedRegion, selectedTheaterId, selectedDateString, allTheatersData]); 

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <h1 style={{ color: '#ffd27a' }}>Loading schedules...</h1>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <h1 style={{ color: 'red' }}>Error: {error}</h1>
      </Container>
    );
  }

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
          <h1 className="display-4 fw-bold " style={{ color: '#ffd27a' }} ><b>Movies Schedules</b></h1>
          <p className="lead text-muted"><b>Choose a theater and book your tickets today!</b></p>
        </header>

        <Row>
          <Col md={12} lg={10} xl={8} className="mx-auto">
            
            <Row className="mb-5 g-3">
              <Col md={4}>
                {/* Giờ đây, `value={selectedRegion}` sẽ luôn được cập nhật
                  dù bạn đổi bằng dropdown NÀY hay bấm link trên HEADER
                */}
                <Form.Select value={selectedRegion} onChange={handleRegionChange} className="custom-select-dark">
                  {regions.map(region => <option key={region} value={region}>{region}</option>)}
                </Form.Select>
              </Col>
              
              <Col md={4}>
                <Form.Select
                  value={selectedTheaterId}
                  onChange={(e) => setSelectedTheaterId(e.target.value)}
                  disabled={selectedRegion === 'All Cities'}
                  className="custom-select-dark"
                >
                  <option value="All Theaters">All Theaters</option> 
                  {availableTheaters.map(theater => (
                    <option key={theater.id} value={theater.id}>
                      {theater.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={4}>
                <div className="datepicker-wrapper">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control custom-select-dark"
                    minDate={new Date()}
                    popperPlacement="top-end"
                    wrapperClassName="w-100"
                  />
                  <CalendarEvent className="datepicker-icon" />
                </div>
              </Col>
            </Row> 

          </Col> 
        </Row> 
        
        <main>
          <Row>
            <Col md={12} lg={10} xl={8} className="mx-auto">
              {filteredTheaters.length > 0 ? (
                filteredTheaters.map(theater => (
                  <TheaterCard key={theater.id} theater={theater} selectedDate={selectedDateString} />
                ))
              ) : (
                <div className="text-center bg-black p-5 rounded shadow-sm" style={{ color: '#ffd27a' }}>
                  <h2 className="h4" >No matching schedules found.</h2>
                  <p className=" mt-2">Please try selecting a different region or date.</p>
                </div>
              )}
            </Col>
          </Row>
        </main>
      </Container>
    </div>
  );
}