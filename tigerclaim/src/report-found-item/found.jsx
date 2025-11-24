import React, { useState, useEffect } from "react";
import "./found.css";
import { addNotification, pushNotification } from "../notifications/notifications";

const STORAGE_KEY = "foundItems.v1";

// Reusable LSU locations list
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
  "Other"
];

// Simple UUID fallback
function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const ReportFoundItem = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [categoryOther, setCategoryOther] = useState("");
  const [location, setLocation] = useState("");
  const [locationOther, setLocationOther] = useState("");

  const [dateFound, setDateFound] = useState("");

  const [possession, setPossession] = useState("yes");
  const [currentLocation, setCurrentLocation] = useState("");
  const [currentOther, setCurrentOther] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever list changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      id: generateId(),
      itemName,
      category: category === "Other" ? categoryOther : category,
      location: location === "Other" ? locationOther : location,
      dateFound,
      possession,
      currentLocation:
        currentLocation === "Other" ? currentOther : currentLocation,
      roomNumber,
      description,
      photo,
      createdAt: new Date().toISOString(),
    };

    setItems([newItem, ...items]);
    setMessage("Item saved locally!");
    const email = localStorage.getItem("lostAndFoundUser");
    pushNotification(email, `You reported a found item: ${itemName}`);

    // Reset form
    setItemName("");
    setCategory("");
    setCategoryOther("");
    setLocation("");
    setLocationOther("");
    setDateFound("");
    setPossession("yes");
    setCurrentLocation("");
    setCurrentOther("");
    setRoomNumber("");
    setDescription("");
    setPhoto("");
  };

  return (
    <div className="report-container">
      <h1>Report Found Item</h1>
      <form onSubmit={handleSubmit}>

        {/* Item Name */}
        <div className="form-group">
          <label htmlFor="itemName">Item Name:</label>
          <input
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Bag">Bag</option>
            <option value="IDs & Cards">IDs & Cards</option>
            <option value="Books & Notebooks">Books & Notebooks</option>
            <option value="Keys">Keys</option>
            <option value="Water Bottle">Water Bottle</option>
            <option value="Sports Gear">Sports Gear</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Other">Other</option>
          </select>
          {/* Other for Category */}
          {category === "Other" && (
            <input
              type="text"
              placeholder="Enter custom category"
              value={categoryOther}
              onChange={(e) => setCategoryOther(e.target.value)}
              style={{ marginTop: "8px" }}
              required
            />
          )}
        </div>

        {/* Date Found */}
        <div className="form-group">
          <label>Date Found:</label>
          <input
            type="date"
            value={dateFound}
            onChange={(e) => setDateFound(e.target.value)}
            required
          />
        </div>

        {/* Last Seen Location */}
        <div className="form-group">
          <label>Last Seen Location:</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select</option>
            {LSU_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Other for Location */}
          {location === "Other" && (
            <input
              type="text"
              placeholder="Enter location"
              value={locationOther}
              onChange={(e) => setLocationOther(e.target.value)}
              style={{ marginTop: "8px" }}
              required
            />
          )}
        </div>

        {/* Possession */}
        <div className="form-group radio-group">
          <label>Are you in possession of the item?</label>
          <div>
            <label>
              <input
                type="radio"
                value="yes"
                checked={possession === "yes"}
                onChange={(e) => setPossession(e.target.value)}
              />
              Yes
            </label>

            <label>
              <input
                type="radio"
                value="no"
                checked={possession === "no"}
                onChange={(e) => setPossession(e.target.value)}
              />
              No
            </label>
          </div>
        </div>

        {/* Current item location */}
        <div className="form-group">
          <label>Where is the item currently?</label>
          <select
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
          >
            <option value="">Select</option>
            {LSU_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Other for current location */}
          {currentLocation === "Other" && (
            <input
              type="text"
              placeholder="Enter location"
              value={currentOther}
              onChange={(e) => setCurrentOther(e.target.value)}
              style={{ marginTop: "8px" }}
              required
            />
          )}

          {/* Room number */}
          {(currentLocation !== "" || currentOther !== "") && (
            <input
              type="text"
              placeholder="Enter room number (e.g., Room 132)"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              style={{ marginTop: "8px" }}
            />
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Item Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Photo Upload */}
        <div className="form-group">
          <label>Upload Photo:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {photo && (
            <img
              src={photo}
              alt="preview"
              style={{
                marginTop: "10px",
                width: "120px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          )}
        </div>

        <button type="submit" className="submit-btn">Submit</button>
        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      </form>
    </div>
  );
};

export default ReportFoundItem;
