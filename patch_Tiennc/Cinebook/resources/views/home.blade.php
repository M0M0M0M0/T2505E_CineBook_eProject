<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CineBook - Home</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #0c0c0c;
            color: #fff;
            font-family: 'Poppins', sans-serif;
        }
        .hero {
            background: url('https://i.ibb.co/ZhJ0Q6n/movie-banner.jpg') center/cover no-repeat;
            height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .hero h1 {
            font-size: 3rem;
            font-weight: 700;
            text-shadow: 0 0 20px rgba(0,0,0,0.8);
        }
        .section-title {
            font-weight: 600;
            margin: 2rem 0 1rem;
            border-left: 5px solid #e50914;
            padding-left: 10px;
        }
        .movie-card {
            background: #1a1a1a;
            border-radius: 10px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .movie-card:hover {
            transform: scale(1.05);
        }
        .movie-card img {
            width: 100%;
            height: 350px;
            object-fit: cover;
        }
        .movie-info {
            padding: 10px;
        }
        .movie-info h5 {
            color: #fff;
            font-weight: 600;
        }
        .movie-info p {
            color: #aaa;
            font-size: 14px;
        }
        .btn-book {
            background: #e50914;
            color: #fff;
            border: none;
            width: 100%;
        }
        .btn-book:hover {
            background: #b0060f;
        }
        footer {
            text-align: center;
            padding: 20px;
            color: #777;
            background: #000;
            margin-top: 40px;
        }
    </style>
</head>
<body>

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container">
            <a class="navbar-brand fw-bold text-danger" href="#">🎬 CineBook</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a href="/" class="nav-link active">Home</a></li>
                    <li class="nav-item"><a href="/movies" class="nav-link">Movies</a></li>
                    <li class="nav-item"><a href="/login" class="nav-link">Login</a></li>
                    <li class="nav-item"><a href="/register" class="nav-link">Register</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <section class="hero">
        <div>
            <h1>Discover the World of Cinema with CineBook</h1>
            <p>Watch trailers, book tickets quickly, and get exclusive offers</p>
            <a href="/movies" class="btn btn-danger mt-3 px-4 py-2">Explore Now</a>
        </div>
    </section>

    <div class="container mt-5 pt-4">
        <h3 class="section-title">🎥 Now Showing</h3>
        <div class="row">
            @foreach (['Joker: Folie à Deux', 'Inside Out 2', 'Venom 3', 'Wicked'] as $movie)
                <div class="col-md-3 mb-4">
                    <div class="movie-card">
                        <img src="https://source.unsplash.com/400x600/?movie,cinema,{{$movie}}" alt="{{ $movie }}">
                        <div class="movie-info">
                            <h5>{{ $movie }}</h5>
                            <p>Genre: Action, Drama</p>
                            <a href="/login" class="btn btn-book mt-2">Book Now</a>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        <h3 class="section-title">⏳ Coming Soon</h3>
        <div class="row">
            @foreach (['Avatar 3', 'Moana 2', 'Gladiator II', 'Frozen 3'] as $movie)
                <div class="col-md-3 mb-4">
                    <div class="movie-card">
                        <img src="https://source.unsplash.com/400x600/?film,poster,{{$movie}}" alt="{{ $movie }}">
                        <div class="movie-info">
                            <h5>{{ $movie }}</h5>
                            <p>Release: Coming soon</p>
                            <a href="/login" class="btn btn-book mt-2">Notify Me</a>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    <footer>
        <p>© 2025 CineBook | Designed by TienNC 🎬</p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
