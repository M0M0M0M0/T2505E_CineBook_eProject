import React from "react";
import { soons } from "../utilities/constants";

const ComingSoon = () => {
  return (
    <div className="w-full py-8 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Coming Soon
          </h2>
        </div>

        {/* Movie Grid - fewer columns for wider cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {soons.map((soon, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden shadow hover:scale-[1.03] hover:shadow-lg transition-transform duration-300 cursor-pointer"
            >
              {/* Poster */}
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={soon.img}
                  alt={soon.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Release Date Bar */}
              <div className="bg-black text-white text-sm px-2 py-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="text-gray-300">Release Date:</span>
                  <span className="text-white font-medium">{soon.date}</span>
                </span>
              </div>

              {/* Info */}
              <div className="px-2 pt-1 pb-3">
                <h3 className="font-semibold text-base text-gray-900 truncate">
                  {soon.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {soon.genre.replaceAll("/", "|")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
