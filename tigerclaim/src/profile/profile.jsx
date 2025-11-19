import React, { useState, useEffect, useRef } from "react";
import './profile.css';
import defaultProfile from '../assets/profile.png';

function Profile({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoPreview, setPhotoPreview] = useState(defaultProfile);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const fileInputRef = useRef(null);

  // Load profile from localStorage and default to current logged-in user
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profileData") || "{}");
    const currentUser = localStorage.getItem("lostAndFoundUser") || "";

    if (savedProfile && savedProfile.email === currentUser) {
      setName(savedProfile.name || "");
      setPhone(savedProfile.phone || "");
      setPhotoPreview(savedProfile.photoPreview || defaultProfile);
    } else {
      // If no profile saved for this user, clear name/phone and set email
      setName("");
      setPhone("");
      setPhotoPreview(defaultProfile);
    }

    setEmail(currentUser); // Always show logged-in email
  }, []);

  const validateEmail = (value) => {
    const lsuEmailPattern = /^[a-zA-Z0-9._%+-]+@lsu\.edu$/;
    setEmailError(value && !lsuEmailPattern.test(value) ? "Email must end with @lsu.edu" : "");
  };

  const validatePhone = (value) => {
    const digits = value.replace(/\D/g, "");
    setPhoneError(value && digits.length !== 10 ? "Phone number must be 10 digits" : "");
  };

  const isFormValid = () => {
    if (!email || emailError || phoneError) return false;
    return true;
  };

  const handleSave = () => {
    if (!isFormValid()) return;

    const profileData = { name, email, phone, photoPreview };
    localStorage.setItem("profileData", JSON.stringify(profileData));
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => setPhotoPreview(defaultProfile);

  const triggerFileSelect = () => fileInputRef.current.click();

  return (
    <div className="full-page-modal">
      <div className="profile-card-full">
        <h2>Edit Profile</h2>
        <div className="profile-header">
          <img src={photoPreview} alt="Profile" className="profile-image" />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div className="photo-buttons">
            <button className="change-photo-btn" onClick={triggerFileSelect}>
              Change Photo
            </button>
            <button className="remove-photo-btn" onClick={handleRemovePhoto}>
              Remove Photo
            </button>
          </div>
        </div>

        <div className="profile-body">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="LSU Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            className={emailError ? "invalid-input" : ""}
          />
          {emailError && <div className="error-message">{emailError}</div>}

          <input
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              validatePhone(e.target.value);
            }}
            className={phoneError ? "invalid-input" : ""}
          />
          {phoneError && <div className="error-message">{phoneError}</div>}

          <div className="profile-buttons">
            <button
              onClick={handleSave}
              disabled={!isFormValid()}
              className={!isFormValid() ? "disabled-button" : ""}
            >
              Save Profile
            </button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
