import React, { useState, useEffect } from "react";
import "./Home.css";
import featured1 from "../../assets/images/featured1.jpg";
import featured2 from "../../assets/images/featured2.jpg";
import featured3 from "../../assets/images/featured3.jpg";
import movie1 from "../../assets/images/movie1.jpg";
import movie2 from "../../assets/images/movie2.jpg";
import movie3 from "../../assets/images/movie3.jpg";
import movie4 from "../../assets/images/movie4.jpg";

const Home = () => {
  const featuredMovies = [
    { id: 1, title: "Avengers: Endgame", img: featured1 },
    { id: 2, title: "Interstellar", img: featured2 },
    { id: 3, title: "Jumanji: Welcome to the Jungle", img: featured3 },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSlide = (index) => {
    setCurrentSlide(index);
  };

    const movies = [
    {
      id: 1,
      title: "Jumanji: Welcome to the Jungle",
      release: "February 16, 2022",
      genre: "Cartoon, Sci-fi",
      duration: "02 hours 30 minutes",
      language: "English",
      rating: "G",
      image: movie1,
    },
    {
      id: 2,
      title: "Avatar: The Way of Water",
      release: "March 10, 2023",
      genre: "Action, Fantasy",
      duration: "03 hours 12 minutes",
      language: "English",
      rating: "PG-13",
      image: movie2,
    },
    {
      id: 3,
      title: "The Batman",
      release: "June 20, 2022",
      genre: "Action, Crime",
      duration: "02 hours 55 minutes",
      language: "English",
      rating: "PG-13",
      image: movie3,
    },
    {
      id: 4,
      title: "Spider-Man: No Way Home",
      release: "December 17, 2021",
      genre: "Action, Adventure",
      duration: "02 hours 30 minutes",
      language: "English",
      rating: "PG-13",
      image: movie4,
    },
  ];

  const nowPlaying = [
    {
      id: 1,
      title: "Guardians of the Galaxy",
      release: "Apr 06, 2022",
      image: movie1,
    },
    { id: 2, title: "Ghost Rider", release: "Apr 09, 2022", image: movie2 },
    { id: 3, title: "Spider-Man", release: "Apr 10, 2022", image: movie3 },
    { id: 4, title: "Bugzy Malone", release: "Apr 12, 2022", image: movie4 },
    { id: 5, title: "The Hateful Eight", release: "Apr 13, 2022", image: featured2 },
  ];

  const [currentNow, setCurrentNow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNow((prev) => (prev + 1) % nowPlaying.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const comingSoon = [
    { id: 1, title: "Dune Part II", release: "Nov 12, 2025", image: movie1 },
    { id: 2, title: "Frozen III", release: "Dec 01, 2025", image: movie2 },
    { id: 3, title: "Avengers: Secret Wars", release: "Feb 20, 2026", image: movie3 },
  ];

  const newsPosts = [
    {
      id: 1,
      title: "Behind the Scenes of Dune II",
      image: movie1,
      category: "Interview",
    },
    {
      id: 2,
      title: "Review: Spider-Man Reboot Surprises Fans",
      image: movie2,
      category: "Review",
    },
    {
      id: 3,
      title: "Top 10 Must-Watch Movies This Month",
      image: movie3,
      category: "Feature",
    },
  ];

  return (
    <div className="homepage_main">
      {/* === HERO BANNER === */}
      <div className="homepage_hero_banner">
        <img
          src={featuredMovies[currentSlide].img}
          alt={featuredMovies[currentSlide].title}
          className="homepage_banner_image"
        />
        <div className="homepage_banner_overlay">
          <h1>{featuredMovies[currentSlide].title}</h1>
          <p>Now showing in theatres – book your tickets today!</p>
        </div>
        <div className="homepage_banner_controls">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => handleManualSlide(index)}
              className={`homepage_banner_dot ${
                currentSlide === index ? "active" : ""
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* === TRENDING MOVIES === */}
      <section className="homepage_movie_section">
        <h2 className="homepage_title">🎬 Trending Movies</h2>
        <div className="homepage_movie_grid">
          {movies.map((movie) => (
            <div className="homepage_movie_card" key={movie.id}>
              <img src={movie.image} alt={movie.title} />
              <div className="homepage_movie_overlay">
                <h3>{movie.title}</h3>
                <span className="homepage_rating">{movie.rating}</span>
                <p>
                  <strong>Release:</strong> {movie.release}
                </p>
                <p>
                  <strong>Genre:</strong> {movie.genre}
                </p>
                <p>
                  <strong>Duration:</strong> {movie.duration}
                </p>
                <p>
                  <strong>Language:</strong> {movie.language}
                </p>
                <div className="homepage_movie_buttons">
                  <button className="homepage_trailer_btn">▶ Trailer</button>
                  <button className="homepage_detail_btn">ℹ Detail</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === NOW PLAYING === */}
      <section className="homepage_now_playing">
        <h2 className="homepage_title">Top Movies in Theatres</h2>
        <div className="homepage_now_slider">
          {nowPlaying.map((movie, index) => (
            <div
              key={movie.id}
              className={`homepage_now_card ${
                index === currentNow ? "active" : ""
              }`}
              onMouseEnter={() => setCurrentNow(index)}
            >
              <img src={movie.image} alt={movie.title} />
              {index === currentNow && (
                <div className="homepage_now_info">
                  <h3>{movie.title}</h3>
                  <p>Release: {movie.release}</p>
                  <div className="homepage_now_buttons">
                    <button>▶ Trailer</button>
                    <button>ℹ Detail</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* === COMING SOON === */}
      <section className="homepage_movie_section">
        <h2 className="homepage_title">🎞 Coming Soon</h2>
        <div className="homepage_movie_grid">
          {comingSoon.map((movie) => (
            <div className="homepage_movie_card" key={movie.id}>
              <img src={movie.image} alt={movie.title} />
              <div className="homepage_movie_overlay homepage_coming_overlay">
                <h3>{movie.title}</h3>
                <p>Coming Soon</p>
                <p>Release: {movie.release}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === NEWS SECTION === */}
      <section className="homepage_news_section">
        <h2 className="homepage_title">📰 Latest Movie News</h2>
        <div className="homepage_news_grid">
          {newsPosts.map((post) => (
            <div className="homepage_news_card" key={post.id}>
              <img src={post.image} alt={post.title} />
              <div className="homepage_news_info">
                <span>{post.category}</span>
                <h3>{post.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="homepage_promo_banner">
        <p>🔥 Get 20% off on your first booking this weekend only!</p>
      </div>
    </div>
  );
};

export default Home;


