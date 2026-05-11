import React, { useState, useEffect, useCallback } from 'react';
import { Bell, ArrowDownCircle, ShoppingBag, Megaphone, CheckCheck, ArrowLeft, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { notificationApi } from '@/features/notifications/api/notificationApi';
import Pagination from '@/shared/components/Pagination';
import ConfirmModal from '@/shared/components/ConfirmModal';

const getTypeMeta = (t) => ({
    DEPOSIT: {
        icon: <ArrowDownCircle size={18} className="text-emerald-500" />,
        label: t('notifications.types.DEPOSIT'),
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    PURCHASE: {
        icon: <ShoppingBag size={18} className="text-primary-500" />,
        label: t('notifications.types.PURCHASE'),
        badge: 'bg-primary-50 text-primary-700 border-primary-100'
    },
    ADMIN: {
        icon: <Megaphone size={18} className="text-amber-500" />,
        label: t('notifications.types.ADMIN_BADGE'),
        badge: 'bg-amber-50 text-amber-700 border-amber-100'
    }
});

const LIMIT = 8;

const NotificationsPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'DEPOSIT' | 'PURCHASE' | 'ADMIN'

    // For delete confirmation
    const [deleteId, setDeleteId] = useState(null);

    const TYPE_META = getTypeMeta(t);
    const currentLocale = i18n.language === 'vi' ? vi : enUS;

    const fetchNotifications = useCallback(async (p = 1, silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await notificationApi.getAll(p, LIMIT);
            if (res?.success) {
                setNotifications(res.notifications || []);
                setTotal(res.total || 0);
                setTotalPages(res.totalPages || 1);
                setPage(res.page || 1);
            }
        } catch {
            // silent
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications(page);

        const intervalId = setInterval(() => {
            fetchNotifications(page, true);
        }, 10000);

        return () => clearInterval(intervalId);
    }, [fetchNotifications, page]);

    const handlePageChange = (p) => {
        fetchNotifications(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleMarkRead = async (noti) => {
        if (noti.isRead) return;
        try {
            await notificationApi.markAsRead(noti._id);
            setNotifications(prev =>
                prev.map(n => n._id === noti._id ? { ...n, isRead: true } : n)
            );
        } catch {
            // silent
        }
    };

    const handleDeleteClick = (noti, e) => {
        e.stopPropagation();
        setDeleteId(noti._id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await notificationApi.deleteNotification(deleteId);
            setNotifications(prev => prev.filter(n => n._id !== deleteId));
            setTotal(prev => prev - 1);
        } catch {
            // silent
        } finally {
            setDeleteId(null);
        }
    };

    const handleMarkAll = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch {
            // silent
        }
    };

    // Client-side filter trên trang hiện tại
    const displayed = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'all') return true;
        return n.type === filter;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filterTabs = [
        { key: 'all', label: t('notifications.tabs.all') },
        { key: 'unread', label: t('notifications.tabs.unread') },
        { key: 'DEPOSIT', label: t('notifications.tabs.DEPOSIT') },
        { key: 'PURCHASE', label: t('notifications.tabs.PURCHASE') },
        { key: 'ADMIN', label: t('notifications.tabs.ADMIN') },
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-text-muted hover:text-primary-600 transition-colors mb-4"
                >
                    <ArrowLeft size={16} /> {t('notifications.go_back')}
                </button>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell size={22} className="text-primary-600" />
                        <div>
                            <h1 className="text-xl font-bold text-text-main">{t('notifications.title')}</h1>
                            <p className="text-sm text-text-muted">{t('notifications.subtitle', { count: total })}</p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAll}
                            className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors border border-primary-200"
                        >
                            <CheckCheck size={15} /> {t('notifications.mark_all_read', { count: unreadCount })}
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
                {filterTabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all ${filter === tab.key
                            ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                            : 'bg-white text-text-muted border-border hover:border-primary-300 hover:text-primary-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Notification List */}
            <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col gap-3 p-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-start gap-3 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-surface-hover flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 bg-surface-hover rounded w-2/3" />
                                    <div className="h-3 bg-surface-hover rounded w-full" />
                                    <div className="h-2.5 bg-surface-hover rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : displayed.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-muted">
                        <Bell size={40} className="text-border" />
                        <p className="font-medium">{t('notifications.empty')}</p>
                    </div>
                ) : (
                    <ul>
                        {displayed.map((noti, idx) => {
                            const meta = TYPE_META[noti.type] ?? TYPE_META.ADMIN;
                            return (
                                <li
                                    key={noti._id}
                                    className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors border-b border-border last:border-b-0 ${!noti.isRead
                                        ? 'bg-blue-50 hover:bg-blue-100/70'
                                        : 'hover:bg-surface-hover'
                                        }`}
                                    onClick={() => handleMarkRead(noti)}
                                >
                                    {/* Icon vòng tròn */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${meta.badge}`}>
                                        {meta.icon}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm leading-snug ${!noti.isRead ? 'font-bold text-text-main' : 'font-semibold text-text-main'}`}>
                                                {noti.title}
                                            </p>
                                            {/* Unread dot */}
                                            {!noti.isRead && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-primary-500 flex-shrink-0 mt-1" />
                                            )}
                                        </div>
                                        <p className="text-sm text-text-muted mt-0.5 leading-relaxed">{noti.message}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${meta.badge}`}>
                                                {meta.label}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {formatDistanceToNow(new Date(noti.createdAt), { addSuffix: true, locale: currentLocale })}
                                            </span>
                                            {noti.isGlobal && (
                                                <span className="text-xs text-purple-500 font-medium">• {t('notifications.broadcast')}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteClick(noti, e)}
                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                        title={t('notifications.delete', 'Xóa thông báo')}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* Pagination — chỉ hiện khi filter = 'all' (server-side) */}
            {filter === 'all' && !loading && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Hint khi filter client-side */}
            {filter !== 'all' && displayed.length > 0 && (
                <p className="text-center text-xs text-text-muted mt-4">
                    {t('notifications.filter_result', { count: displayed.length, page: page })}{' '}
                    <button onClick={() => setFilter('all')} className="text-primary-600 font-semibold hover:underline">
                        {t('notifications.view_all_btn')}
                    </button>
                </p>
            )}

            <ConfirmModal
                isOpen={!!deleteId}
                title={t('notifications.delete_confirm_title', 'Xác nhận xóa')}
                message={t('notifications.delete_confirm_message', 'Bạn có chắc chắn muốn xóa thông báo này? Hành động này không thể hoàn tác.')}
                confirmText={t('notifications.delete_confirm_btn', 'Xóa')}
                cancelText={t('notifications.delete_cancel_btn', 'Hủy')}
                type="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default NotificationsPage;
