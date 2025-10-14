import React, { useState, useEffect, useRef } from "react";
import "./Home.css";

// === IMAGES ===
import featured1 from "../../assets/images/featured1.jpg";
import featured2 from "../../assets/images/featured2.jpg";
import featured3 from "../../assets/images/featured3.jpg";
import movie1 from "../../assets/images/movie1.jpg";
import movie2 from "../../assets/images/movie2.jpg";
import movie3 from "../../assets/images/movie3.jpg";
import movie4 from "../../assets/images/movie4.jpg";
import news1 from "../../assets/images/movie1.jpg";
import news2 from "../../assets/images/movie2.jpg";
import news3 from "../../assets/images/movie3.jpg";

const Home = () => {
  // ===== HERO BANNER =====
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

  // ===== NOW SHOWING =====
  const nowShowing = [
    { id: 1, title: "Jumanji: Welcome to the Jungle", image: movie1 },
    { id: 2, title: "Avatar: The Way of Water", image: movie2 },
    { id: 3, title: "The Batman", image: movie3 },
    { id: 4, title: "Spider-Man: No Way Home", image: movie4 },
  ];

  const [activeNow, setActiveNow] = useState(0);
  const nowRef = useRef(null);

  // Auto scroll + center active card
  useEffect(() => {
    const scrollToActive = () => {
      if (!nowRef.current) return;
      const cards = nowRef.current.children;
      if (!cards[activeNow]) return;

      const containerWidth = nowRef.current.clientWidth;
      const card = cards[activeNow];
      const offset =
        card.offsetLeft - containerWidth / 2 + card.offsetWidth / 2;
      nowRef.current.scrollTo({
        left: offset,
        behavior: "smooth",
      });
    };
    scrollToActive();
  }, [activeNow]);

  // Auto cycle through movies
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNow((prev) => (prev + 1) % nowShowing.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // ===== TRENDING =====
  const trending = [
    { id: 1, title: "The Flash", image: movie2 },
    { id: 2, title: "Oppenheimer", image: movie3 },
    { id: 3, title: "Doctor Strange 2", image: movie1 },
    { id: 4, title: "Black Panther 2", image: movie4 },
  ];

  const trendingRef = useRef(null);
  const handleTrending = (dir) => {
    if (!trendingRef.current) return;
    const width = trendingRef.current.firstChild.offsetWidth + 20;
    trendingRef.current.scrollBy({
      left: dir === "next" ? width : -width,
      behavior: "smooth",
    });
  };

  // ===== COMING SOON =====
  const comingSoon = [
    { id: 1, title: "Dune Part II", release: "Nov 12, 2025", image: movie1 },
    { id: 2, title: "Frozen III", release: "Dec 01, 2025", image: movie2 },
    { id: 3, title: "Avengers: Secret Wars", release: "Feb 20, 2026", image: movie3 },
    { id: 4, title: "Inside Out 2", release: "Aug 15, 2025", image: movie4 },
  ];

  const comingRef = useRef(null);
  const handleComing = (dir) => {
    if (!comingRef.current) return;
    const width = comingRef.current.firstChild.offsetWidth + 20;
    comingRef.current.scrollBy({
      left: dir === "next" ? width : -width,
      behavior: "smooth",
    });
  };

  // ===== NEWS =====
  const news = [
    { id: 1, title: "Tom Holland Talks About Spider-Man Future", type: "Interview", image: news1 },
    { id: 2, title: "Inside the Making of Oppenheimer", type: "Review", image: news2 },
    { id: 3, title: "Upcoming K-Drama Takes Over Netflix", type: "Drama", image: news3 },
  ];

  return (
    <div className="homepage_main">
      {/* === HERO === */}
      <section className="homepage_hero_banner">
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
          {featuredMovies.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`homepage_banner_dot ${currentSlide === i ? "active" : ""}`}
            ></button>
          ))}
        </div>
      </section>

      {/* === NOW SHOWING === */}
      <section className="homepage_now_playing">
        <h2 className="homepage_title">Now Showing</h2>
        <div ref={nowRef} className="homepage_now_slider">
          {nowShowing.map((movie, i) => (
            <div
              key={movie.id}
              className={`homepage_now_card ${activeNow === i ? "active" : ""}`}
            >
              <img src={movie.image} alt={movie.title} />
              <div className="homepage_now_info">
                <h3>{movie.title}</h3>
                <div className="homepage_now_buttons">
                  <button>Trailer</button>
                  <button>Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === TRENDING === */}
      <section className="homepage_movie_section">
        <div className="homepage_movie_slider_controls">
          <button onClick={() => handleTrending("prev")}>❮</button>
          <button onClick={() => handleTrending("next")}>❯</button>
        </div>
        <h2 className="homepage_title">Trending Movies</h2>
        <div ref={trendingRef} className="homepage_movie_grid_scroll">
          {trending.map((movie) => (
            <div key={movie.id} className="homepage_movie_card">
              <img src={movie.image} alt={movie.title} />
              <div className="homepage_movie_overlay">
                <span className="homepage_rating">PG-13</span>
                <h3>{movie.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === COMING SOON === */}
      <section className="homepage_movie_section">
        <div className="homepage_movie_slider_controls">
          <button onClick={() => handleComing("prev")}>❮</button>
          <button onClick={() => handleComing("next")}>❯</button>
        </div>
        <h2 className="homepage_title">Coming Soon</h2>
        <div ref={comingRef} className="homepage_movie_grid_scroll">
          {comingSoon.map((movie) => (
            <div key={movie.id} className="homepage_movie_card">
              <img src={movie.image} alt={movie.title} />
              <div className="homepage_movie_overlay homepage_coming_overlay">
                <h3>{movie.title}</h3>
                <p>Release: {movie.release}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === NEWS === */}
      <section className="homepage_news_section">
        <h2 className="homepage_title">Latest News</h2>
        <div className="homepage_news_grid">
          {news.map((post) => (
            <div key={post.id} className="homepage_news_card">
              <img src={post.image} alt={post.title} />
              <div className="homepage_news_info">
                <span>{post.type}</span>
                <h3>{post.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
