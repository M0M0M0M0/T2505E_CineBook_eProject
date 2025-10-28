/**
 * ComingSoon.jsx
 * Trang danh sách phim sắp chiếu — tách riêng khỏi Movies.jsx để tránh xung đột code.
 */

import React, { useState, useEffect } from "react";
import HeroBanner from "./components/HeroBanner";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import MovieCard from "./components/MovieCard";
import "./Movies.css"; // Dùng lại CSS từ Movies
import * as constants from "../../components/utilities/constants";

function ComingSoon() {
    const comingSoonData = constants.soons || [];
    const banners = constants.banners || [];

    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");

    // ✅ Lấy dữ liệu ban đầu
    useEffect(() => {
        setMovies(comingSoonData);
        setFilteredMovies(comingSoonData);
    }, []);

    // ✅ Lọc + tìm kiếm
    useEffect(() => {
        let results = movies.filter((movie) =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (selectedGenre) {
            results = results.filter((movie) =>
                movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())
            );
        }

        setFilteredMovies(results);
    }, [searchTerm, selectedGenre, movies]);

    return (
        <div className="movies-page-container bg-dark text-light min-vh-100">
            {/* Banner đầu trang */}
            <HeroBanner
                title="Coming Soon"
                subtitle="Upcoming movies — stay tuned!"
                banners={banners}
            />

            {/* Thanh tìm kiếm + bộ lọc */}
            <div className="movies-controls container my-4">
                <SearchBar
                    placeholder="Search for upcoming movies..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                />
                {/* <FilterPanel
                    genres={["Action", "Drama", "Fantasy", "Thriller", "Comedy"]}
                    cities={["Hanoi", "Ho Chi Minh", "Da Nang"]}
                    selectedGenre={selectedGenre}
                    selectedCity={selectedCity}
                    onGenreChange={setSelectedGenre}
                    onCityChange={setSelectedCity}
                /> */}

            </div>

            {/* Danh sách phim sắp chiếu */}
            <div className="movies-list container pb-5">
                <div className="row g-4">
                    {filteredMovies.map((movie) => (
                        <div key={movie.id} className="col-6 col-md-4 col-lg-3">
                            <MovieCard
                                movie={{
                                    title: movie.title,
                                    genre: movie.genre,
                                    rating: movie.rating,
                                    votes: movie.votes,
                                    img: movie.img,
                                    date: movie.date,
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ComingSoon;
