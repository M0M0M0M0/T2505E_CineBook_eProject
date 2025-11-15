
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-cb">
      {/* 1) Newsletter / quick CTA (optional) */}
      <div className="footer-cb-newsletter py-4">
        <div className="footer-cb-inner container d-flex align-items-center justify-content-between">
          <div className="fc-news-left d-flex align-items-center gap-3">
            <div className="fc-logo-box">
              <div className="fc-logo-text fw-bold fs-4 ">CineBook</div>
            </div>
            <div className="fc-news-text">
              <strong>Stay in touch</strong>
              <div className="fc-small">
                Get updates on new releases & offers
              </div>
            </div>
          </div>

          <form className="fc-news-form d-flex align-items-center gap-2">
            <input
              type="email"
              className="form-control"
              placeholder="Your email address"
              aria-label="Email"
              style={{ maxWidth: "250px" }}
            />
           <button type="submit" className="btn btn-custom-yellow">
            Subscribe
           </button>
          </form>
        </div>
      </div>

      {/* 2) Links columns */}
      <div className="footer-cb-links">
        <div className="footer-cb-inner container fc-grid">
          {/* Column A - About */}
          <div className="fc-col">
            <h4 className="fc-col-title">About CineBook</h4>
            <ul className="fc-list">
              <li>
                <Link to="/about" className="fc-link">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="fc-link">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column B - Explore (Movies/Theaters) */}
          <div className="fc-col">
            <h4 className="fc-col-title">Explore</h4>
            <ul className="fc-list">
              <li>
                <Link to="/movies" className="fc-link">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="fc-link">
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link to="/theaters" className="fc-link">
                  Theaters
                </Link>
              </li>
            </ul>
          </div>

          {/* Column C - Support */}
          <div className="fc-col">
            <h4 className="fc-col-title">Support</h4>
            <ul className="fc-list">
              <li>
                <Link to="/help" className="fc-link">
                  Help Center
                </Link>
              </li>
              <li>
                <a className="fc-link" href="/contact">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3) Bottom bar */}
      <div className="footer-cb-bottom">
        <div className="footer-cb-inner container fc-bottom-row">
          <div className="fc-copyright">
            © {new Date().getFullYear()} CineBook — All rights reserved.
          </div>

          <div className="fc-bottom-links">
            <Link to="/terms" className="fc-small-link">
              Terms
            </Link>
            <Link to="/privacy" className="fc-small-link">
              Privacy
            </Link>
            <Link to="/sitemap" className="fc-small-link">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
