import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { forumApi } from '@/features/forum/api/forumApi';
import { Eye, Check, X, EyeOff, Loader2 } from 'lucide-react';
import Pagination from '@/shared/components/Pagination';
import ConfirmModal from '@/shared/components/ConfirmModal';

const ForumPostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // '', 'pending', 'approved', 'rejected', 'hidden'
  
  const [actionModal, setActionModal] = useState({ isOpen: false, id: null, type: null, reason: '' }); // type: 'approve', 'reject', 'hide'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const res = await forumApi.getAllPostsForAdmin(params);
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!actionModal.id || !actionModal.type) return;
    setActionLoading(true);
    try {
      let status = '';
      if (actionModal.type === 'approve') status = 'approved';
      if (actionModal.type === 'reject') status = 'rejected';
      if (actionModal.type === 'hide') status = 'hidden';

      await forumApi.updatePostStatus(actionModal.id, {
         status,
         rejectionReason: actionModal.type === 'reject' ? actionModal.reason : ''
      });
      
      setActionModal({ isOpen: false, id: null, type: null, reason: '' });
      fetchPosts();
    } catch (error) {
       console.error(error);
       alert(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
       setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Đã duyệt</span>;
      case 'pending': return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Chờ duyệt</span>;
      case 'rejected': return <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Từ chối</span>;
      case 'hidden': return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">Đã ẩn</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
        <h2 className="text-xl font-bold text-text-main">Quản Lý Diễn Đàn</h2>
        
        <div className="flex gap-2">
            {['', 'pending', 'approved', 'rejected', 'hidden'].map(status => (
                <button 
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === status ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                   {status === '' ? 'Tất cả' : status === 'pending' ? 'Chờ duyệt' : status === 'approved' ? 'Đã duyệt' : status === 'rejected' ? 'Từ chối' : 'Đã ẩn'}
                </button>
            ))}
        </div>
      </div>

      <div className="p-0">
        {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-500" size={32} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-border">
                <tr>
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4">Người bán</th>
                  <th className="px-6 py-4">Giá</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map(post => (
                  <tr key={post._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 line-clamp-1 max-w-[250px]">{post.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="font-medium text-slate-700">{post.sellerId?.username}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary-600">
                        {new Intl.NumberFormat('vi-VN').format(post.price)}đ
                    </td>
                    <td className="px-6 py-4">
                        {getStatusBadge(post.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === 'pending' && (
                            <>
                                <button onClick={() => setActionModal({ isOpen: true, id: post._id, type: 'approve', reason: '' })} className="p-2 text-green-600 hover:bg-green-100 rounded-lg" title="Duyệt">
                                   <Check size={18} />
                                </button>
                                <button onClick={() => setActionModal({ isOpen: true, id: post._id, type: 'reject', reason: '' })} className="p-2 text-red-600 hover:bg-red-100 rounded-lg" title="Từ chối">
                                   <X size={18} />
                                </button>
                            </>
                        )}
                        {post.status === 'approved' && (
                             <button onClick={() => setActionModal({ isOpen: true, id: post._id, type: 'hide', reason: '' })} className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg" title="Ẩn bài">
                                <EyeOff size={18} />
                             </button>
                        )}
                        <Link to={`/forum/${post._id}`} target="_blank" className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg" title="Xem bài">
                            <Eye size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Modal (Approve/Hide/Reject) */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                 {actionModal.type === 'approve' ? 'Duyệt bài đăng' : actionModal.type === 'reject' ? 'Từ chối bài đăng' : 'Ẩn bài đăng'}
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                 {actionModal.type === 'approve' ? 'Bài đăng sẽ hiển thị công khai trên chợ.' : actionModal.type === 'hide' ? 'Bài đăng sẽ bị ẩn khỏi chợ, người bán có thể liên hệ sau.' : 'Vui lòng nhập lý do từ chối để người bán biết và sửa lại.'}
              </p>
              
              {actionModal.type === 'reject' && (
                  <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Lý do từ chối</label>
                      <textarea 
                          value={actionModal.reason} 
                          onChange={(e) => setActionModal(prev => ({...prev, reason: e.target.value}))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                          rows="3"
                          placeholder="Ví dụ: Thiếu file demo, giá không hợp lệ..."
                      ></textarea>
                  </div>
              )}
              
              <div className="flex gap-3 justify-end">
                <button
                  disabled={actionLoading}
                  onClick={() => setActionModal({ isOpen: false, id: null, type: null, reason: '' })}
                  className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  disabled={actionLoading || (actionModal.type === 'reject' && !actionModal.reason.trim())}
                  onClick={handleAction}
                  className={`px-5 py-2.5 rounded-xl font-bold text-white transition-colors flex items-center gap-2 ${
                      actionModal.type === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                      actionModal.type === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                      'bg-slate-600 hover:bg-slate-700'
                  } disabled:opacity-50`}
                >
                  {actionLoading && <Loader2 size={16} className="animate-spin" />}
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumPostManagement;
