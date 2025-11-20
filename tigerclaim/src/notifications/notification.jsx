import React from "react";
import {
  getNotifications,
  markAsRead
} from "./notifications.js";

const NotificationsDropdown = ({ user, onClose }) => {
  const list = getNotifications(user);

  const handleRead = (id) => {
    markAsRead(user, id);
    onClose(); // close dropdown after clicking
  };

  return (
    <div className="notif-dropdown">
      <h3>Notifications</h3>

      {list.length === 0 && (
        <p className="notif-empty">No notifications</p>
      )}

      {list.map(n => (
        <div
          key={n.id}
          className={`notif-item ${n.seen ? "seen" : ""}`}
          onClick={() => handleRead(n.id)}
        >
          <span>{n.message}</span>
        </div>
      ))}
    </div>
  );
};

export default NotificationsDropdown;
