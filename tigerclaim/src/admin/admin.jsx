import React, { useEffect, useState } from "react";
import "./admin.css";
import {pushNotification } from "../notifications/notifications";

const AdminPanel = () => {
  const [claims, setClaims] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [sampleItems, setSampleItems] = useState([]);

  useEffect(() => {
    const storedClaims = JSON.parse(localStorage.getItem("claims")) || [];
    const storedUserItems = JSON.parse(localStorage.getItem("foundItems.v1")) || [];
    const storedSampleItems = JSON.parse(localStorage.getItem("sampleItems")) || [];

    setClaims(storedClaims);
    setUserItems(storedUserItems);
    setSampleItems(storedSampleItems);
  }, []);

  const updateClaimStatus = (claimId, status) => {
    const updatedClaims = claims.map((claim) =>
      claim.id === claimId ? { ...claim, status } : claim
    );

    setClaims(updatedClaims);
    localStorage.setItem("claims", JSON.stringify(updatedClaims));
  };

  const getItemDetails = (itemId) => {

    return (
      userItems.find((item) => item.id === itemId) ||
      sampleItems.find((item) => item.id === itemId)
    );
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Pending Claims</h2>

      {claims.length === 0 ? (
        <p className="no-claims">No claim requests submitted.</p>
      ) : (
        <div className="claim-list">
          {claims.map((claim) => {
            const item = getItemDetails(claim.itemId);

            return (
              <div key={claim.id} className="claim-card">
                <h3 className="claim-header">Claim Request #{claim.id}</h3>

                <p><strong>Status:</strong> {claim.status}</p>
                <p><strong>Claim Submitted:</strong> {new Date(claim.timestamp).toLocaleString()}</p>

                <p><strong>User’s Lost Item Description:</strong></p>
                <p className="description-box">{claim.userDescription}</p>

                {item ? (
                  <>
                    {item.image && (
                      <img
                        src={item.image}
                        alt="Found Item"
                        className="admin-item-image"
                      />
                    )}

                    <p><strong>Found Item Name:</strong> {item.name}</p>

                    <p><strong>Found Item Description:</strong></p>
                    <p className="description-box">{item.description}</p>

                    <p><strong>Location Found:</strong> {item.location}</p>
                    <p><strong>Date Found:</strong> {item.date}</p>
                  </>
                ) : (
                  <p className="missing-item-warning">
                    ⚠ Item no longer exists in the system.
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
