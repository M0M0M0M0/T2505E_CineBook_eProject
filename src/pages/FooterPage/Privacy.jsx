import React from 'react';
import './LegalPages.css'; // Sử dụng file CSS chung

// Trang Chính sách Bảo mật
export default function Privacy() {
  return (
    <div className="legal-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h1 className="display-5 fw-bold">Privacy Policy</h1>
            <p className="lead">Last updated: November 15, 2025</p>

            <h2 className="fw-bold mt-5">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account,
              book a ticket, or communicate with us. This information may include:
            </p>
            <ul>
              <li>Your name and email address</li>
              <li>Phone number</li>
              <li>Payment information (processed by a third-party secure gateway)</li>
              <li>Booking history</li>
            </ul>

            <h2 className="fw-bold mt-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Process your bookings and payments.</li>
              <li>Send you e-tickets and booking confirmations.</li>
              <li>Communicate with you about your account or our services.</li>
              <li>Send you marketing communications and newsletters (if you opt-in).</li>
              <li>Improve and personalize our Service.</li>
            </ul>

            <h2 className="fw-bold mt-4">3. Data Security</h2>
            <p>
              We take reasonable measures to protect your personal information from loss,
              theft, misuse, and unauthorized access. All payment transactions are
              encrypted using SSL technology.
            </p>

            <h2 className="fw-bold mt-4">4. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our
              Service and hold certain information. Cookies are files with a small amount of
              data which may include an anonymous unique identifier.
            </p>
            
            <h2 className="fw-bold mt-4">5. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}