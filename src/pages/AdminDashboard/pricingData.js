// src/data/pricingData.js
export const demoMovies = [
  {
    id: 1,
    title: "Avengers: Endgame",
    basePrice: 100,
    adjustments: {
      day: { weekday: -10, weekend: 20 },
      hour: { normal: -5, peak: 15 },
      seats: { gold: 10, platinum: 20, box: 40 },
    },
  },
  {
    id: 2,
    title: "Inception",
    basePrice: 120,
    adjustments: {
      day: { weekday: -5, weekend: 25 },
      hour: { normal: -10, peak: 20 },
      seats: { gold: 15, platinum: 30, box: 50 },
    },
  },
];
