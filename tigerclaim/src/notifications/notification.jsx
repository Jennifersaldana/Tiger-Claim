import React from "react";
import {
  getNotifications,
  markAsRead,
} from "./notifications.js";
import "./notification.css";

const NotificationsDropdown = ({ user, onClose }) => {
  const list = getNotifications(user);

  const handleRead = (notif) => {
    if (notif.data && notif.data.type === "edit-report") {
      const meta = {
        reportType: notif.data.reportType, // "lost" | "found"
        reportId: notif.data.reportId,
      };
      localStorage.setItem("editReportMeta", JSON.stringify(meta));

      window.dispatchEvent(new CustomEvent("nav", { detail: "report" }));
    }

    markAsRead(user, notif.id);
    onClose(); 
  };

  return (
    <div className="notif-dropdown">
      <h3>Notifications</h3>
      <div className="notif-divider"></div>

      {list.length === 0 && (
        <p className="notif-empty">No notifications</p>
      )}

      {list.map((n) => (
        <div
          key={n.id}
          className={`notif-item ${n.seen ? "seen" : ""}`}
          onClick={() => handleRead(n)}
        >
          <span>{n.message}</span>
        </div>
      ))}
    </div>
  );
};

export default NotificationsDropdown;
