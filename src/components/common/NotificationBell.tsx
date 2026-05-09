import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import api from '../../services/api';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const [countRes, listRes] = await Promise.all([
      api.notifications.getUnreadCount(),
      api.notifications.getNotifications({ limit: 10 })
    ]);
    setUnread(countRes?.data?.unreadCount || 0);
    setItems(listRes?.data?.notifications || []);
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 60000);
    return () => clearInterval(timer);
  }, []);

  const onToggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      await api.notifications.markAllRead();
      load();
    }
  };

  return (
    <div className="relative">
      <button onClick={onToggle} className="relative p-2 rounded-full bg-white/20">
        <Bell className="w-5 h-5 text-white" />
        {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1.5">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg p-3 z-30">
          <p className="text-sm text-[#102542] mb-2">Notifications</p>
          <div className="space-y-2 max-h-64 overflow-auto">
            {items.map((n) => (
              <div key={n._id} className="border rounded-lg p-2">
                <p className="text-xs font-medium">{n.title}</p>
                <p className="text-xs text-gray-500">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
