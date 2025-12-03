import React, { useEffect, useState } from "react";
import "./admin.css";

const AdminPanel = () => {
  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const storedClaims = JSON.parse(localStorage.getItem("claims")) || [];

    // Load sample + user items
    const sampleItems = JSON.parse(localStorage.getItem("foundItems.v1")) || [];
    const userItems = JSON.parse(localStorage.getItem("foundItems.user")) || [];

    const allItems = [...sampleItems, ...userItems];

    setClaims(storedClaims);
    setItems(allItems);
  }, []);

  const updateClaimStatus = (claimId, status) => {
    const updatedClaims = claims.map((claim) =>
      claim.id === claimId ? { ...claim, status } : claim
    );

    setClaims(updatedClaims);
    localStorage.setItem("claims", JSON.stringify(updatedClaims));
  };

  const getItemDetails = (itemId) => {
    return items.find((item) => item.id === itemId);
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Claim Management</h2>

      {claims.length === 0 ? (
        <p className="no-claims">No claim requests submitted.</p>
      ) : (
        <div className="claim-list">
          {claims.map((claim) => {
            const item = getItemDetails(claim.itemId);

            // Apply a special CSS class ONLY if the claim is "pending"
            const cardClass =
              claim.status === "pending"
                ? "claim-card claim-pending"
                : "claim-card";

            return (
              <div key={claim.id} className={cardClass}>
                <h3>Claim Request #{claim.id}</h3>

                <p><strong>Status:</strong> {claim.status}</p>
                <p><strong>User Description:</strong> {claim.userDescription}</p>

                {item ? (
                  <>
                    <p><strong>Item Found:</strong> {item.name}</p>
                    <p><strong>Actual Description:</strong> {item.description}</p>
                    <p><strong>Location Found:</strong> {item.location}</p>
                    <p><strong>Date Found:</strong> {item.date}</p>

                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="admin-item-image"
                      />
                    )}
                  </>
                ) : (
                  <p className="missing-item-warning">
                    ⚠ The referenced item could not be found.
                  </p>
                )}

                <div className="admin-actions">
                  <button
                    className="approve-btn"
                    onClick={() => updateClaimStatus(claim.id, "approved")}
                  >
                    Approve
                  </button>

                  <button
                    className="deny-btn"
                    onClick={() => updateClaimStatus(claim.id, "denied")}
                  >
                    Deny
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
