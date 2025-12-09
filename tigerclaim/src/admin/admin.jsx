import React, { useEffect, useState } from "react";
import "./admin.css";
import { pushNotification } from "../notifications/notifications";

const FOUND_KEY = "foundItems.v1";
const LOST_KEY = "lostItems.v1";

const AdminPanel = () => {
  const [claims, setClaims] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [denyReason, setDenyReason] = useState("");
  const [showReasonBox, setShowReasonBox] = useState(null);

  useEffect(() => {
    setClaims(JSON.parse(localStorage.getItem("claims")) || []);
    setFoundItems(JSON.parse(localStorage.getItem(FOUND_KEY)) || []);
    setLostItems(JSON.parse(localStorage.getItem(LOST_KEY)) || []);
  }, []);

  const saveFound = (list) =>
    localStorage.setItem(FOUND_KEY, JSON.stringify(list));

  const saveLost = (list) =>
    localStorage.setItem(LOST_KEY, JSON.stringify(list));

  const saveClaims = (list) =>
    localStorage.setItem("claims", JSON.stringify(list));

  const markResolved = (item, type) => ({
    ...item,
    resolved: true,
    resolvedAt: Date.now(),
    resolvedMessage: "This item has been claimed or returned",
    resolvedType: type,
  });

  const approveFoundClaim = (claim) => {
    const target = foundItems.find((i) => i.id === claim.itemId);
    if (!target) return;

    const updatedFound = foundItems.map((i) =>
      i.id === target.id ? markResolved(i, "found-claim") : i
    );

    saveFound(updatedFound);
    setFoundItems(updatedFound);

    pushNotification(
      claim.userId,
      `Your claim for '${target.itemName}' was approved! Pick-up details: ${target.currentLocation || "Unknown"} ${
        target.roomNumber ? "Room " + target.roomNumber : ""
      }.`
    );

    if (target.ownerEmail) {
      pushNotification(
        target.ownerEmail,
        `Your found item '${target.itemName}' has been successfully returned.`
      );
    }
  };

  const approveLostClaim = (claim) => {
    const lostItem = lostItems.find((i) => i.id === claim.itemId);
    const foundItem = foundItems.find((i) => i.id === claim.foundItemId);

    if (lostItem) {
      const updatedLost = lostItems.map((i) =>
        i.id === lostItem.id ? markResolved(i, "lost-match") : i
      );
      saveLost(updatedLost);
      setLostItems(updatedLost);
    }

    if (foundItem) {
      const updatedFound = foundItems.map((i) =>
        i.id === foundItem.id ? markResolved(i, "lost-match") : i
      );
      saveFound(updatedFound);
      setFoundItems(updatedFound);
    }

    if (lostItem?.ownerEmail) {
      pushNotification(
        lostItem.ownerEmail,
        `A finder has returned your lost item '${lostItem.itemName}'. Finder contact: ${claim.userId}`
      );
    }

    pushNotification(
      claim.userId,
      `Your found-item match for '${lostItem?.itemName}' was approved. The owner has been notified!`
    );
  };

  const approveClaim = (claimId) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    if (claim.type === "claim-found") approveFoundClaim(claim);
    else approveLostClaim(claim);

    const updated = claims.map((c) =>
      c.id === claimId ? { ...c, status: "approved" } : c
    );

    saveClaims(updated);
    setClaims(updated);
  };

  const denyClaim = (claimId) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    pushNotification(
      claim.userId,
      `Your claim for '${claim.itemDescription}' was denied.\nReason: ${denyReason}`
    );

    const updated = claims.map((c) =>
      c.id === claimId ? { ...c, status: "denied" } : c
    );

    saveClaims(updated);
    setClaims(updated);

    setDenyReason("");
    setShowReasonBox(null);
  };

  const getItemInfo = (claim) => {
    if (claim.itemType === "found")
      return foundItems.find((i) => i.id === claim.itemId);
    if (claim.itemType === "lost")
      return lostItems.find((i) => i.id === claim.itemId);
    return null;
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Claim Review</h2>

      {claims.length === 0 ? (
        <p>No claims submitted yet.</p>
      ) : (
        <div className="claim-list">
          {claims.map((claim) => {
            const item = getItemInfo(claim);

            return (
              <div key={claim.id} className="claim-card">
                <h3 className="claim-header">Claim #{claim.id}</h3>

                <p><strong>Status:</strong> {claim.status}</p>
                <p><strong>Submitted:</strong> {new Date(claim.timestamp).toLocaleString()}</p>

                <p><strong>User Description:</strong></p>
                <p className="description-box">{claim.userDescription}</p>

                {item && (
                  <>
                    {item.photo && (
                      <img src={item.photo} alt="Item" className="admin-item-image" />
                    )}
                    <p><strong>Item Name:</strong> {item.itemName}</p>
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Location:</strong> {item.location}</p>
                    <p><strong>Date:</strong> {item.dateFound || item.dateLost}</p>

                    {item.resolved && (
                      <p className="resolved-badge">{item.resolvedMessage}</p>
                    )}
                  </>
                )}

                {claim.status === "pending" && (
                  <div className="admin-actions">
                    <button className="approve-btn" onClick={() => approveClaim(claim.id)}>
                      Approve
                    </button>
                    <button className="deny-btn" onClick={() => setShowReasonBox(claim.id)}>
                      Deny
                    </button>
                  </div>
                )}

                {showReasonBox === claim.id && (
                  <div className="deny-box">
                    <textarea
                      placeholder="Reason for denial..."
                      value={denyReason}
                      onChange={(e) => setDenyReason(e.target.value)}
                    />
                    <button className="submit-deny-btn" onClick={() => denyClaim(claim.id)}>
                      Submit Denial
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
