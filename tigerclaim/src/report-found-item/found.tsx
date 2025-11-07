import React, { useState, useEffect } from "react";
import "./found.css";

interface FoundItem {
  id: string;
  itemName: string;
  category: string;
  location: string;
  possession: string;
  currentLocation: string;
  roomNumber: string;
  description: string;
  photo?: string; // base64 image
  createdAt: string;
}

const STORAGE_KEY = "foundItems.v1";

// Simple UUID fallback
function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const ReportFoundItem: React.FC = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [possession, setPossession] = useState("yes");
  const [currentLocation, setCurrentLocation] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | undefined>("");
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<FoundItem[]>([]);

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
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newItem: FoundItem = {
      id: generateId(),
      itemName,
      category,
      location,
      possession,
      currentLocation,
      roomNumber,
      description,
      photo,
      createdAt: new Date().toISOString(),
    };

    setItems([newItem, ...items]);
    setMessage("Item saved locally!");
    // Reset form
    setItemName("");
    setCategory("");
    setLocation("");
    setPossession("yes");
    setCurrentLocation("");
    setRoomNumber("");
    setDescription("");
    setPhoto(undefined);
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
        </div>

        {/* Last Seen */}
        <div className="form-group">
          <label>Last Seen Location:</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Patrick F. Taylor Hall">Patrick F. Taylor Hall</option>
            <option value="Middleton Library">Middleton Library</option>
            <option value="Student Union">Student Union</option>
            <option value="Lockett Hall">Lockett Hall</option>
            <option value="Choppin Hall">Choppin Hall</option>
            <option value="Business Education Complex">Business Education Complex</option>
            <option value="French House">French House</option>
            <option value="Manship School">Manship School</option>
            <option value="Cox Communications">Cox Communications</option>
            <option value="Academic Center">Academic Center</option>
            <option value="Hatcher Hall">Hatcher Hall</option>
            <option value="Music & Dramatic Arts Building">Music & Dramatic Arts Building</option>
            <option value="Art & Design Complex">Art & Design Complex</option>
            <option value="Tureaud Hall">Tureaud Hall</option>
            <option value="Campus Recreation">Campus Recreation</option>
            <option value="Barnes & Noble (Bookstore)">Barnes & Noble (Bookstore)</option>
            <option value="The Quad">The Quad</option>
            <option value="Tiger Stadium">Tiger Stadium</option>
            <option value="Pete Maravich Assembly Center">Pete Maravich Assembly Center</option>
          </select>
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

        {/* Always show current location */}
        <div className="form-group">
          <label>Where is the item currently?</label>
          <select
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Patrick F. Taylor Hall">Patrick F. Taylor Hall</option>
            <option value="Middleton Library">Middleton Library</option>
            <option value="Student Union">Student Union</option>
            <option value="Lockett Hall">Lockett Hall</option>
            <option value="Choppin Hall">Choppin Hall</option>
            <option value="Business Education Complex">Business Education Complex</option>
            <option value="French House">French House</option>
            <option value="Manship School">Manship School</option>
            <option value="Campus Recreation">Campus Recreation</option>
            <option value="Tiger Stadium">Tiger Stadium</option>
            <option value="Other">Other (Enter manually)</option>
          </select>

          {(currentLocation === "Other" || currentLocation !== "") && (
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

        {/* Upload Photo */}
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

        <button type="submit" className="submit-btn">
          Submit
        </button>

        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      </form>
    </div>
  );
};

export default ReportFoundItem;
