import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ForumPostForm from '@/features/forum/components/ForumPostForm';
import { ChevronLeft } from 'lucide-react';

const ForumCreatePage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/forum/my-posts');
  };

  return (
    <div className="py-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/forum" className="inline-flex items-center text-sm text-text-muted hover:text-primary-600 mb-6 transition-colors font-bold">
          <ChevronLeft size={16} className="mr-1" /> Trở về Forum
        </Link>
        
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-slate-50">
            <h1 className="text-2xl font-black text-text-main">Đăng Bán Mã Nguồn Mới</h1>
            <p className="text-text-muted mt-1">Điền thông tin chi tiết để bán mã nguồn của bạn trên diễn đàn. Mỗi user được đăng tối đa 3 bài chờ duyệt.</p>
          </div>
          
          <div className="p-6">
            <ForumPostForm onSubmitSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumCreatePage;
