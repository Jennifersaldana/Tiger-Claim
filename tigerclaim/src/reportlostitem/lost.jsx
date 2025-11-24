import React, { useState } from "react";
import "./lost.css";
import { addNotification, pushNotification } from "../notifications/notifications";

const ReportLostItem = () => {
  const [itemName, setItemName] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("LOST ITEM SUBMITTED:", {
      itemName,
      location,
      details,
    });

    alert("Lost item submitted!");

    // notifs for "You reported a lost item"
    const email = localStorage.getItem("lostAndFoundUser");
    pushNotification(email, `You reported a lost item: ${itemName}`);

  };

  return (
    <div className="lost-container">
      <h2>Report a Lost Item</h2>

      <form onSubmit={handleSubmit} className="lost-form">
        <label>Item Name</label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="AirPods, laptop, wallet…"
          required
        />

        <label>Where did you lose it?</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Middleton Library, Student Union…"
          required
        />

        <label>Details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe identifying marks, etc."
        />

        <button type="submit">Submit Lost Item</button>
      </form>
    </div>
  );
};

export default ReportLostItem;
