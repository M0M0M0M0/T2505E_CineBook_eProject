<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login - CineBook</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-dark text-light d-flex justify-content-center align-items-center" style="height: 100vh;">
  <div class="card bg-black text-light p-4 shadow-lg" style="width: 380px; border-radius: 15px;">
    <h2 class="text-center text-danger fw-bold mb-4">🎬 CineBook</h2>
    <h5 class="text-center mb-4">Welcome Back!</h5>

    <form>
      <div class="mb-3">
        <label class="form-label">Email address</label>
        <input type="email" class="form-control bg-dark text-white border-secondary" placeholder="Enter your email">
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password" class="form-control bg-dark text-white border-secondary" placeholder="Enter your password">
      </div>
      <button type="submit" class="btn btn-danger w-100">Sign In</button>
    </form>

    <p class="text-center mt-3">
      Don’t have an account? <a href="/register" class="text-warning">Sign up</a>
    </p>
  </div>
</body>
</html>
