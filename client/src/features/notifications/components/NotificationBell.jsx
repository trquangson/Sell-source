import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const { notifications, unreadCount, loading, markRead, markAllRead, refresh } = useNotifications(!!user);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!isOpen) refresh();
        setIsOpen(prev => !prev);
    };

    if (!user) return null;

    return (
        <div className="notification-bell-wrapper" ref={containerRef}>
            <button
                id="notification-bell-btn"
                className="notification-bell-btn"
                onClick={handleToggle}
                aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} chưa đọc)` : ''}`}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="notification-badge" aria-hidden="true">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown-container">
                    <NotificationDropdown
                        notifications={notifications}
                        loading={loading}
                        unreadCount={unreadCount}
                        onMarkRead={markRead}
                        onMarkAllRead={markAllRead}
                        onClose={() => setIsOpen(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
