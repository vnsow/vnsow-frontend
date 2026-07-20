import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import NotificationPopover from './NotificationPopover';
import NotificationModal from './NotificationModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar notificaciones al montar
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Polling cada 30 segundos para actualizar
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API}/user/notifications`, {
        withCredentials: true
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API}/user/notifications/unread-count`, {
        withCredentials: true
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `${API}/user/notifications/${notificationId}/mark-read`,
        {},
        { withCredentials: true }
      );

      // Actualizar estado local
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, read: true, read_at: new Date() } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${API}/user/notifications/mark-all-read`,
        {},
        { withCredentials: true }
      );

      // Actualizar estado local
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, read_at: new Date() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Refrescar la lista después de cerrar
    setTimeout(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 300);
  };

  return (
    <>
      <NotificationPopover
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
        onMarkAllRead={markAllAsRead}
      >
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </NotificationPopover>

      <NotificationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        notification={selectedNotification}
        onMarkAsRead={markAsRead}
      />
    </>
  );
};

export default NotificationBell;
