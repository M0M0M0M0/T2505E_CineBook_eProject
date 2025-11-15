import React from 'react';
import { Link } from 'react-router-dom';
import './HelpCenter.css'; // File CSS cho giao diện dark mode

// Component Trang Trung tâm Hỗ trợ (Help Center)
export default function HelpCenter() {
  return (
    <div className="help-center-page">
      {/* 1. THANH TÌM KIẾM LỚN (HERO) */}
      <div className="hero-search-bar container text-center py-5">
        <h1 className="display-5 fw-bold mb-3">How can we help?</h1>
        <p className="lead mb-4">
          Search for answers or browse our topics below.
        </p>
        <form className="d-flex w-75 mx-auto" role="search">
          <input
            className="form-control form-control-lg me-2"
            type="search"
            placeholder="e.g., 'cancel ticket' or 'payment error'"
            aria-label="Search"
          />
          <button className="btn btn-warning btn-lg" type="submit">
            Search
          </button>
        </form>
      </div>

      {/* 2. CÁC CHỦ ĐỀ CHÍNH (GRID) */}
      <div className="help-topics-grid container py-5">
        <h2 className="text-center fw-bold mb-4">Browse by Topic</h2>
        <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-4">
          
          {/* Topic Card 1: Booking & Tickets */}
          <div className="col">
            <div className="help-topic-card h-100">
              {/* Icon (Inline SVG) */}
              <div className="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
              </div>
              <h5>Booking & Tickets</h5>
              <p>Payment, e-tickets, and booking confirmation.</p>
            </div>
          </div>

          {/* Topic Card 2: Account & Profile */}
          <div className="col">
            <div className="help-topic-card h-100">
              {/* Icon (Inline SVG) */}
              <div className="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h5>Account & Profile</h5>
              <p>Password, personal info, and membership.</p>
            </div>
          </div>

          {/* Topic Card 3: Promotions & Vouchers */}
          <div className="col">
            <div className="help-topic-card h-100">
              {/* Icon (Inline SVG) */}
              <div className="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19.5v-15m0 0l-6.5 6.5M12 4.5l6.5 6.5"/><path d="M20 21v-3a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/></svg>
              </div>
              <h5>Promotions & Vouchers</h5>
              <p>How to use promo codes and check offers.</p>
            </div>
          </div>

          {/* Topic Card 4: Theaters & Policies */}
          <div className="col">
            <div className="help-topic-card h-100">
              {/* Icon (Inline SVG) */}
              <div className="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/><path d="M2 8h20"/><path d="M19 12v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5"/><path d="M10 12h4v4h-4z"/></svg>
              </div>
              <h5>Theaters & Policies</h5>
              <p>Locations, age restrictions, and refunds.</p>
            </div>
          </div>
          
        </div>
      </div>

      {/* 3. CÂU HỎI THƯỜNG GẶP (FAQs) */}
      <div className="faq-section container py-5">
        <h2 className="text-center fw-bold mb-4">Frequently Asked Questions</h2>
        {/* Sử dụng data-bs-theme="dark" của Bootstrap 5.3+ để Accordion tự động có nền tối */}
        <div className="accordion w-75 mx-auto" id="faqAccordion" data-bs-theme="dark">
          
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                Can I cancel or change my booking?
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                Currently, all bookings are final. We do not support cancellations or changes once the ticket is purchased. Please review your order carefully before confirming payment.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                I didn't receive my e-ticket. What should I do?
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                Please check your email's Spam or Junk folder first. If it's not there, go to your 'Profile & Tickets' page on our website. All your active tickets are available there.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="headingThree">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                How do I use a promo voucher?
              </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                On the checkout page, before making the payment, you will find a field labeled 'Enter Promo Code'. Type your code there and click 'Apply' to see the discount.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. LIÊN HỆ (CONTACT) */}
      <div className="contact-box-wrapper py-5">
        <div className="container contact-box text-center p-5">
          <h2 className="fw-bold mb-3">Still need help?</h2>
          <p className="lead text-muted mb-4">
            Our support team is available 24/7 to assist you.
          </p>
          <div className="d-flex justify-content-center gap-4">
            <a href="tel:+123456789" className="btn btn-warning btn-lg">
              Hotline: 123 456 789
            </a>
            <a href="mailto:support@cinebook.com" className="btn btn-outline-warning btn-lg">
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}