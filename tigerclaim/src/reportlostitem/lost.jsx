import React, { useState } from "react";
import "./lost.css";

const LostItemPage = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");

  // LSU Locations
  const LSU_LOCATIONS = [
    "Middleton Library",
    "Student Union",
    "Patrick F. Taylor Hall",
    "Business Education Complex",
    "French House",
    "Lockett Hall",
    "Cox Communications Academic Center",
    "Hatcher Hall",
    "Art & Design Complex",
    "Music & Dramatic Arts Building"
  ];

  // Categories
  const CATEGORIES = [
    "Electronics",
    "Clothing",
    "Jewelry",
    "Bags & Backpacks",
    "Books",
    "IDs & Cards",
    "Miscellaneous"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const lostItemData = {
      itemName,
      category,
      dateLost,
      location,
      details,
    };

    console.log("Lost Item Submitted:", lostItemData);

    // 🔥 CLEAR ALL FIELDS AFTER SUBMIT
    setItemName("");
    setCategory("");
    setDateLost("");
    setLocation("");
    setDetails("");
  };

  return (
    <div className="reportlost-container">
      <div className="reportlost-box">
        <h1 className="lost-title">Report a Lost Item</h1>


        <form onSubmit={handleSubmit} className="lost-form">

          {/* Item Name */}
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              placeholder="AirPods, laptop, wallet…"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Date Lost */}
          <div className="form-group">
            <label>Date Lost</label>
            <input
              type="date"
              value={dateLost}
              onChange={(e) => setDateLost(e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Where did you lose it?</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              <option value="">Select a location</option>
              {LSU_LOCATIONS.map((loc, index) => (
                <option key={index} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Details */}
          <div className="form-group">
            <label>Details</label>
            <textarea
              placeholder="Describe identifying marks, colors, model numbers, etc."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit Lost Item
          </button>

        </form>
      </div>
    </div>
  );
};

export default LostItemPage;

