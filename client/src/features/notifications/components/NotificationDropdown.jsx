import React from 'react';
import { Bell, ArrowDownCircle, ShoppingBag, Megaphone, CheckCheck, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const TYPE_ICON = {
    DEPOSIT: <ArrowDownCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />,
    PURCHASE: <ShoppingBag size={16} className="text-primary-500 flex-shrink-0 mt-0.5" />,
    ADMIN: <Megaphone size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
};

const PREVIEW_LIMIT = 5;

const NotificationDropdown = ({ notifications, loading, unreadCount, onMarkRead, onMarkAllRead, onClose }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const currentLocale = i18n.language === 'vi' ? vi : enUS;

    const handleItemClick = (noti) => {
        if (!noti.isRead) onMarkRead(noti._id);
        onClose();
        navigate('/notifications');
    };

    const preview = notifications.slice(0, PREVIEW_LIMIT);
    const hasMore = notifications.length > PREVIEW_LIMIT;

    return (
        <div className="notification-dropdown">
            <div className="notification-header">
                <span className="notification-title">
                    {t('notifications.title')} {unreadCount > 0 && <span className="notification-badge-inline">{unreadCount}</span>}
                </span>
                {unreadCount > 0 && (
                    <button
                        className="notification-mark-all"
                        onClick={onMarkAllRead}
                        title={t('notifications.mark_all_read_short')}
                    >
                        <CheckCheck size={15} />
                        <span>{t('notifications.mark_all_read_short')}</span>
                    </button>
                )}
            </div>

            <div className="notification-list">
                {loading && notifications.length === 0 ? (
                    <div className="notification-empty">{t('notifications.loading')}</div>
                ) : notifications.length === 0 ? (
                    <div className="notification-empty">
                        <Bell size={32} className="notification-empty-icon" />
                        <p>{t('notifications.empty_short')}</p>
                    </div>
                ) : (
                    preview.map(noti => (
                        <button
                            key={noti._id}
                            className={`notification-item ${!noti.isRead ? 'notification-item--unread' : ''}`}
                            onClick={() => handleItemClick(noti)}
                        >
                            <div className="notification-item-icon">
                                {TYPE_ICON[noti.type] ?? <Bell size={16} className="flex-shrink-0 mt-0.5" />}
                            </div>
                            <div className="notification-item-body">
                                <p className="notification-item-title">{noti.title}</p>
                                <p className="notification-item-msg">{noti.message}</p>
                                <p className="notification-item-time">
                                    {formatDistanceToNow(new Date(noti.createdAt), { addSuffix: true, locale: currentLocale })}
                                </p>
                            </div>
                            {!noti.isRead && <span className="notification-dot" />}
                        </button>
                    ))
                )}
            </div>

            {/* Footer "Xem tất cả" */}
            {notifications.length > 0 && (
                <Link
                    to="/notifications"
                    onClick={onClose}
                    className="notification-view-all"
                >
                    {hasMore
                        ? t('notifications.view_all', { count: notifications.length - PREVIEW_LIMIT })
                        : t('notifications.view_all_short')
                    }
                    <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );
};

export default NotificationDropdown;
