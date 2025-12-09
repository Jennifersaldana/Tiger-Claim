import React from "react";
import "./homepage.css";
import lsuImage from "../assets/lsu-logo.svg";

const HomePage = ({ user }) => {
  const goTo = (page) => {
    window.dispatchEvent(new CustomEvent("nav", { detail: page }));
  };

  return (
    <div className="home-container">

      <div className="home-card welcome-flex">
        <img src={lsuImage} alt="LSU Campus" className="welcome-img" />

        <div className="welcome-text">
          <h1>Welcome, {user ? user.split("@")[0] : "Tiger"}!</h1>
          <p>Your one-stop solution for reporting and finding lost & found items on campus.</p>
        </div>
      </div>

      <div className="feature-section">
        <h2>How Tiger Claim Works</h2>

        <div className="feature-grid">

          <div
            className="feature-card clickable"
            onClick={() => goTo("search")}
          >
            <h3>Search Items</h3>
            <p>
              Browse all reported lost & found items.  
              Filter by category, location, or date.
            </p>
          </div>

          {/* REPORT */}
          <div
            className="feature-card clickable"
            onClick={() => goTo("report")}
          >
            <h3>Report an Item</h3>
            <p>
              Lost or found something?  
              Submit a report so others can help you recover it.
            </p>
          </div>

        </div>
      </div>

      <div className="map-wrapper">
        <iframe
          src="https://map.concept3d.com/?id=743#!ct/0?s/"
          title="LSU Campus Map"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      <div className="contact-section">
        <h2>Connect With Us</h2>
        <div className="contact-grid">
          <div className="contact-card">
            <h3>Email</h3>
            <p> <a href="mailto:support@tigerclaim.lsu.edu" className="email-link">
          support@tigerclaim.lsu.edu </a> </p>

          </div>
          <div className="contact-card">
            <h3>Phone</h3>
            <p>(225) 555-1234</p>
          </div>
          <div className="contact-card">
            <h3>Visit Us</h3>
            <p>Student Union - Lost & Found Desk</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
