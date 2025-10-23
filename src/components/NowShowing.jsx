import React from "react";
import { movies } from "../utilities/constants";
import { useNavigate } from "react-router-dom";

const NowShowing = () => {

    const navigate = useNavigate();

  return (
    <div className="w-full py-8 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Now Showing
          </h2>
          <span onClick={() => navigate("/movies")} className="text-md text-red-500 cursor-pointer hover:underline font-medium">
            See All
          </span>
        </div>

        {/* Movie Grid - fewer columns for wider cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {movies.map((movie, i) => (
            <div
              key={i}
                onClick={() => navigate(`/movies/${movie.id || i + 1}`)}
              className="rounded-lg overflow-hidden shadow hover:scale-[1.03] hover:shadow-lg transition-transform duration-300 cursor-pointer"
            >
              {/* Poster */}
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={movie.img}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Rating Bar */}
              <div className="bg-black text-white text-sm px-2 py-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="text-white-400">Rating</span> {movie.rating}/10
                </span>
                <span className="text-gray-300">{movie.votes} Recommended</span>
              </div>

              {/* Info */}
              <div className="px-2 pt-1 pb-3">
                <h3 className="font-semibold text-base text-gray-900 truncate">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {movie.genre.replaceAll("/", "|")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NowShowing;
