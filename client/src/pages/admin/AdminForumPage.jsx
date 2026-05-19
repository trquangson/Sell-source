import React from 'react';
import ForumPostManagement from '@/features/admin/components/ForumPostManagement';

const AdminForumPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Quản Lý Diễn Đàn</h1>
        <p className="text-slate-500 mt-2 font-medium">Duyệt và quản lý bài đăng bán mã nguồn của người dùng.</p>
      </div>
      
      <ForumPostManagement />
    </div>
  );
};

export default AdminForumPage;
