import React, { useState, useEffect } from "react";
import { pushNotification } from "../notifications/notifications";
import "./report.css";

const FOUND_STORAGE_KEY = "foundItems.v1";
const LOST_STORAGE_KEY = "lostItems.v1";
const ADMIN = "admin@lsu.edu";

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
  "Other",
];

const CATEGORIES = [
  "",
  "Electronics",
  "Clothing",
  "Bag",
  "Wallets/Purses",
  "IDs & Cards",
  "Books & Notebooks",
  "Keys",
  "Water Bottle",
  "Sports Gear",
  "Jewelry",
  "Scooter/Bikes",
  "Other",
];

function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const todayStr = new Date().toISOString().split("T")[0];

const ReportPage = () => {
  const loggedInUser = localStorage.getItem("lostAndFoundUser") || "";

  const [role, setRole] = useState(null);

  const [lostId, setLostId] = useState(null);
  const [lostItemName, setLostItemName] = useState("");
  const [lostCategory, setLostCategory] = useState("");
  const [lostLocation, setLostLocation] = useState("");
  const [lostLocationOther, setLostLocationOther] = useState("");
  const [lostDate, setLostDate] = useState("");
  const [lostDetails, setLostDetails] = useState("");
  const [lostPhoto, setLostPhoto] = useState("");

  const [foundId, setFoundId] = useState(null);
  const [foundItemName, setFoundItemName] = useState("");
  const [foundCategory, setFoundCategory] = useState("");
  const [foundCategoryOther, setFoundCategoryOther] = useState("");
  const [foundLocation, setFoundLocation] = useState("");
  const [foundLocationOther, setFoundLocationOther] = useState("");
  const [foundDate, setFoundDate] = useState("");
  const [foundPossession, setFoundPossession] = useState("yes");
  const [foundCurrentLocation, setFoundCurrentLocation] = useState("");
  const [foundCurrentOther, setFoundCurrentOther] = useState("");
  const [foundRoomNumber, setFoundRoomNumber] = useState("");
  const [foundDescription, setFoundDescription] = useState("");
  const [foundPhoto, setFoundPhoto] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchCandidates, setMatchCandidates] = useState([]);
  const [pendingFoundDraft, setPendingFoundDraft] = useState(null);

  const resetAllForms = () => {
    setLostId(null);
    setLostItemName("");
    setLostCategory("");
    setLostLocation("");
    setLostLocationOther("");
    setLostDate("");
    setLostDetails("");
    setLostPhoto("");

    setFoundId(null);
    setFoundItemName("");
    setFoundCategory("");
    setFoundCategoryOther("");
    setFoundLocation("");
    setFoundLocationOther("");
    setFoundDate("");
    setFoundPossession("yes");
    setFoundCurrentLocation("");
    setFoundCurrentOther("");
    setFoundRoomNumber("");
    setFoundDescription("");
    setFoundPhoto("");

    setIsEditing(false);
    setEditingType(null);
    setRole(null);
    setPendingFoundDraft(null);
  };

  useEffect(() => {
    const raw = localStorage.getItem("editReportMeta");
    if (!raw) return;

    try {
      const meta = JSON.parse(raw);
      if (!meta || !meta.reportType || !meta.reportId) return;

      if (meta.reportType === "lost") {
        const listRaw = localStorage.getItem(LOST_STORAGE_KEY);
        const list = listRaw ? JSON.parse(listRaw) : [];
        const item = list.find((i) => i.id === meta.reportId);
        if (item) {
          setRole("owner");
          setIsEditing(true);
          setEditingType("lost");
          setLostId(item.id);
          setLostItemName(item.itemName || "");
          setLostCategory(item.category || "");
          setLostLocation(item.location || "");
          setLostDate(item.dateLost || item.date || "");
          setLostDetails(item.description || "");
          setLostPhoto(item.photo || "");
        }
      } else if (meta.reportType === "found") {
        const listRaw = localStorage.getItem(FOUND_STORAGE_KEY);
        const list = listRaw ? JSON.parse(listRaw) : [];
        const item = list.find((i) => i.id === meta.reportId);
        if (item) {
          setRole("finder");
          setIsEditing(true);
          setEditingType("found");
          setFoundId(item.id);
          setFoundItemName(item.itemName || "");
          setFoundCategory(item.category || "");
          setFoundLocation(item.location || "");
          setFoundDate(item.dateFound || item.date || "");
          setFoundPossession(item.possession || "yes");
          setFoundCurrentLocation(item.currentLocation || "");
          setFoundRoomNumber(item.roomNumber || "");
          setFoundDescription(item.description || "");
          setFoundPhoto(item.photo || item.image || "");
        }
      }
    } catch {}
    finally {
      localStorage.removeItem("editReportMeta");
    }
  }, []);

  const handleLostPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLostPhoto(ev.target?.result || "");
    reader.readAsDataURL(file);
  };

  const handleFoundPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFoundPhoto(ev.target?.result || "");
    reader.readAsDataURL(file);
  };

  const handleLostSubmit = (e) => {
    e.preventDefault();
    const email = loggedInUser;

    const listRaw = localStorage.getItem(LOST_STORAGE_KEY);
    const list = listRaw ? JSON.parse(listRaw) : [];

    const locationFinal =
      lostLocation === "Other" ? lostLocationOther : lostLocation;

    if (isEditing && editingType === "lost" && lostId) {
      const updated = list.map((item) =>
        item.id === lostId
          ? {
              ...item,
              itemName: lostItemName,
              category: lostCategory,
              location: locationFinal,
              dateLost: lostDate,
              description: lostDetails,
              photo: lostPhoto,
            }
          : item
      );
      localStorage.setItem(LOST_STORAGE_KEY, JSON.stringify(updated));
      pushNotification(email, `Your lost item report was updated: ${lostItemName}`);
      alert("Lost report updated.");
      resetAllForms();
      return;
    }

    const newId = generateId();
    const newItem = {
      id: newId,
      itemName: lostItemName,
      category: lostCategory,
      location: locationFinal,
      dateLost: lostDate,
      description: lostDetails,
      photo: lostPhoto,
      ownerEmail: email,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(LOST_STORAGE_KEY, JSON.stringify([newItem, ...list]));
    pushNotification(email, `You reported a lost item: ${lostItemName}`, {
      type: "edit-report",
      reportType: "lost",
      reportId: newId,
    });

    alert("Lost item submitted!");
    resetAllForms();
  };

  const findLostMatches = (draft) => {
    const listRaw = localStorage.getItem(LOST_STORAGE_KEY);
    const lostList = listRaw ? JSON.parse(listRaw) : [];

    const words =
      draft.description
        ?.toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length >= 3) || [];

    return lostList.filter((lost) => {
      const lostDesc = (lost.description || "").toLowerCase();
      const overlap = words.filter((w) => lostDesc.includes(w)).length;
      const catMatch =
        draft.category === lost.category ||
        draft.category === "" ||
        lost.category === "";
      const locMatch =
        draft.location === lost.location ||
        draft.location === "" ||
        lost.location === "";

      return overlap >= 1 || catMatch || locMatch;
    });
  };

  const handleFoundStartSubmit = (e) => {
    e.preventDefault();
    const email = loggedInUser;

    const locationFinal =
      foundLocation === "Other" ? foundLocationOther : foundLocation;
    const categoryFinal =
      foundCategory === "Other" ? foundCategoryOther : foundCategory;

    const draft = {
      id: foundId || generateId(),
      itemName: foundItemName,
      category: categoryFinal,
      location: locationFinal,
      dateFound: foundDate,
      possession: foundPossession,
      currentLocation:
        foundCurrentLocation === "Other"
          ? foundCurrentOther
          : foundCurrentLocation,
      roomNumber: foundRoomNumber,
      description: foundDescription,
      photo: foundPhoto,
      ownerEmail: email,
      createdAt: new Date().toISOString(),
    };

    const matches = findLostMatches(draft);
    setPendingFoundDraft(draft);

    if (matches.length > 0) {
      setMatchCandidates(matches);
      setMatchModalOpen(true);
    } else {
      saveFoundWithoutMatch(draft, email);
    }
  };

  const saveFoundWithoutMatch = (draft, email) => {
    const listRaw = localStorage.getItem(FOUND_STORAGE_KEY);
    const list = listRaw ? JSON.parse(listRaw) : [];

    let updated;
    if (isEditing && editingType === "found" && foundId) {
      updated = list.map((i) =>
        i.id === foundId ? { ...i, ...draft, id: foundId } : i
      );
      pushNotification(email, `Your found report was updated: ${draft.itemName}`);
      alert("Found report updated.");
    } else {
      updated = [draft, ...list];
      pushNotification(email, `You reported a found item: ${draft.itemName}`, {
        type: "edit-report",
        reportType: "found",
        reportId: draft.id,
      });
      alert("Found item submitted!");
    }

    localStorage.setItem(FOUND_STORAGE_KEY, JSON.stringify(updated));
    resetAllForms();
  };

  const handleFoundMatchesLost = (lostItem) => {
    const draft = pendingFoundDraft;
    const email = loggedInUser;

    const foundListRaw = localStorage.getItem(FOUND_STORAGE_KEY);
    const foundList = foundListRaw ? JSON.parse(foundListRaw) : [];

    const existingClaimsRaw = localStorage.getItem("claims");
    const existingClaims = existingClaimsRaw ? JSON.parse(existingClaimsRaw) : [];

    const duplicate = existingClaims.find(
      (c) =>
        c.userId === email &&
        c.itemId === draft.id &&
        c.lostItemId === lostItem.id &&
        c.status === "pending"
    );

    if (duplicate) {
      alert("You already submitted a claim for this lost item.");
      return;
    }

    const newFoundList = [draft, ...foundList];
    localStorage.setItem(FOUND_STORAGE_KEY, JSON.stringify(newFoundList));

    const lostRaw = localStorage.getItem(LOST_STORAGE_KEY);
    const lostList = lostRaw ? JSON.parse(lostRaw) : [];
    const timestamp = Date.now();

    const updatedLostList = lostList.map((item) =>
      item.id === lostItem.id
        ? {
            ...item,
            pendingClaim: {
              userId: email,
              claimDescription: draft.description,
              timestamp,
              foundItemId: draft.id,
            },
          }
        : item
    );

    localStorage.setItem(LOST_STORAGE_KEY, JSON.stringify(updatedLostList));

    const newClaim = {
      id: timestamp,
      type: "found-matches-lost",
      itemType: "found",
      itemId: draft.id,
      lostItemId: lostItem.id,
      userId: email,
      userDescription: draft.description,
      lostItemDescription: lostItem.description,
      timestamp,
      status: "pending",
      image: draft.photo,
      itemDescription: draft.description,
      itemFoundLocation: draft.location,
      itemDate: draft.dateFound,
    };

    localStorage.setItem("claims", JSON.stringify([...existingClaims, newClaim]));

    pushNotification(email, `You reported a found item that may match '${lostItem.itemName}'.`);
    if (lostItem.ownerEmail) {
      pushNotification(lostItem.ownerEmail, `Someone may have found your lost item: ${lostItem.itemName}.`);
    }
    pushNotification(ADMIN, `A claim for ${lostItem.itemName} has been submitted.`);

    alert("Your report and claim were submitted for review.");
    resetAllForms();
    setMatchModalOpen(false);
    setMatchCandidates([]);
  };

  return (
    <div className="report-page-container">
      <h1>Report Lost or Found Item</h1>

      <div className="role-toggle">
        <button
          className={role === "owner" ? "active" : ""}
          onClick={() => {
            resetAllForms();
            setRole("owner");
          }}
        >
          I am the Owner (I lost an item)
        </button>

        <button
          className={role === "finder" ? "active" : ""}
          onClick={() => {
            resetAllForms();
            setRole("finder");
          }}
        >
          I am the Finder (I found an item)
        </button>
      </div>

      {!role && <p>Please select an option to continue.</p>}

      {role === "owner" && (
        <div className="report-section">
          <h2>{isEditing ? "Edit Lost Item Report" : "Report a Lost Item"}</h2>
          <form onSubmit={handleLostSubmit} className="lost-form">
            <label>Item Name:</label>
            <input
              type="text"
              value={lostItemName}
              onChange={(e) => setLostItemName(e.target.value)}
              required
            />

            <label>Category:</label>
            <select
              value={lostCategory}
              onChange={(e) => setLostCategory(e.target.value)}
              required
            >
              {CATEGORIES.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat === "" ? "Select" : cat}
                </option>
              ))}
            </select>

            {lostCategory === "Other" && (
              <input
                type="text"
                value={lostCategory}
                onChange={(e) => setLostCategory(e.target.value)}
                required
              />
            )}

            <label>Where did you lose it?</label>
            <select
              value={lostLocation}
              onChange={(e) => setLostLocation(e.target.value)}
              required
            >
              <option value="">Select</option>
              {LSU_LOCATIONS.map((place, idx) => (
                <option key={idx} value={place}>
                  {place}
                </option>
              ))}
            </select>

            {lostLocation === "Other" && (
              <input
                type="text"
                value={lostLocationOther}
                onChange={(e) => setLostLocationOther(e.target.value)}
                required
              />
            )}

            <label>Date Lost:</label>
            <input
              type="date"
              value={lostDate}
              onChange={(e) => setLostDate(e.target.value)}
              max={todayStr}
              required
            />

            <label>Details:</label>
            <textarea
              value={lostDetails}
              onChange={(e) => setLostDetails(e.target.value)}
              maxLength={250}
              required
            />

            <label>Upload Photo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLostPhotoUpload}
              required={!isEditing}
            />
            {lostPhoto && <img src={lostPhoto} className="preview-img" alt="" />}

            <button type="submit" className="submit-btn">
              {isEditing ? "Update Lost Report" : "Submit Lost Item"}
            </button>
          </form>
        </div>
      )}

      {role === "finder" && (
        <div className="report-section">
          <h2>{isEditing ? "Edit Found Item Report" : "Report a Found Item"}</h2>
          <form onSubmit={handleFoundStartSubmit} className="found-form">
            <label>Item Name:</label>
            <input
              type="text"
              value={foundItemName}
              onChange={(e) => setFoundItemName(e.target.value)}
              required
            />

            <label>Category:</label>
            <select
              value={foundCategory}
              onChange={(e) => setFoundCategory(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Bag">Bag</option>
              <option value="Wallets/Purses">Wallets/Purses</option>
              <option value="IDs & Cards">IDs & Cards</option>
              <option value="Books & Notebooks">Books & Notebooks</option>
              <option value="Keys">Keys</option>
              <option value="Water Bottle">Water Bottle</option>
              <option value="Sports Gear">Sports Gear</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Scooter/Bikes">Scooter/Bikes</option>
              <option value="Other">Other</option>
            </select>

            {foundCategory === "Other" && (
              <input
                type="text"
                value={foundCategoryOther}
                onChange={(e) => setFoundCategoryOther(e.target.value)}
                required
              />
            )}

            <label>Date Found:</label>
            <input
              type="date"
              value={foundDate}
              onChange={(e) => setFoundDate(e.target.value)}
              max={todayStr}
              required
            />

            <label>Where did you find it?</label>
            <select
              value={foundLocation}
              onChange={(e) => setFoundLocation(e.target.value)}
              required
            >
              <option value="">Select</option>
              {LSU_LOCATIONS.map((place, idx) => (
                <option key={idx} value={place}>
                  {place}
                </option>
              ))}
            </select>

            {foundLocation === "Other" && (
              <input
                type="text"
                value={foundLocationOther}
                onChange={(e) => setFoundLocationOther(e.target.value)}
                required
              />
            )}

            <label>Are you in possession of the item?</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="yes"
                  checked={foundPossession === "yes"}
                  onChange={(e) => setFoundPossession(e.target.value)}
                />
                Yes
              </label>
              <label style={{ marginLeft: "12px" }}>
                <input
                  type="radio"
                  value="no"
                  checked={foundPossession === "no"}
                  onChange={(e) => setFoundPossession(e.target.value)}
                />
                No
              </label>
            </div>

            <label>Where is the item now?</label>
            <select
              value={foundCurrentLocation}
              onChange={(e) => setFoundCurrentLocation(e.target.value)}
              required
            >
              <option value="">Select</option>
              {LSU_LOCATIONS.map((place, idx) => (
                <option key={idx} value={place}>
                  {place}
                </option>
              ))}
            </select>

            {foundCurrentLocation === "Other" && (
              <input
                type="text"
                value={foundCurrentOther}
                onChange={(e) => setFoundCurrentOther(e.target.value)}
                required
              />
            )}

            <input
              type="text"
              placeholder="Room number (optional)"
              value={foundRoomNumber}
              onChange={(e) => setFoundRoomNumber(e.target.value)}
            />

            <label>Description:</label>
            <textarea
              value={foundDescription}
              onChange={(e) => setFoundDescription(e.target.value)}
              maxLength={250}
              required
            />

            <label>Upload Photo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFoundPhotoUpload}
              required={!isEditing}
            />
            {foundPhoto && <img src={foundPhoto} className="preview-img" alt="" />}

            <button type="submit" className="submit-btn">
              {isEditing ? "Check Matches & Update" : "Check Lost Reports & Submit"}
            </button>
          </form>
        </div>
      )}

      {matchModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Possible Lost Reports Matching Your Found Item</h3>

            {matchCandidates.length > 0 ? (
              matchCandidates.map((lost) => (
                <div key={lost.id} className="match-card">
                  <h4>{lost.itemName}</h4>
                  <p><strong>Category:</strong> {lost.category}</p>
                  <p><strong>Location:</strong> {lost.location}</p>
                  <p><strong>Date Lost:</strong> {lost.dateLost}</p>
                  <p><strong>Description:</strong> {lost.description}</p>

                  <button onClick={() => handleFoundMatchesLost(lost)}>
                    I found this item
                  </button>
                </div>
              ))
            ) : (
              <p>No matches found.</p>
            )}

            <div className="modal-buttons">
              <button
                onClick={() =>
                  saveFoundWithoutMatch(pendingFoundDraft, loggedInUser)
                }
              >
                None of these match – submit my report
              </button>
              <button
                onClick={() => {
                  setMatchModalOpen(false);
                  setMatchCandidates([]);
                  setPendingFoundDraft(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
