import React, { useState, useEffect } from "react";
import "./search.css";

const STORAGE_KEY = "foundItems.v1";
const ADMIN_EMAIL = "admin@lsu.edu";

const SearchLostItem = () => {
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    date: "",
  });

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [claimDescription, setClaimDescription] = useState("");

  const loggedInUser = localStorage.getItem("lostAndFoundUser") || "user_123";

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
      pendingClaim: null,
      ownerEmail: null,
    },
    {
      id: "sample-2",
      name: "Backpack",
      category: "Clothing",
      location: "Middleton Library",
      date: "2025-11-05",
      description: "gold backpack with black straps and silver zippers",
      claimedBy: null,
      pendingClaim: null,
      ownerEmail: null,
    },
  ];

  
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let storedItems = saved ? JSON.parse(saved) : [];

    storedItems = storedItems.map((item) => ({
      id: item.id,
      name: item.itemName,
      category: item.category,
      location: item.location,
      date: item.createdAt?.slice(0, 10),
      description: item.description || "No description provided",
      claimedBy: item.claimedBy || null,
      pendingClaim: item.pendingClaim || null,
      ownerEmail: item.ownerEmail || null,
    }));

    setItems([...sampleItems, ...storedItems]);
  }, []);

  
  const filteredItems = items.filter((item) => {
    const matchCategory = !filters.category || item.category === filters.category;
    const matchLocation = !filters.location || item.location === filters.location;
    const matchDate = !filters.date || item.date === filters.date;
    return matchCategory && matchLocation && matchDate;
  });

  
  const submitClaim = () => {
    const userId = loggedInUser;
    const timestamp = Date.now();

    const updated = items.map((item) =>
      item.id === selectedItem.id
        ? {
            ...item,
            pendingClaim: { 
              userId, 
              claimDescription, 
              timestamp,
              foundItemDescription: item.description 
            },
          }
        : item
    );

    setItems(updated);

    const localOnly = updated.filter((i) => !i.id.startsWith("sample"));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localOnly));

    const existingClaims = JSON.parse(localStorage.getItem("claims")) || [];

    const newClaim = {
      id: Date.now(),
      itemId: selectedItem.id,
      userId,
      userDescription: claimDescription,
      foundItemDescription: selectedItem.description,
      timestamp,
      status: "pending",
    };

    const updatedClaims = [...existingClaims, newClaim];
    localStorage.setItem("claims", JSON.stringify(updatedClaims));

    setSelectedItem(null);
    setClaimDescription("");
  };

  
  const approveClaim = (itemId) => {
    const updated = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            claimedBy: item.pendingClaim.userId,
            pendingClaim: null,
          }
        : item
    );

    setItems(updated);

    const localOnly = updated.filter((i) => !i.id.startsWith("sample"));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localOnly));
  };

  const denyClaim = (itemId) => {
    const updated = items.map((item) =>
      item.id === itemId ? { ...item, pendingClaim: null } : item
    );

    setItems(updated);

    const localOnly = updated.filter((i) => !i.id.startsWith("sample"));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localOnly));
  };

  
  const adminPending = items.filter((i) => i.pendingClaim);


  return (
    <div className="search-container">
      <h2 className="search-title">Search Lost Items</h2>

      {/* ADMIN PANEL */}
      {loggedInUser === ADMIN_EMAIL && (
        <div className="admin-panel">
          <h3>Pending Claims</h3>

          {adminPending.length === 0 ? (
            <p>No pending claims.</p>
          ) : (
            adminPending.map((item) => (
              <div key={item.id} className="admin-claim-card">
                <h4>{item.name}</h4>
                <p><strong>Found At:</strong> {item.location}</p>
                <p><strong>Date Found:</strong> {item.date}</p>
                <p><strong>Found Item Description:</strong> {item.description}</p>

                <hr />

                <p><strong>User Description:</strong> {item.pendingClaim.claimDescription}</p>
                <p><strong>User ID:</strong> {item.pendingClaim.userId}</p>
                <p><strong>Timestamp:</strong> {new Date(item.pendingClaim.timestamp).toLocaleString()}</p>

                <div className="admin-actions">
                  <button className="approve-btn" onClick={() => approveClaim(item.id)}>
                    Approve
                  </button>
                  <button className="deny-btn" onClick={() => denyClaim(item.id)}>
                    Deny
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* USER FILTERS */}
      <div className="filters">
        <div className="filter-group">
          <label>Category:</label>
          <select name="category" value={filters.category} onChange={handleFilterChange}>
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
          <select name="location" value={filters.location} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Patrick F. Taylor Hall">Patrick F. Taylor Hall</option>
            <option value="Middleton Library">Middleton Library</option>
            <option value="Student Union">Student Union</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date:</label>
          <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
        </div>
      </div>

      {/* ITEMS GRID */}
      <div className="items-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-image placeholder">Image Not Available</div>

            <h3>{item.name}</h3>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Date Found:</strong> {item.date}</p>

            {item.claimedBy ? (
              <p className="claimed-text">Already Claimed</p>
            ) : item.pendingClaim ? (
              <p className="pending-text">Claim Pending Approval</p>
            ) : loggedInUser === ADMIN_EMAIL ? (
              <p className="pending-text">Admin cannot claim items</p>
            ) : (
              <button className="claim-btn" onClick={() => setSelectedItem(item)}>
                Claim Item
              </button>
            )}
          </div>
        ))}
      </div>

      {/* CLAIM MODAL */}
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Claim: {selectedItem.name}</h3>
            <p>Please describe your item:</p>

            <textarea
              value={claimDescription}
              onChange={(e) => setClaimDescription(e.target.value)}
              placeholder="Describe markings, color, contents, etc..."
            />

            <div className="modal-buttons">
              <button className="submit-btn" onClick={submitClaim}>Submit Claim</button>
              <button className="cancel-btn" onClick={() => setSelectedItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchLostItem;
