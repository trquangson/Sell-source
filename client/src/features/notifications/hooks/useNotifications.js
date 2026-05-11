import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationApi } from '../api/notificationApi';

const POLL_INTERVAL_MS = 10_000;

export const useNotifications = (isLoggedIn) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const intervalRef = useRef(null);

    const fetchAll = useCallback(async () => {
        if (!isLoggedIn) return;
        setLoading(true);
        try {
            const res = await notificationApi.getAll();
            if (res?.success) setNotifications(res.notifications || []);
        } catch {
            // Không throw - tránh crash UI khi offline
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    const fetchUnreadCount = useCallback(async () => {
        if (!isLoggedIn) return;
        try {
            const res = await notificationApi.getUnreadCount();
            if (res?.success) setUnreadCount(res.count ?? 0);
        } catch {
            // silent fail
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (!isLoggedIn) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        fetchAll();
        fetchUnreadCount();

        intervalRef.current = setInterval(() => {
            refresh();
        }, POLL_INTERVAL_MS);

        return () => clearInterval(intervalRef.current);
    }, [isLoggedIn, fetchAll, fetchUnreadCount]);

    const markRead = useCallback(async (id) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => {
                    if (n._id === id) return { ...n, isRead: true };
                    return n;
                })
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {
            // silent fail
        }
    }, []);

    const markAllRead = useCallback(async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch {
            // silent fail
        }
    }, []);

    const refresh = useCallback(() => {
        fetchAll();
        fetchUnreadCount();
    }, [fetchAll, fetchUnreadCount]);

    return { notifications, unreadCount, loading, markRead, markAllRead, refresh };
};
