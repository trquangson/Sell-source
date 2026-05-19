import React, { useState, useEffect } from 'react';
import UserDashboardLayout from '@/shared/components/UserDashboardLayout';
import { forumApi } from '@/features/forum/api/forumApi';
import { Edit2, Trash2, Eye, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfirmModal from '@/shared/components/ConfirmModal';

const ForumMyPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await forumApi.getMyPosts();
      setPosts(res.data);
    } catch (error) {
      console.error('Lỗi lấy bài đăng của tôi', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteLoading(true);
    try {
      await forumApi.deletePost(deleteModal.id);
      setDeleteModal({ isOpen: false, id: null });
      fetchPosts();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Lỗi khi xóa');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <UserDashboardLayout>
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-text-main">Bài Đăng Của Tôi</h2>
            <p className="text-sm text-text-muted mt-1">Quản lý các mã nguồn bạn đang bán trên diễn đàn.</p>
          </div>
          <Link to="/forum/create" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-sm text-sm">
            <Plus size={16} /> Đăng bài mới
          </Link>
        </div>
        
        <div className="p-6">
          {loading ? (
             <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary-500" size={32} /></div>
          ) : posts.length === 0 ? (
             <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
               <p className="text-slate-500 mb-4">Bạn chưa đăng bán mã nguồn nào.</p>
               <Link to="/forum/create" className="text-primary-600 font-medium hover:underline">Đăng bài đầu tiên ngay</Link>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-sm font-semibold text-slate-600">
                    <th className="pb-3 px-4">Tên sản phẩm</th>
                    <th className="pb-3 px-4">Giá bán</th>
                    <th className="pb-3 px-4">Lượt mua</th>
                    <th className="pb-3 px-4">Trạng thái</th>
                    <th className="pb-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                            {(post.thumbnail || (post.demoImages && post.demoImages[0])) ? (
                              <img src={`${import.meta.env.VITE_API_URL}${post.thumbnail || post.demoImages[0]}`} className="w-full h-full object-cover" alt="" />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 line-clamp-1">{post.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{post.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-primary-600">{formatPrice(post.price)}</td>
                      <td className="py-4 px-4 font-medium text-slate-600">{post.purchaseCount}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col items-start gap-1">
                          {getStatusBadge(post.status)}
                          {post.status === 'rejected' && post.rejectionReason && (
                             <span className="text-[10px] text-red-500 max-w-[150px] line-clamp-2" title={post.rejectionReason}>Lý do: {post.rejectionReason}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {post.status === 'approved' && (
                            <Link to={`/forum/${post._id}`} className="p-2 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors" title="Xem bài">
                              <Eye size={16} />
                            </Link>
                          )}
                          {(post.status === 'pending' || post.status === 'rejected') && (
                            <Link to={`/forum/edit/${post._id}`} className="p-2 text-slate-400 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 rounded-lg transition-colors" title="Sửa bài">
                              <Edit2 size={16} />
                            </Link>
                          )}
                          {post.purchaseCount === 0 && (
                            <button onClick={() => setDeleteModal({ isOpen: true, id: post._id })} className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors" title="Xóa bài">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Xác nhận xóa bài đăng"
        message="Bạn có chắc chắn muốn xóa bài đăng này không? Dữ liệu không thể khôi phục."
        isLoading={deleteLoading}
      />
    </UserDashboardLayout>
  );
};

export default ForumMyPostsPage;
