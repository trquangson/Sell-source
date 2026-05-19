import React, { useState, useEffect } from 'react';
import { authApi } from '@/features/auth/api/authApi';
import { adminApi } from '@/features/admin/api/adminApi';
import { Shield, ShieldAlert, Trash2, AlertCircle, Edit2 } from 'lucide-react';
import ConfirmModal from '@/shared/components/ConfirmModal';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await authApi.getMe();
      setCurrentUser(res.user);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsers(res.data || []);
    } catch (error) {
      console.error('Lỗi lấy danh sách user', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      fetchUsers(); // Cập nhật lại danh sách
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi cập nhật quyền');
    }
  };

  const handleEditBalance = async (user) => {
    const currentBalance = user.balance || 0;
    const input = window.prompt(`Nhập số dư mới cho người dùng ${user.username}:`, currentBalance);
    
    if (input === null) return; // User cancelled
    
    const newBalance = Number(input);
    if (isNaN(newBalance) || newBalance < 0) {
      alert('Số dư không hợp lệ!');
      return;
    }

    try {
      await adminApi.updateUserBalance(user._id, newBalance);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi cập nhật số dư');
    }
  };

  const confirmDelete = async () => {
    try {
      await adminApi.deleteUser(deleteId);
      fetchUsers();
      setDeleteId(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi xóa người dùng');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Quản lý Người dùng</h2>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                <th className="p-4 font-medium">Người dùng</th>
                <th className="p-4 font-medium">Số dư</th>
                <th className="p-4 font-medium">Phân quyền</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && users.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">Đang tải...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">Chưa có người dùng nào</td></tr>
              ) : (
                users.map((user) => {
                  const isMe = currentUser && currentUser._id === user._id;
                  
                  return (
                    <tr key={user._id} className={`border-b border-slate-100 hover:bg-slate-50 ${isMe ? 'bg-primary-50/50' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                            {user.fullName?.charAt(0) || 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {user.fullName} {isMe && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full ml-1">Bạn</span>}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            <p className="text-xs text-slate-400 truncate">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{user.balance?.toLocaleString()}đ</span>
                          <button 
                            onClick={() => handleEditBalance(user)} 
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title="Sửa số dư"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <select 
                          value={user.role} 
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          disabled={isMe} // Không cho tự đổi quyền mình
                          className={`text-sm rounded-lg px-3 py-1.5 border outline-none cursor-pointer ${
                            user.role === 'admin' 
                              ? 'bg-purple-50 text-purple-700 border-purple-200' 
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          } ${isMe ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="user">User thường</option>
                          <option value="admin">Quản trị viên (Admin)</option>
                        </select>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button 
                          onClick={() => setDeleteId(user._id)} 
                          disabled={isMe}
                          className={`p-2 rounded-lg transition-colors ${
                            isMe 
                              ? 'text-slate-300 cursor-not-allowed' 
                              : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={isMe ? 'Không thể xóa chính mình' : 'Xóa tài khoản'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Xóa Tài Khoản?"
        message="Bạn có chắc chắn muốn xóa người dùng này? Thao tác này sẽ xóa vĩnh viễn toàn bộ dữ liệu của họ và không thể hoàn tác."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminUsersPage;
