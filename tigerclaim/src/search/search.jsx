import React, { useState, useEffect } from "react";
import "./search.css";
import { pushNotification } from "../notifications/notifications";

const FOUND_STORAGE_KEY = "foundItems.v1";
const LOST_STORAGE_KEY = "lostItems.v1";
const ADMIN_EMAIL = "admin@lsu.edu";

const SearchLostItem = () => {
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    date: "",
  });

  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);

  const [claimTarget, setClaimTarget] = useState(null);
  const [claimDescription, setClaimDescription] = useState("");

  const loggedInUser =
    localStorage.getItem("lostAndFoundUser") || "user_123";

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // SAMPLE ITEMS NOW MARKED AS RESOLVED
  const sampleFoundItems = [
    {
      id: "sample-1",
      name: "Water Bottle",
      category: "Water Bottle",
      location: "Student Union",
      date: "2025-11-05",
      description: "purple water bottle with black top and LSU on the bottle",
      image: null,
      claimedBy: null,
      pendingClaim: null,
      ownerEmail: null,
      resolved: true,
      resolvedMessage: "This item has been claimed or returned"
    },
    {
      id: "sample-2",
      name: "Backpack",
      category: "Bag",
      location: "Middleton Library",
      date: "2025-11-05",
      description: "gold backpack with black straps and silver zippers",
      image: null,
      claimedBy: null,
      pendingClaim: null,
      ownerEmail: null,
      resolved: true,
      resolvedMessage: "This item has been claimed or returned"
    },
  ];

  useEffect(() => {
    const savedFoundRaw = localStorage.getItem(FOUND_STORAGE_KEY);
    let storedFound = savedFoundRaw ? JSON.parse(savedFoundRaw) : [];

    storedFound = storedFound.map((item) => ({
      id: item.id,
      name: item.itemName,
      category: item.category,
      location: item.location,
      date: item.dateFound || item.date || item.createdAt?.slice(0, 10) || "",
      description: item.description || "No description provided",
      image: item.photo || item.image || null,
      claimedBy: item.claimedBy || null,
      pendingClaim: item.pendingClaim || null,
      ownerEmail: item.ownerEmail || null,
      resolved: item.resolved || false,
      resolvedMessage: item.resolvedMessage || null,
    }));

    setFoundItems([...sampleFoundItems, ...storedFound]);

    const savedLostRaw = localStorage.getItem(LOST_STORAGE_KEY);
    let storedLost = savedLostRaw ? JSON.parse(savedLostRaw) : [];

    storedLost = storedLost.map((item) => ({
      id: item.id,
      name: item.itemName,
      category: item.category,
      location: item.location,
      date: item.dateLost || item.date || item.createdAt?.slice(0, 10) || "",
      description: item.description || "",
      image: item.photo || null,
      pendingClaim: item.pendingClaim || null,
      ownerEmail: item.ownerEmail || null,
      resolved: item.resolved || false,
      resolvedMessage: item.resolvedMessage || null,
    }));

    setLostItems(storedLost);
  }, []);

  const applyFilters = (items) =>
    items.filter((item) => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.location && item.location !== filters.location) return false;
      if (filters.date && item.date !== filters.date) return false;
      return true;
    });

  const activeFound = applyFilters(foundItems.filter((i) => !i.resolved));
  const activeLost = applyFilters(lostItems.filter((i) => !i.resolved));

  const resolvedFound = foundItems.filter((i) => i.resolved);
  const resolvedLost = lostItems.filter((i) => i.resolved);

  const submitClaim = () => {
    if (!claimTarget) return;

    const userId = loggedInUser;
    const timestamp = Date.now();

    const existingClaims = JSON.parse(localStorage.getItem("claims")) || [];

    const newClaim = {
      id: timestamp,
      userId,
      timestamp,
      status: "pending",
      userDescription: claimDescription,
      type: claimTarget.type === "found" ? "claim-found" : "claim-lost",
      itemType: claimTarget.type,
      itemId: claimTarget.item.id,
      itemDescription: claimTarget.item.description,
      itemFoundLocation: claimTarget.item.location,
      itemDate: claimTarget.item.date,
    };

    localStorage.setItem("claims", JSON.stringify([...existingClaims, newClaim]));

    pushNotification(
      userId,
      claimTarget.type === "found"
        ? `You claimed: ${claimTarget.item.name}. Await admin review.`
        : `You reported that you found: ${claimTarget.item.name}. Await admin review.`
    );

    setClaimTarget(null);
    setClaimDescription("");
  };

  return (
    <div className="search-container">
      <h2 className="search-title">Search Lost & Found Items</h2>

      {/* FILTERS */}
      <div className="filters">
        <div className="filter-group">
          <label>Category:</label>
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Water Bottle">Water Bottle</option>
            <option value="Bag">Bag</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="IDs & Cards">IDs & Cards</option>
            <option value="Books & Notebooks">Books & Notebooks</option>
            <option value="Keys">Keys</option>
            <option value="Sports Gear">Sports Gear</option>
            <option value="Jewelry">Jewelry</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Location:</label>
          <select name="location" value={filters.location} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Student Union">Student Union</option>
            <option value="Middleton Library">Middleton Library</option>
            <option value="The Quad">The Quad</option>
            <option value="Patrick F. Taylor Hall">Patrick F. Taylor Hall</option>
            <option value="Business Education Complex">Business Education Complex</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date:</label>
          <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
        </div>
      </div>

      {/* ACTIVE FOUND ITEMS */}
      <h3>Found Items</h3>
      <div className="items-grid">
        {activeFound.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-image">
              <div className="placeholder">Image Hidden</div>
            </div>
            <h3>{item.name}</h3>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Date Found:</strong> {item.date}</p>

            {!item.pendingClaim ? (
              loggedInUser !== ADMIN_EMAIL && (
                <button className="claim-btn" onClick={() => setClaimTarget({ type: "found", item })}>
                  Claim Item
                </button>
              )
            ) : (
              <p className="pending-text">Pending Admin Review</p>
            )}
          </div>
        ))}
      </div>

      {/* ACTIVE LOST ITEMS */}
      <h3>Lost Items</h3>
      <div className="items-grid">
        {activeLost.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-image">
              <div className="placeholder">Image Hidden</div>
            </div>
            <h3>{item.name}</h3>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Date Lost:</strong> {item.date}</p>

            {!item.pendingClaim ? (
              loggedInUser !== ADMIN_EMAIL && (
                <button className="claim-btn" onClick={() => setClaimTarget({ type: "lost", item })}>
                  I found this item
                </button>
              )
            ) : (
              <p className="pending-text">Pending Admin Review</p>
            )}
          </div>
        ))}
      </div>

      {/* CLAIMED / RETURNED SECTION */}
      <h3 className="claimed-title">Claimed or Returned Items</h3>
      <div className="items-grid">
        {[...resolvedFound, ...resolvedLost].map((item) => (
          <div key={item.id} className="item-card resolved-card">
            <div className="item-image">
              <div className="placeholder">Image Hidden</div>
            </div>
            <h3>{item.name}</h3>
            <p><strong>Location:</strong> {item.location}</p>
            <p className="resolved-text">{item.resolvedMessage}</p>
          </div>
        ))}
      </div>

      {/* CLAIM POPUP */}
      {claimTarget && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{claimTarget.type === "found" ? "Claim Item" : "Found This Item"}</h3>

            <textarea
              placeholder="Describe details for verification..."
              value={claimDescription}
              onChange={(e) => setClaimDescription(e.target.value)}
              required
            />

            <div className="modal-buttons">
              <button onClick={submitClaim}>Submit</button>
              <button onClick={() => setClaimTarget(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchLostItem;
