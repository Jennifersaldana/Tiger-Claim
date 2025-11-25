import React, { useState } from "react";
import "./lost.css";
import { pushNotification } from "../notifications/notifications";

// LSU Locations list
const LSU_LOCATIONS = [
  "Patrick F. Taylor Hall",
  "Middleton Library",
  "Student Union",
  "Lockett Hall",
  "Choppin Hall",
  "Business Education Complex",
  "French House",
  "Manship School",
  "Cox Communications Academic Center",
  "Hatcher Hall",
  "Music & Dramatic Arts Building",
  "Art & Design Complex",
  "Tureaud Hall",
  "Campus Recreation",
  "Barnes & Noble (Bookstore)",
  "The Quad",
  "Tiger Stadium",
  "Pete Maravich Assembly Center",
  "Other",
];

// Lost item categories
const CATEGORIES = [
  "",
  "Electronics",
  "Clothing",
  "Bag",
  "IDs & Cards",
  "Books & Notebooks",
  "Keys",
  "Water Bottle",
  "Sports Gear",
  "Jewelry",
  "Other",
];

const ReportLostItem = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("LOST ITEM SUBMITTED:", {
      itemName,
      category,
      location,
      details,
    });

    alert("Lost item submitted!");

    // Notification
    const email = localStorage.getItem("lostAndFoundUser");
    pushNotification(email, `You reported a lost item: ${itemName}`);

    // Clear
    setItemName("");
    setCategory("");
    setLocation("");
    setDetails("");
  };

  return (
    <div className="lost-container">
      <h2>Report a Lost Item</h2>

      <form onSubmit={handleSubmit} className="lost-form">
        
        <label>Item Name:</label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="AirPods, laptop, wallet…"
          required
        />

        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {CATEGORIES.map((cat, index) => (
            <option key={index} value={cat}>
              {cat === "" ? "Select" : cat}
            </option>
          ))}
        </select>

        {category === "Other" && (
          <input
            type="text"
            placeholder="Enter custom category"
            onChange={(e) => setCategory(e.target.value)}
          />
        )}

        <label>Where did you lose it?</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        >
          <option value="">Select</option>
          {LSU_LOCATIONS.map((place, idx) => (
            <option key={idx} value={place}>
              {place}
            </option>
          ))}
        </select>

        {location === "Other" && (
          <input
            type="text"
            placeholder="Enter custom location"
            onChange={(e) => setLocation(e.target.value)}
          />
        )}

        <label>Details:</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe identifying marks, color, stickers, etc."
          required
        />

        <button type="submit" className="submit-btn">
          Submit Lost Item
        </button>
      </form>
    </div>
  );
};

export default ReportLostItem;
