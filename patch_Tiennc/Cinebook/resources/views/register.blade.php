<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Register - CineBook</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-dark text-light d-flex justify-content-center align-items-center" style="height: 100vh;">
  <div class="card bg-black text-light p-4 shadow-lg" style="width: 400px; border-radius: 15px;">
    <h2 class="text-center text-danger fw-bold mb-3">🎬 CineBook</h2>
    <h5 class="text-center mb-4">Create Your Account</h5>

    <form>
      <div class="mb-3">
        <label class="form-label">Full Name</label>
        <input type="text" class="form-control bg-dark text-white border-secondary" placeholder="Enter your full name">
      </div>
      <div class="mb-3">
        <label class="form-label">Email address</label>
        <input type="email" class="form-control bg-dark text-white border-secondary" placeholder="Enter your email">
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password" class="form-control bg-dark text-white border-secondary" placeholder="Create a password">
      </div>
      <button type="submit" class="btn btn-danger w-100">Sign Up</button>
    </form>

    <p class="text-center mt-3">
      Already have an account? <a href="/login" class="text-warning">Sign in</a>
    </p>
  </div>
</body>
</html>
