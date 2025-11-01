import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup, Image } from 'react-bootstrap';
import latMatImage from '../../assets/img/lat-mat.jpeg';
import doraemonImage from '../../assets/img/Doraemon_Movie.jpg';
import planetApesImage from '../../assets/img/kingdom_of_the_planet_of_the_apes.jpg';
import garfieldImage from '../../assets/img/The_Garfield_Movie.jpg';
import backgroundImage from '../../assets/img/background-theater.jpg';
import './TheaterPage.css';

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
      value: date.toISOString().split('T')[0], 
      label: i === 0 ? 'Hôm nay' : `${weekday}, ${day}`,
    });
  }
  return dates;
};
const theatersData = [
  {
    id: 1,
    name: 'CGV Vincom Center Bà Triệu',
    address: 'Tầng 6, Vincom Center, 191 Bà Triệu, Hai Bà Trưng',
    region: 'Ha Noi',
    movies: [
      {
        id: 101,
        title: 'Lật Mặt 7: Một Điều Ước',
        poster: latMatImage,
        showtimes: [
          { date: '2025-11-02', times: ['18:00', '19:30', '20:45', '21:15', '22:00'] },
          { date: '2025-10-04', times: ['18:30', '20:00', '21:45'] },
          { date: '2025-10-06', times: ['17:45', '19:45', '21:45'] },
        ],
      },
      {
        id: 102,
        title: 'Doraemon: Nobita và Bản Giao Hưởng Địa Cầu',
        poster: doraemonImage,
        showtimes: [
          { date: '2025-11-01', times: ['17:45', '19:00', '20:10'] },
          { date: '2025-11-02', times: ['17:00', '19:15'] },
          { date: '2025-11-03', times: ['18:00', '20:30'] },
        ],
      },
      {
        id: 103,
        title: 'Hành Tinh Khỉ: Vương Quốc Mới',
        poster: planetApesImage,
        showtimes: [
          { date: '2025-11-02', times: ['18:00', '19:30', '20:45', '21:15', '22:00'] },
          { date: '2025-10-04', times: ['18:30', '20:00', '21:45'] },
          { date: '2025-10-06', times: ['17:45', '19:45', '21:45'] },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Lotte Cinema Đà Nẵng',
    address: 'Tầng 5, Lotte Mart, 6 Nại Nam, Hoà Cường Bắc, Hải Châu',
    region: 'Da Nang',
    movies: [
       {
        id: 101,
        title: 'Lật Mặt 7: Một Điều Ước',
        poster: latMatImage,
        showtimes: [
          { date: '2025-11-02', times: ['18:00', '19:30', '20:45', '21:15', '22:00'] },
          { date: '2025-11-04', times: ['18:30', '20:00', '21:45'] },
          { date: '2025-11-06', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-07', times: ['18:00', '19:30', '20:45', '21:15', '22:00'] },
        ],
      },
      {
        id: 104,
        title: 'Garfield: Mèo Béo Siêu Quậy',
        poster: garfieldImage,
        showtimes: [
          { date: '2025-11-02', times: ['18:00', '19:30', '20:45', '21:15', '22:00'] },
          { date: '2025-11-04', times: ['18:30', '20:00', '21:45'] },
          { date: '2025-11-06', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-07', times: ['18:00', '19:30', '20:45', '21:15', '22:00'] },
        ],
      },
    ]
  },
  {
    id: 3,
    name: 'BHD Star Vincom Thảo Điền',
    address: 'Tầng 5, Vincom Mega Mall, 159 Xa lộ Hà Nội, Quận 2',
    region: 'Ho Chi Minh City',
    movies: [
      {
        id: 101,
        title: 'Lật Mặt 7: Một Điều Ước',
        poster: latMatImage,
        showtimes: [
          { date: '2025-11-01', times: ['19:00', '20:30', '21:45'] },
          { date: '2025-11-02', times: ['20:00', '21:30'] },
          { date: '2025-11-03', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-04', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-05', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-06', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-07', times: ['18:00', '19:30', '20:45', '21:15', '22:00'] },
        ],
      },
       {
        id: 104,
        title: 'Garfield: Mèo Béo Siêu Quậy',
        poster: garfieldImage,
        showtimes: [
          { date: '2025-11-02', times: ['20:00', '21:30'] },
          { date: '2025-11-03', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-04', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-05', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-06', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-07', times: ['18:00', '19:30', '20:45', '21:15', '22:00'] },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Beta Cinema Mỹ Đình',
    address: 'Tầng hầm B1, Golden Palace, Mễ Trì, Nam Từ Liêm',
    region: 'Ha Noi',
    movies: [
       {
        id: 102,
        title: 'Doraemon: Nobita và Bản Giao Hưởng Địa Cầu',
        poster: doraemonImage,
        showtimes: [
          { date: '2025-11-02', times: ['20:00', '21:30'] },
          { date: '2025-11-03', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-04', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-05', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-06', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-07', times: ['18:00', '19:30', '20:45', '21:15', '22:00'] },
        ],
      },
      {
        id: 103,
        title: 'Hành Tinh Khỉ: Vương Quốc Mới',
        poster: planetApesImage,
        showtimes: [
          { date: '2025-11-02', times: ['20:00', '21:30'] },
          { date: '2025-11-03', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-04', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-05', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-06', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-07', times: ['18:00', '19:30', '20:45', '21:15', '22:00'] },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'Galaxy Cinema Nguyễn Du',
    address: '116 Nguyễn Du, Phường Bến Thành, Quận 1',
    region: 'Ho Chi Minh City',
    movies: [
       {
        id: 101,
        title: 'Lật Mặt 7: Một Điều Ước',
        poster: latMatImage,
        showtimes: [
          { date: '2025-11-02', times: ['20:00', '21:30'] },
          { date: '2025-11-03', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-04', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-05', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-06', times: ['17:45', '19:45', '21:45'] },
        ],
      },
       {
        id: 104,
        title: 'Garfield: Mèo Béo Siêu Quậy',
        poster: garfieldImage,
        showtimes: [
          { date: '2025-11-02', times: ['20:00', '21:30'] },
          { date: '2025-11-03', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-04', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-05', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-06', times: ['17:45', '19:45', '21:45'] },
          { date: '2025-11-07', times: ['18:00', '19:30', '20:45', '21:15', '22:00'] },
        ],
      },
    ],
  },
];



const regions = ['All Cities', ...new Set(theatersData.map(t => t.region))];
const availableDates = generateDates();
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
            src={movie.poster} 
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
            <p className="text-muted text-center py-3">No matching showtimes available.</p>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};


export default function Theaters() {
  const [selectedRegion, setSelectedRegion] = useState('All Cities');
  const [selectedDate, setSelectedDate] = useState(availableDates[0].value);
  const [selectedTheaterId, setSelectedTheaterId] = useState('All Theaters');

  const availableTheaters = useMemo(() => {
    if (selectedRegion === 'All Cities') {
      return []; 
    }
    return theatersData.filter(t => t.region === selectedRegion);
  }, [selectedRegion]);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedTheaterId('All Theaters'); 
  }; 

  const filteredTheaters = useMemo(() => {
    let theaters = theatersData;

    if (selectedRegion !== 'All Cities') {
      theaters = theaters.filter(theater => theater.region === selectedRegion);
    }

    if (selectedTheaterId !== 'All Theaters') {
      theaters = theaters.filter(theater => theater.id.toString() === selectedTheaterId);
    }

    return theaters.filter(theater => 
      theater.movies.some(movie => 
        movie.showtimes.some(st => st.date === selectedDate)
      )
    );
  }, [selectedRegion, selectedTheaterId, selectedDate]); 

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
          <p className="lead text-muted">Pick a theater and book your tickets today!!</p>
        </header>

        <Row className="justify-content-center mb-4 g-3">
          <Col md={5} lg={4}>
            <Form.Select value={selectedRegion} onChange={handleRegionChange}className="custom-select-dark">
                {regions.map(region => <option key={region} value={region}>{region}</option>)}
            </Form.Select>
          </Col>
          
          <Col md={5} lg={4}>
            <Form.Select
              value={selectedTheaterId}
              onChange={(e) => setSelectedTheaterId(e.target.value)}
              disabled={selectedRegion === 'All Regions'}
              className="custom-select-dark"
            >
              {/* Fixed typo in value here */}
              <option value="All Theaters">All Theaters</option> 
              {availableTheaters.map(theater => (
                <option key={theater.id} value={theater.id}>
                  {theater.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        
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
        <main>
          <Row>
            <Col md={12} lg={10} xl={8} className="mx-auto">
              {filteredTheaters.length > 0 ? (
                filteredTheaters.map(theater => (
                  <TheaterCard key={theater.id} theater={theater} selectedDate={selectedDate} />
                ))
              ) : (
                <div className="text-center bg-black p-5 rounded shadow-sm" style={{ color: '#ffd27a' }}>
                  <h2 className="h4" >No matching showtimes available. </h2>
                  <p className=" mt-2">Please try another location or date.</p>
                </div>
              )}
            </Col>
          </Row>
        </main>
      </Container>
    </div>
  );
}