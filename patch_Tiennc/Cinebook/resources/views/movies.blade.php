<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Movies - CineBook</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { background-color: #111; color: #fff; font-family: 'Poppins', sans-serif; }
    .movie-card { background: #1a1a1a; border-radius: 12px; overflow: hidden; transition: 0.3s; }
    .movie-card:hover { transform: scale(1.05); box-shadow: 0 0 15px rgba(255,0,0,0.4); }
    .movie-card img { width: 100%; height: 360px; object-fit: cover; }
    .movie-title { font-size: 1.2rem; font-weight: 600; }
    .navbar { background: #000; }
  </style>
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark">
  <div class="container">
    <a class="navbar-brand text-danger fw-bold" href="/">🎬 CineBook</a>
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a href="/movies" class="nav-link active">Movies</a></li>
        <li class="nav-item"><a href="/login" class="nav-link">Login</a></li>
        <li class="nav-item"><a href="/register" class="nav-link">Register</a></li>
      </ul>
    </div>
  </div>
</nav>

<div class="container py-5">
  <h2 class="text-danger fw-bold mb-4">🔥 Now Showing</h2>
  <div class="row">
    @foreach (['Dune 2', 'Deadpool & Wolverine', 'Inside Out 2', 'Venom 3', 'Joker: Folie à Deux', 'Avatar 3'] as $movie)
    <div class="col-md-3 mb-4">
      <div class="movie-card">
        <img src="https://source.unsplash.com/400x600/?cinema,{{ $movie }}" alt="{{ $movie }}">
        <div class="p-3">
          <div class="movie-title mb-1">{{ $movie }}</div>
          <p class="text-secondary mb-2">Genre: Sci-Fi / Action</p>
          <a href="/login" class="btn btn-danger w-100">Book Now</a>
        </div>
      </div>
    </div>
    @endforeach
  </div>
</div>
</body>
</html>
