import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '@/shared/api/axiosClient';
import { Loader2, UserCircle, Star, ShoppingBag, Clock, ChevronLeft } from 'lucide-react';
import ForumPostListRow from '@/features/forum/components/ForumPostListRow';

const UserProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get(`/profile/user/${id}`);
        setProfile(res.profile.user);
        setPosts(res.profile.posts);
      } catch (err) {
        setError(err.response?.data?.message || 'Không tìm thấy người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <UserCircle size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-600 font-medium">{error || 'Người dùng không tồn tại'}</p>
          <Link to="/forum" className="mt-4 inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold">
            Quay lại Diễn đàn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-8">
      <div className="max-w-5xl mx-auto px-4">
        <Link to="/forum" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors font-bold">
          <ChevronLeft size={16} className="mr-1" /> Trở về Forum
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
            {profile.avatar ? (
              <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-black text-slate-400">{profile.username?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 mb-2">{profile.fullName || profile.username}</h1>
            <p className="text-slate-500 font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
              Thành viên chợ <span className="w-1 h-1 rounded-full bg-slate-300"></span> 
              <Clock size={14} className="text-slate-400" /> Tham gia {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="flex flex-col items-center md:items-start bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Đánh giá</span>
                <div className="flex items-center gap-1.5 font-black text-slate-800">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  {profile.averageRating?.toFixed(1) || '0.0'} <span className="text-xs font-medium text-slate-500">({profile.ratingCount || 0})</span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Lượt bán</span>
                <div className="flex items-center gap-1.5 font-black text-slate-800">
                  <ShoppingBag size={16} className="text-blue-500" />
                  {profile.totalSales || 0} <span className="text-xs font-medium text-slate-500">lượt</span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sản phẩm</span>
                <div className="flex items-center gap-1.5 font-black text-slate-800">
                  {posts.length} <span className="text-xs font-medium text-slate-500">mã nguồn</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <h2 className="text-xl font-bold text-slate-900 mb-4">Các mã nguồn đang bán</h2>
        {posts.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10">
            <div className="divide-y divide-slate-100">
              {posts.map((post) => (
                <ForumPostListRow key={post._id} post={{...post, sellerId: profile}} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <ShoppingBag className="text-slate-300 mx-auto mb-4" size={40} />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Chưa có mã nguồn nào</h3>
            <p className="text-slate-500 text-sm">Người dùng này chưa đăng bán mã nguồn nào.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserProfilePage;
