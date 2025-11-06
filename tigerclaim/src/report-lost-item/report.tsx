import React, { useState } from "react";
import "./report.css";

const ReportFoundItem: React.FC = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [possession, setPossession] = useState("yes");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentLocation, setCurrentLocation] = useState("");
  const [roomNumber, setRoomNumber] = useState("");



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      itemName,
      category,
      location,
      possession,
      roomNumber,
      currentLocation,
      description,
      ReportFoundItem,
      photo,
    });
  };

  return (
    <div className="report-container">
      <h1>Report Found Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="itemName">Item Name:</label>
            <input id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
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


        <div className="form-group">
          <label>Last Seen Location:</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
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
            <option value="Music & Dramatic Arts Building">Music & Dramatic Arts Building</option>
            <option value="The Quad">The Quad</option>
            <option value="Tiger Stadium">Tiger Stadium</option>
            <option value="Pete Maravich Assembly Center">Pete Maravich Assembly Center</option>
          </select>
        </div>

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


        <div className="form-group">
            <label>Where is the item currently?</label>
                <select
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)} >
                <option value="Select">Select</option>
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


        <div className="form-group">
          <label>Item Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Upload Photo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          />
        </div>


        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default ReportFoundItem;
