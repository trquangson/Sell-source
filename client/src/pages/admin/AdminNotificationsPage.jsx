import React, { useState, useEffect, useCallback } from 'react';
import { Megaphone, Send, Trash2, Users, User, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { notificationApi } from '@/features/notifications/api/notificationApi';
import { adminApi } from '@/features/admin/api/adminApi';
import ConfirmModal from '@/shared/components/ConfirmModal';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const TARGET_ALL = 'all';
const TARGET_ONE = 'one';

const AdminNotificationsPage = () => {
    const [target, setTarget] = useState(TARGET_ALL);
    const [userQuery, setUserQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', text }

    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteId, setDeleteId] = useState(null);

    const fetchHistory = useCallback(async (p = 1) => {
        setHistoryLoading(true);
        try {
            const res = await notificationApi.adminList(p, 10);
            if (res?.success) {
                setHistory(res.notifications || []);
                setTotalPages(res.totalPages || 1);
                setPage(res.page || 1);
            }
        } catch {
            // silent
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory(1);
        adminApi.getUsers().then(res => setAllUsers(res.data || [])).catch(() => {});
    }, [fetchHistory]);

    // Filter user suggestions from local list
    useEffect(() => {
        if (!userQuery.trim() || target !== TARGET_ONE) {
            setUserSuggestions([]);
            return;
        }
        const q = userQuery.toLowerCase();
        setUserSuggestions(
            allUsers.filter(u =>
                u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
            ).slice(0, 6)
        );
    }, [userQuery, target, allUsers]);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setUserQuery(user.username);
        setUserSuggestions([]);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setFeedback(null);

        if (!title.trim() || !message.trim()) {
            setFeedback({ type: 'error', text: 'Vui lòng nhập đầy đủ tiêu đề và nội dung' });
            return;
        }
        if (target === TARGET_ONE && !selectedUser) {
            setFeedback({ type: 'error', text: 'Vui lòng chọn người dùng cụ thể' });
            return;
        }

        setSending(true);
        try {
            const payload = { title: title.trim(), message: message.trim() };
            if (target === TARGET_ONE) payload.userId = selectedUser._id;

            await notificationApi.adminSend(payload);
            setFeedback({ type: 'success', text: target === TARGET_ALL ? 'Đã broadcast tới tất cả người dùng!' : `Đã gửi thông báo tới @${selectedUser.username}` });
            setTitle('');
            setMessage('');
            setUserQuery('');
            setSelectedUser(null);
            fetchHistory(1);
        } catch (err) {
            setFeedback({ type: 'error', text: err?.message || 'Gửi thông báo thất bại' });
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async () => {
        try {
            await notificationApi.adminDelete(deleteId);
            setDeleteId(null);
            fetchHistory(page);
        } catch {
            // silent
        }
    };

    const formatTime = (d) =>
        formatDistanceToNow(new Date(d), { addSuffix: true, locale: vi });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Megaphone size={22} className="text-primary-600" />
                <h2 className="text-xl font-bold text-slate-800">Quản lý Thông Báo</h2>
            </div>

            {/* Send Form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Send size={16} className="text-primary-500" /> Gửi thông báo mới
                </h3>

                {feedback && (
                    <div className={`mb-4 flex items-start gap-2 px-4 py-3 rounded-xl text-sm border ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {feedback.type === 'success' ? <CheckCircle size={16} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />}
                        {feedback.text}
                    </div>
                )}

                <form onSubmit={handleSend} className="space-y-4">
                    {/* Target toggle */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Đối tượng nhận</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                id="target-all-btn"
                                onClick={() => { setTarget(TARGET_ALL); setSelectedUser(null); setUserQuery(''); }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${target === TARGET_ALL ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'}`}
                            >
                                <Globe size={16} /> Tất cả người dùng
                            </button>
                            <button
                                type="button"
                                id="target-one-btn"
                                onClick={() => setTarget(TARGET_ONE)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${target === TARGET_ONE ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'}`}
                            >
                                <User size={16} /> Một người dùng
                            </button>
                        </div>
                    </div>

                    {/* User search */}
                    {target === TARGET_ONE && (
                        <div className="relative">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tìm người dùng *</label>
                            <input
                                id="user-search-input"
                                type="text"
                                value={userQuery}
                                onChange={e => { setUserQuery(e.target.value); setSelectedUser(null); }}
                                placeholder="Nhập username hoặc email..."
                                className="input-field"
                                autoComplete="off"
                            />
                            {userSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                    {userSuggestions.map(u => (
                                        <button
                                            key={u._id}
                                            type="button"
                                            onClick={() => handleSelectUser(u)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                                                {u.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{u.username}</p>
                                                <p className="text-xs text-slate-400">{u.email}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {selectedUser && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                                    <CheckCircle size={13} />
                                    Đã chọn: <span className="font-bold">@{selectedUser.username}</span> — {selectedUser.email}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tiêu đề *</label>
                        <input
                            id="notification-title-input"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="VD: Thông báo bảo trì hệ thống"
                            maxLength={100}
                            className="input-field"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nội dung *</label>
                        <textarea
                            id="notification-message-input"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Nội dung thông báo chi tiết..."
                            rows={3}
                            maxLength={500}
                            className="input-field resize-none"
                        />
                        <p className="text-xs text-slate-400 mt-1 text-right">{message.length}/500</p>
                    </div>

                    <button
                        id="send-notification-btn"
                        type="submit"
                        disabled={sending}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm"
                    >
                        <Send size={16} />
                        {sending ? 'Đang gửi...' : target === TARGET_ALL ? 'Broadcast tất cả' : 'Gửi thông báo'}
                    </button>
                </form>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
                        <Users size={16} className="text-slate-500" /> Lịch sử thông báo đã gửi
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                                <th className="p-4 font-medium">Đối tượng</th>
                                <th className="p-4 font-medium">Tiêu đề</th>
                                <th className="p-4 font-medium">Nội dung</th>
                                <th className="p-4 font-medium whitespace-nowrap">Thời gian</th>
                                <th className="p-4 font-medium text-right">Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyLoading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Đang tải...</td></tr>
                            ) : history.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Chưa có thông báo nào được gửi</td></tr>
                            ) : history.map(noti => (
                                <tr key={noti._id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="p-4">
                                        {noti.isGlobal ? (
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full whitespace-nowrap w-fit">
                                                <Globe size={12} /> Tất cả
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full whitespace-nowrap w-fit">
                                                <User size={12} /> Cá nhân
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 font-semibold text-slate-800 text-sm max-w-[160px] truncate">{noti.title}</td>
                                    <td className="p-4 text-sm text-slate-500 max-w-[220px] truncate">{noti.message}</td>
                                    <td className="p-4 text-xs text-slate-400 whitespace-nowrap">{formatTime(noti.createdAt)}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setDeleteId(noti._id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
                        <span className="text-sm text-slate-500">Trang {page} / {totalPages}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchHistory(page - 1)}
                                disabled={page <= 1}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={15} /> Trước
                            </button>
                            <button
                                onClick={() => fetchHistory(page + 1)}
                                disabled={page >= totalPages}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Sau <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!deleteId}
                title="Xóa thông báo?"
                message="Thông báo này sẽ bị xóa vĩnh viễn và người dùng sẽ không còn thấy nó nữa."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                confirmText="Xóa"
            />
        </div>
    );
};

export default AdminNotificationsPage;
