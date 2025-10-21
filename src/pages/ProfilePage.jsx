import React from "react";
import "./ProfilePage.css";

export default function ProfilePage() {
  return (
    <div className="profile-page-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
            alt="user avatar"
            className="profile-avatar"
          />
          <div>
            <h3 className="profile-name">Nguyen Van Tien</h3>
            <p className="profile-email">tien@example.com</p>
          </div>
        </div>

        <hr className="divider" />

        <h4 className="section-title">Account Information</h4>
        <form className="profile-form">
          <div className="row mb-3">
            <div className="col-md-6">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nguyen Van Tien"
              />
            </div>
            <div className="col-md-6">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="+84 123 456 789"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label>City</label>
              <input
                type="text"
                className="form-control"
                placeholder="Hà Nội"
              />
            </div>
            <div className="col-md-6">
              <label>Language</label>
              <select className="form-control">
                <option>English</option>
                <option>Vietnamese</option>
              </select>
            </div>
          </div>

          <h4 className="section-title mt-4">Change Password</h4>
          <div className="row mb-3">
            <div className="col-md-6">
              <label>Current Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter current password"
              />
            </div>
            <div className="col-md-6">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div className="text-end mt-4">
            <button className="btn btn-warning px-4">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
