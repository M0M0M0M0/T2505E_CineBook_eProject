import React from 'react';
import './LegalPages.css'; // Sử dụng file CSS chung

// Trang Điều khoản Dịch vụ
export default function Terms() {
  return (
    <div className="legal-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h1 className="display-5 fw-bold">Terms of Service</h1>
            <p className="lead">Last updated: November 15, 2025</p>

            <h2 className="fw-bold mt-5">1. Acceptance of Terms</h2>
            <p>
              Welcome to CineBook ("we," "us," or "our"). By accessing or using our website
              and services (the "Service"), you agree to be bound by these Terms of Service
              ("Terms"). If you do not agree to these Terms, please do not use the Service.
            </p>

            <h2 className="fw-bold mt-4">2. Service Description</h2>
            <p>
              CineBook provides an online platform for booking movie tickets. We are an intermediary
              between you and the theaters. We are not responsible for the quality of the movie
              or the theater's services.
            </p>

            <h2 className="fw-bold mt-4">3. Booking and Payment</h2>
            <p>
              All bookings are final. Once a ticket is purchased, it is non-refundable and
              non-transferable unless explicitly stated otherwise. You must provide accurate
              and complete information for billing and payment.
            </p>

            <h2 className="fw-bold mt-4">4. User Account</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account password.
              You agree to notify us immediately of any unauthorized use of your account.
              CineBook is not liable for any loss or damage arising from your failure to
              protect your account.
            </p>
            
            <h2 className="fw-bold mt-4">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, CineBook shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or any
              loss of profits or revenues, whether incurred directly or indirectly, or
              any loss of data, use, goodwill, or other intangible losses, resulting from
              (a) your access to or use of or inability to access or use the service;
              (b) any conduct or content of any third party on the service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}