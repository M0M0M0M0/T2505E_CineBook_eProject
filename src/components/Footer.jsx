// src/components/Footer.jsx
/**
 * Footer.jsx
 * - Place file at: src/components/Footer.jsx
 * - CSS file: src/components/Footer.css (should be in same folder)
 *
 * Layout (top → bottom):
 * 1) Optional newsletter / quick search row
 * 2) Link columns (About, Support, Explore)
 * 3) Contact & social
 * 4) Bottom bar: copyright + small links
 *
 * Notes:
 * - Logo is left as placeholder; replace with <img src="/images/logo.png" /> when ready.
 * - Links use <Link> where internal (react-router), <a> for external.
 * - All classNames prefixed footer-cb / fc-*
 * - Mobile: columns collapse into stacked layout.
 */

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
            <button type="submit" className="btn btn-danger">
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
              <li>
                <Link to="/press" className="fc-link">
                  Press
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
                <Link to="/movies?filter=coming" className="fc-link">
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
                <Link to="/faq" className="fc-link">
                  FAQ
                </Link>
              </li>
              <li>
                <a className="fc-link" href="/contact">
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          {/* Column D - Contact & Social */}
          <div className="fc-col">
            <h4 className="fc-col-title">Contact</h4>
            <div className="fc-contact">
              <div className="fc-contact-line">
                Hotline:{" "}
                <a href="tel:+840123456789" className="fc-link">
                  +84 0123 456 789
                </a>
              </div>
              <div className="fc-contact-line">
                Email:{" "}
                <a href="mailto:info@cinebook.local" className="fc-link">
                  info@cinebook.local
                </a>
              </div>
            </div>

            <div className="fc-social">
              {/* Replace # with real social links */}
              <a className="fc-social-link" href="#" aria-label="Facebook">
                Fb
              </a>
              <a className="fc-social-link" href="#" aria-label="Instagram">
                Ig
              </a>
              <a className="fc-social-link" href="#" aria-label="Youtube">
                Yt
              </a>
            </div>
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
