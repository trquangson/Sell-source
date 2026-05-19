import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ForumPostForm from '@/features/forum/components/ForumPostForm';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { forumApi } from '@/features/forum/api/forumApi';
import axiosClient from '@/shared/api/axiosClient';

const ForumEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await forumApi.getPostById(id);
        setPost(res.data);
      } catch (error) {
        console.error('Lỗi lấy bài đăng', error);
        alert('Không thể tải bài đăng hoặc bạn không có quyền sửa.');
        navigate('/forum/my-posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleSuccess = () => {
    navigate('/forum/my-posts');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  return (
    <div className="py-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/forum/my-posts" className="inline-flex items-center text-sm text-text-muted hover:text-primary-600 mb-6 transition-colors font-bold">
          <ChevronLeft size={16} className="mr-1" /> Trở về quản lý bài đăng
        </Link>
        
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-slate-50">
            <h1 className="text-2xl font-black text-text-main">Sửa Bài Đăng</h1>
            <p className="text-text-muted mt-1">Cập nhật thông tin bài đăng diễn đàn của bạn. Sau khi cập nhật, bài sẽ chuyển về trạng thái "Chờ duyệt".</p>
          </div>
          
          <div className="p-6">
            <ForumPostForm initialData={post} onSubmitSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumEditPage;
