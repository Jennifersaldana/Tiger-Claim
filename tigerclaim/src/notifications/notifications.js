// Get notifications for a specific user
export function getNotifications(email) {
  const raw = localStorage.getItem("notifications-" + email);
  return raw ? JSON.parse(raw) : [];
}

// Save notifications
export function saveNotifications(email, list) {
  localStorage.setItem("notifications-" + email, JSON.stringify(list));
}

// Only saves the notification
export function addNotification(email, message) {
  const current = getNotifications(email);
  const newNotif = {
    id: Date.now(),
    message,
    seen: false,
    createdAt: new Date().toISOString(),
  };
  const updated = [newNotif, ...current];
  saveNotifications(email, updated);
}

// Adds the notification. Triggers the UI update event
export function pushNotification(email, message) {
  addNotification(email, message);
  window.dispatchEvent(new Event("notifications-updated"));
}


// Mark a single notification as read
export function markAsRead(email, id) {
  const current = getNotifications(email);
  const updated = current.map(n =>
    n.id === id ? { ...n, seen: true } : n
  );
  saveNotifications(email, updated);
}

// Count unread notifications
export function unreadCount(email) {
  return getNotifications(email).filter(n => !n.seen).length;
}
