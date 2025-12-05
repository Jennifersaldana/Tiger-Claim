import React, { useState, useEffect } from "react";
import { pushNotification } from "../notifications/notifications";
import "./report.css"; // you can style this similar to lost.css/found.css

const FOUND_STORAGE_KEY = "foundItems.v1";
const LOST_STORAGE_KEY = "lostItems.v1";

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
  "IDs & Cards",
  "Books & Notebooks",
  "Keys",
  "Water Bottle",
  "Sports Gear",
  "Jewelry",
  "Other",
];

// Simple UUID fallback
function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper for today (for max on date fields)
const todayStr = new Date().toISOString().split("T")[0];

const ReportPage = () => {
  const loggedInUser = localStorage.getItem("lostAndFoundUser") || "";

  // Owner vs Finder
  const [role, setRole] = useState(null); // "owner" | "finder"

  // ===== LOST (OWNER) FORM STATE =====
  const [lostId, setLostId] = useState(null);
  const [lostItemName, setLostItemName] = useState("");
  const [lostCategory, setLostCategory] = useState("");
  const [lostLocation, setLostLocation] = useState("");
  const [lostLocationOther, setLostLocationOther] = useState("");
  const [lostDate, setLostDate] = useState("");
  const [lostDetails, setLostDetails] = useState("");
  const [lostPhoto, setLostPhoto] = useState("");

  // ===== FOUND (FINDER) FORM STATE =====
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

  // ===== EDIT MODE =====
  const [isEditing, setIsEditing] = useState(false);
  const [editingType, setEditingType] = useState(null); // "lost" | "found"

  // ===== MATCH POPUP STATE (Finder flow) =====
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchCandidates, setMatchCandidates] = useState([]);
  const [pendingFoundDraft, setPendingFoundDraft] = useState(null);

  // ------------------------------------------
  // LOAD EDIT METADATA FROM NOTIFICATION
  // ------------------------------------------
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
    } catch (e) {
      console.error("Failed to parse editReportMeta", e);
    } finally {
      // Clear so it doesn't keep reapplying
      localStorage.removeItem("editReportMeta");
    }
  }, []);

  // ------------------------------------------
  // IMAGE UPLOAD HANDLERS
  // ------------------------------------------
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

  // ------------------------------------------
  // SUBMIT: LOST (OWNER)
  // ------------------------------------------
  const handleLostSubmit = (e) => {
    e.preventDefault();
    const email = loggedInUser;
    if (!email) {
      alert("Please log in with your LSU email first.");
      return;
    }

    const listRaw = localStorage.getItem(LOST_STORAGE_KEY);
    const list = listRaw ? JSON.parse(listRaw) : [];

    const locationFinal =
      lostLocation === "Other" ? lostLocationOther : lostLocation;

    if (isEditing && editingType === "lost" && lostId) {
      const updatedList = list.map((item) =>
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
      localStorage.setItem(LOST_STORAGE_KEY, JSON.stringify(updatedList));
      pushNotification(
        email,
        `Your lost item report was updated: ${lostItemName}`
      );
      alert("Lost report updated.");
    } else {
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

      const updatedList = [newItem, ...list];
      localStorage.setItem(LOST_STORAGE_KEY, JSON.stringify(updatedList));

      // notification with metadata for editing later
      pushNotification(email, `You reported a lost item: ${lostItemName}`, {
        type: "edit-report",
        reportType: "lost",
        reportId: newId,
      });

      alert("Lost item submitted!");
      setLostId(null);
      setLostItemName("");
      setLostCategory("");
      setLostLocation("");
      setLostLocationOther("");
      setLostDate("");
      setLostDetails("");
      setLostPhoto("");
      setIsEditing(false);
      setEditingType(null);
    }
  };

  // ------------------------------------------
  // FIND MATCHING LOST ITEMS FOR A FOUND REPORT
  // ------------------------------------------
  const findLostMatches = (draft) => {
    const listRaw = localStorage.getItem(LOST_STORAGE_KEY);
    const lostList = listRaw ? JSON.parse(listRaw) : [];
    const descWords =
      draft.description
        ?.toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length >= 4) || [];

    return lostList.filter((lost) => {
      const matchCategory =
        !draft.category || lost.category === draft.category;
      const matchLocation =
        !draft.location || lost.location === draft.location;

      const lostDesc = (lost.description || "").toLowerCase();
      const hasOverlap = descWords.some((w) => lostDesc.includes(w));

      return matchCategory && matchLocation && hasOverlap;
    });
  };

  // ------------------------------------------
  // SUBMIT: FOUND (FINDER) – STEP 1: SHOW MATCHES
  // ------------------------------------------
  const handleFoundStartSubmit = (e) => {
    e.preventDefault();
    const email = loggedInUser;
    if (!email) {
      alert("Please log in with your LSU email first.");
      return;
    }

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

    // find lost matches
    const matches = findLostMatches(draft);

    setPendingFoundDraft(draft);

    if (matches.length > 0) {
      setMatchCandidates(matches);
      setMatchModalOpen(true);
    } else {
      // no matches → just save found report normally
      saveFoundWithoutMatch(draft, email);
    }
  };

  // ------------------------------------------
  // Save found item when NO lost match
  // ------------------------------------------
  const saveFoundWithoutMatch = (draft, email) => {
    const listRaw = localStorage.getItem(FOUND_STORAGE_KEY);
    const list = listRaw ? JSON.parse(listRaw) : [];

    let finalList;
    if (isEditing && editingType === "found" && foundId) {
      finalList = list.map((item) =>
        item.id === foundId ? { ...item, ...draft, id: foundId } : item
      );
      pushNotification(
        email,
        `Your found item report was updated: ${draft.itemName}`
      );
      alert("Found report updated.");
    } else {
      finalList = [draft, ...list];
      // new report → include metadata for editing
      pushNotification(email, `You reported a found item: ${draft.itemName}`, {
        type: "edit-report",
        reportType: "found",
        reportId: draft.id,
      });
      alert("Found item submitted!");
    }

    localStorage.setItem(FOUND_STORAGE_KEY, JSON.stringify(finalList));

    // reset finder form
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
    setPendingFoundDraft(null);
    setMatchModalOpen(false);
    setMatchCandidates([]);
  };

  // ------------------------------------------
  // When finder clicks "I found this item" on a lost match
  // → create found item + claim linking both
  // ------------------------------------------
  const handleFoundMatchesLost = (lostItem) => {
    if (!pendingFoundDraft || !loggedInUser) return;
    const email = loggedInUser;

    // 1) Save found item
    const foundListRaw = localStorage.getItem(FOUND_STORAGE_KEY);
    const foundList = foundListRaw ? JSON.parse(foundListRaw) : [];

    const newFoundItem = { ...pendingFoundDraft };
    const updatedFoundList = [newFoundItem, ...foundList];
    localStorage.setItem(FOUND_STORAGE_KEY, JSON.stringify(updatedFoundList));

    // 2) Update lost item with pending claim
    const lostListRaw = localStorage.getItem(LOST_STORAGE_KEY);
    const lostList = lostListRaw ? JSON.parse(lostListRaw) : [];
    const timestamp = Date.now();

    const updatedLostList = lostList.map((item) =>
      item.id === lostItem.id
        ? {
            ...item,
            pendingClaim: {
              userId: email,
              claimDescription: pendingFoundDraft.description,
              timestamp,
              foundItemId: newFoundItem.id,
            },
          }
        : item
    );
    localStorage.setItem(LOST_STORAGE_KEY, JSON.stringify(updatedLostList));

    // 3) Create claim object
    const existingClaimsRaw = localStorage.getItem("claims");
    const existingClaims = existingClaimsRaw
      ? JSON.parse(existingClaimsRaw)
      : [];

    const newClaim = {
      id: Date.now(),
      type: "found-matches-lost",
      itemId: newFoundItem.id,
      itemType: "found",
      lostItemId: lostItem.id,
      userId: email,
      userDescription: pendingFoundDraft.description,
      lostItemDescription: lostItem.description,
      timestamp,
      status: "pending",
      image: newFoundItem.photo || null,
      itemDescription: newFoundItem.description,
      itemFoundLocation: newFoundItem.location,
      itemDate: newFoundItem.dateFound,
    };

    localStorage.setItem(
      "claims",
      JSON.stringify([...existingClaims, newClaim])
    );

    // 4) Notifications
    pushNotification(
      email,
      `You reported a found item that may match a lost report: ${lostItem.itemName}. Your claim is pending review.`
    );

    if (lostItem.ownerEmail) {
      pushNotification(
        lostItem.ownerEmail,
        `Someone reported they may have found your lost item: ${lostItem.itemName}.`
      );
    }

    // cleanup + reset form
    alert("Your report and claim were submitted for review.");
    setPendingFoundDraft(null);
    setMatchModalOpen(false);
    setMatchCandidates([]);

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
  };

  // ------------------------------------------
  // RENDER
  // ------------------------------------------
  return (
    <div className="report-page-container">
      <h1>Report Lost or Found Item</h1>

      {/* Step 1: Owner vs Finder */}
      <div className="role-toggle">
        <button
          className={role === "owner" ? "active" : ""}
          onClick={() => {
            setRole("owner");
            setIsEditing(false);
            setEditingType(null);
          }}
        >
          I am the Owner (I lost an item)
        </button>
        <button
          className={role === "finder" ? "active" : ""}
          onClick={() => {
            setRole("finder");
            setIsEditing(false);
            setEditingType(null);
          }}
        >
          I am the Finder (I found an item)
        </button>
      </div>

      {!role && (
        <p style={{ marginTop: "20px" }}>
          Please select whether you are the owner or the finder to continue.
        </p>
      )}

      {/* OWNER FORM */}
      {role === "owner" && (
        <div className="report-section">
          <h2>{isEditing ? "Edit Lost Item Report" : "Report a Lost Item"}</h2>
          <form onSubmit={handleLostSubmit} className="lost-form">
            <label>Item Name:</label>
            <input
              type="text"
              value={lostItemName}
              onChange={(e) => setLostItemName(e.target.value)}
              placeholder="AirPods, laptop, wallet…"
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
                placeholder="Enter custom category"
                onChange={(e) => setLostCategory(e.target.value)}
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
                placeholder="Enter custom location"
                value={lostLocationOther}
                onChange={(e) => setLostLocationOther(e.target.value)}
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
              placeholder="Describe identifying marks, color, stickers, etc."
              required
            />

            <label>Upload Photo (optional):</label>
            <input type="file" accept="image/*" onChange={handleLostPhotoUpload} />
            {lostPhoto && (
              <img
                src={lostPhoto}
                alt="Lost item preview"
                style={{
                  marginTop: "10px",
                  width: "120px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            )}

            <button type="submit" className="submit-btn">
              {isEditing && editingType === "lost"
                ? "Update Lost Report"
                : "Submit Lost Item"}
            </button>
          </form>
        </div>
      )}

      {/* FINDER FORM */}
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
              <option value="IDs & Cards">IDs & Cards</option>
              <option value="Books & Notebooks">Books & Notebooks</option>
              <option value="Keys">Keys</option>
              <option value="Water Bottle">Water Bottle</option>
              <option value="Sports Gear">Sports Gear</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Other">Other</option>
            </select>

            {foundCategory === "Other" && (
              <input
                type="text"
                placeholder="Enter custom category"
                value={foundCategoryOther}
                onChange={(e) => setFoundCategoryOther(e.target.value)}
                style={{ marginTop: "8px" }}
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
              {LSU_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {foundLocation === "Other" && (
              <input
                type="text"
                placeholder="Enter location"
                value={foundLocationOther}
                onChange={(e) => setFoundLocationOther(e.target.value)}
                style={{ marginTop: "8px" }}
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

            <label>Where is the item currently?</label>
            <select
              value={foundCurrentLocation}
              onChange={(e) => setFoundCurrentLocation(e.target.value)}
            >
              <option value="">Select</option>
              {LSU_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {foundCurrentLocation === "Other" && (
              <input
                type="text"
                placeholder="Enter location"
                value={foundCurrentOther}
                onChange={(e) => setFoundCurrentOther(e.target.value)}
                style={{ marginTop: "8px" }}
                required
              />
            )}

            {(foundCurrentLocation !== "" || foundCurrentOther !== "") && (
              <input
                type="text"
                placeholder="Enter room number (e.g., Room 132)"
                value={foundRoomNumber}
                onChange={(e) => setFoundRoomNumber(e.target.value)}
                style={{ marginTop: "8px" }}
              />
            )}

            <label>Item Description:</label>
            <textarea
              value={foundDescription}
              onChange={(e) => setFoundDescription(e.target.value)}
              required
              placeholder="Describe identifying marks, color, stickers, etc."
            />

            <label>Upload Photo:</label>
            <input type="file" accept="image/*" onChange={handleFoundPhotoUpload} />
            {foundPhoto && (
              <img
                src={foundPhoto}
                alt="Found item preview"
                style={{
                  marginTop: "10px",
                  width: "120px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            )}

            <button type="submit" className="submit-btn">
              {isEditing && editingType === "found"
                ? "Check Matches & Update"
                : "Check Lost Reports & Submit"}
            </button>
          </form>
        </div>
      )}

      {/* MATCH POPUP FOR FINDER */}
      {matchModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Possible Lost Reports That Match Your Item</h3>
            {matchCandidates.length === 0 && (
              <p>No matching lost reports found.</p>
            )}

            {matchCandidates.length > 0 && (
              <div className="match-list">
                {matchCandidates.map((lost) => (
                  <div key={lost.id} className="match-card">
                    <h4>{lost.itemName}</h4>
                    <p>
                      <strong>Category:</strong> {lost.category}
                    </p>
                    <p>
                      <strong>Location:</strong> {lost.location}
                    </p>
                    <p>
                      <strong>Date Lost:</strong>{" "}
                      {lost.dateLost || lost.date || "Unknown"}
                    </p>
                    <p>
                      <strong>Description:</strong> {lost.description}
                    </p>
                    <button onClick={() => handleFoundMatchesLost(lost)}>
                      I found this item
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-buttons">
              <button
                onClick={() =>
                  saveFoundWithoutMatch(
                    pendingFoundDraft,
                    loggedInUser || ""
                  )
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
