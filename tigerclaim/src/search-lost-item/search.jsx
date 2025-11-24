import React, { useState, useEffect } from "react";
import "./search.css";
//import imgWater from "../assets/water.png";
//import imgBackpack from "../assets/backpack.png";

const STORAGE_KEY = "foundItems.v1";

const SearchLostItem = () => {
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    date: "",
  });

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [claimDescription, setClaimDescription] = useState("");

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const sampleItems = [
    {
      id: "sample-1",
      name: "Water Bottle",
      category: "Accessories",
      location: "Tiger Stadium",
      date: "2025-11-05",
      description: "purple water bottle with black top and LSU on the bottle",
      claimedBy: null,
    },
    {
      id: "sample-2",
      name: "Backpack",
      category: "Clothing",
      location: "Middleton Library",
      date: "2025-11-05",
      description: "gold backpack with black straps and silver zippers" ,
      claimedBy: null,
    },
  ];

  
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let storedItems = saved ? JSON.parse(saved) : [];

    // Convert found.jsx object format → search.jsx format
    storedItems = storedItems.map((item) => ({
      id: item.id,
      name: item.itemName,
      category: item.category,
      location: item.location,
      date: item.createdAt?.slice(0, 10),
      description: item.description || "No description provided",
      claimedBy: item.claimedBy || null,
      pendingClaim: item.pendingClaim || null,
    }));

    setItems([...sampleItems, ...storedItems]);
  }, []);

  const filteredItems = items.filter((item) => {
    const matchCategory =
      !filters.category || item.category === filters.category;
    const matchLocation =
      !filters.location || item.location === filters.location;
    const matchDate = !filters.date || item.date === filters.date;

    return matchCategory && matchLocation && matchDate;
  });

  const submitClaim = () => {
    //Place Holder
    const userId = "user_123";

    const updated = items.map((item) => item.id === selectedItem.id ?
    {
        ...item, 
        pendingClaim: {userId, claimDescription},
    }
    : item
    );

    setItems(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setSelectedItem(null);
    setClaimDescription("");
};

  return (
    <div className="search-container">
      <h2 className="search-title">Search Lost Items</h2>

      {/* FILTERS */}
      <div className="filters">
        <div className="filter-group">
          <label>Category:</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
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

        <div className="filter-group">
          <label>Location:</label>
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
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

        <div className="filter-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* ITEMS GRID */}
      <div className="items-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="item-card">

            
            <div className="item-image placeholder">
              Image Not Available
            </div>

            <h3>{item.name}</h3>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Date Found:</strong> {item.date}</p>

            {/* Claim Button Logic */}
            {item.claimedBy ? (
              <p className="claimed-text">Already Claimed</p>
            ) : item.pendingClaim ? (
              <p className="pending-text">Claim Pending Approval</p>
            ) : (
              <button
                className="claim-btn"
                onClick={() => setSelectedItem(item)}
              >
                Claim Item
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Claim: {selectedItem.name}</h3>
            <p>Please describe your item so the founder can verify:</p>

            <textarea
              value={claimDescription}
              onChange={(e) => setClaimDescription(e.target.value)}
              placeholder="Describe markings, color, contents, etc..."
            />

            <div className="modal-buttons">
              <button onClick={submitClaim}>Submit Claim</button>
              <button onClick={() => setSelectedItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SearchLostItem;