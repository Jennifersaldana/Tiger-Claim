export function getNotifications(email) {
  const raw = localStorage.getItem("notifications-" + email);
  return raw ? JSON.parse(raw) : [];
}

export function saveNotifications(email, list) {
  localStorage.setItem("notifications-" + email, JSON.stringify(list));
}

export function addNotification(email, message, data = null) {
  const current = getNotifications(email);
  const newNotif = {
    id: Date.now(),
    message,
    seen: false,
    createdAt: new Date().toISOString(),
    data, 
  };
  const updated = [newNotif, ...current];
  saveNotifications(email, updated);
}

export function pushNotification(email, message, data = null) {
  addNotification(email, message, data);
  window.dispatchEvent(new Event("notifications-updated"));
}


export function markAsRead(email, id) {
  const current = getNotifications(email);
  const updated = current.map((n) =>
    n.id === id ? { ...n, seen: true } : n
  );
  saveNotifications(email, updated);
}

export function unreadCount(email) {
  return getNotifications(email).filter((n) => !n.seen).length;
}
