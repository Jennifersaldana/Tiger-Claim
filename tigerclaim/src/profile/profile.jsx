import React, { useState, useEffect, useRef } from "react";
import './profile.css';
import defaultProfile from '../assets/profile.png';
import eyeOpen from '../assets/eyeopen.png';
import eyeClosed from '../assets/eyeclosed.png';
import { pushNotification } from "../notifications/notifications"; 

function Profile({ onClose, onProfileUpdate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoPreview, setPhotoPreview] = useState(defaultProfile);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("lostAndFoundUser") || "";
    setEmail(currentUser);

    const savedPassword = localStorage.getItem("lostAndFoundPassword") || "";
    setPassword(savedPassword);

    const allProfiles = JSON.parse(localStorage.getItem("allProfiles") || "{}");
    const savedProfile = allProfiles[currentUser];

    if (savedProfile) {
      setName(savedProfile.name || "");
      setPhone(savedProfile.phone || "");
      setPhotoPreview(savedProfile.photoPreview || defaultProfile);
    } else {
      setName("");
      setPhone("");
      setPhotoPreview(defaultProfile);
    }
  }, []);

  const validateEmail = (value) => {
    const lsuEmailPattern = /^[a-zA-Z0-9._%+-]+@lsu\.edu$/;
    setEmailError(value && !lsuEmailPattern.test(value) ? "Email must end with @lsu.edu" : "");
  };

  const validatePhone = (value) => {
    const digits = value.replace(/\D/g, "");
    setPhoneError(value && digits.length !== 10 ? "Phone number must be 10 digits" : "");
  };

  const isFormValid = () => !emailError && !phoneError && email;

  const handleSave = () => {
    if (!isFormValid()) return;

    const currentUser = email;
    const allProfiles = JSON.parse(localStorage.getItem("allProfiles") || "{}");

    allProfiles[currentUser] = { name, email, phone, photoPreview };
    localStorage.setItem("allProfiles", JSON.stringify(allProfiles));

    if (onProfileUpdate) onProfileUpdate(allProfiles[currentUser]);
    pushNotification(currentUser, "Your profile has been updated.");
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

  // --- NEW FUNCTION: SAVE PASSWORD ---
  const handleSavePassword = () => {
    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      setPasswordSuccess("");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setPasswordSuccess("");
      return;
    }

    localStorage.setItem("lostAndFoundPassword", password);
    setPasswordError("");
    setPasswordSuccess("Password saved successfully!");
    setConfirmPassword("");
  };

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
            <button className="change-photo-btn" onClick={triggerFileSelect}>Change Photo</button>
            <button className="remove-photo-btn" onClick={handleRemovePhoto}>Remove Photo</button>
          </div>
        </div>
        <div className="profile-body">
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input
            type="email"
            placeholder="LSU Email"
            value={email}
            onChange={e => { setEmail(e.target.value); validateEmail(e.target.value); }}
          />
          {emailError && <div className="error-message">{emailError}</div>}

          <input
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={e => { setPhone(e.target.value); validatePhone(e.target.value); }}
          />
          {phoneError && <div className="error-message">{phoneError}</div>}

          <label>Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <img
              src={showPassword ? eyeOpen : eyeClosed}
              alt="Toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer", width: "20px", height: "20px" }}
            />
          </div>

          <label>Confirm Password</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            <img
              src={showConfirmPassword ? eyeOpen : eyeClosed}
              alt="Toggle confirm password visibility"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ cursor: "pointer", width: "20px", height: "20px" }}
            />
          </div>

          {passwordError && <div className="error-message">{passwordError}</div>}
          {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}

          <div className="profile-buttons">
          <button onClick={handleSavePassword}>Save Password</button>
          <button onClick={handleSave} disabled={!isFormValid()}>Save Profile</button>
          <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
