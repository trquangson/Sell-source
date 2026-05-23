import React, { useState, useEffect } from 'react';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { forumApi } from '../api/forumApi';
import siteConfig from '@/config/siteConfig';
import { useTranslation } from 'react-i18next';

const ForumPostForm = ({ initialData, onSubmitSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    category: 'Khác',
    tags: ''
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [demoImages, setDemoImages] = useState([]);
  const [sourceFile, setSourceFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = siteConfig.categories;

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        shortDescription: initialData.shortDescription || '',
        price: initialData.price || '',
        category: initialData.category || 'Khác',
        tags: initialData.tags ? initialData.tags.join(', ') : ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const files = e.target.files;
    if (!files.length) return;

    if (type === 'thumbnail') {
      setThumbnail(files[0]);
    } else if (type === 'demoImages') {
      const fileArray = Array.from(files).slice(0, 5); // max 5
      setDemoImages(fileArray);
    } else if (type === 'sourceFile') {
      setSourceFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!initialData && !sourceFile) {
      setError('Bắt buộc phải tải lên file source code (.zip hoặc .rar)');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));

      if (thumbnail) data.append('forumThumbnail', thumbnail);
      if (sourceFile) data.append('forumSourceFile', sourceFile);
      if (demoImages.length > 0) {
        demoImages.forEach(file => data.append('forumDemoImages', file));
      }

      if (initialData) {
        await forumApi.updatePost(initialData._id, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await forumApi.createPost(data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t('forum_form.title', 'Tiêu đề')} <span className="text-red-500">*</span></label>
          <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder={t('forum_form.title_placeholder', 'Ví dụ: Source code quản lý bán hàng...')} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t('forum_form.price', 'Giá bán (VNĐ)')} <span className="text-red-500">*</span></label>
          <input required type="number" min="1" name="price" value={formData.price} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="50000" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t('forum.category', 'Danh mục')}</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all">
            {categories.map(cat => <option key={cat} value={cat}>{t(`categories.${cat}`, cat)}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t('forum_form.tags', 'Tags (cách nhau bằng dấu phẩy)')}</label>
          <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="react, nodejs, tailwind..." />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">{t('forum_form.short_description', 'Mô tả ngắn')}</label>
        <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder={t('forum_form.short_desc_placeholder', 'Mô tả ngắn gọn về sản phẩm...')}></textarea>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">{t('forum_form.description', 'Mô tả chi tiết')} <span className="text-red-500">*</span></label>
        <textarea required name="description" value={formData.description} onChange={handleChange} rows="6" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder={t('forum_form.desc_placeholder', 'Tính năng, hướng dẫn cài đặt, công nghệ sử dụng...')}></textarea>
      </div>

      <div className="space-y-4 border-t border-slate-200 pt-6">
        <h4 className="font-medium text-slate-800">{t('forum_form.attachments', 'Tệp đính kèm')}</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t('forum_form.thumbnail', 'Ảnh Thumbnail')}</label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer overflow-hidden group min-h-[100px] flex items-center justify-center">
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'thumbnail')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />

              {!thumbnail && initialData?.thumbnail ? (
                <div className="absolute inset-0 w-full h-full bg-slate-100">
                  <img src={`${siteConfig.assetBaseUrl}${initialData.thumbnail}`} alt="Thumbnail" className="w-full h-full object-cover opacity-50 group-hover:opacity-20 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon size={24} className="text-slate-700" />
                    <span className="text-xs font-bold text-slate-700 mt-1">{t('forum_form.change_image', 'Đổi ảnh')}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-500 relative z-0">
                  <ImageIcon size={24} />
                  <span className="text-xs">{thumbnail ? thumbnail.name : t('forum_form.choose_image', 'Chọn ảnh')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t('forum_form.demo_images', 'Ảnh Demo (Max 5)')}</label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[100px] flex items-center justify-center">
              <input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'demoImages')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center gap-1 text-slate-500">
                <ImageIcon size={24} />
                <span className="text-xs">{demoImages.length > 0 ? t('forum_form.images_selected', '{{count}} ảnh đã chọn', { count: demoImages.length }) : (!demoImages.length && initialData?.demoImages?.length > 0 ? t('forum_form.keep_old_images', 'Giữ ảnh cũ') : t('forum_form.choose_images', 'Chọn các ảnh'))}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t('forum_form.source_file', 'File Source (ZIP/RAR)')} {initialData ? '' : <span className="text-red-500">*</span>}</label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[100px] flex items-center justify-center">
              <input type="file" accept=".zip,.rar" onChange={(e) => handleFileChange(e, 'sourceFile')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center gap-1 text-slate-500">
                <Upload size={24} />
                <span className="text-xs">{sourceFile ? sourceFile.name : (initialData ? t('forum_form.leave_empty', 'Để trống nếu không đổi') : t('forum_form.choose_file', 'Chọn file (Max 100MB)'))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button disabled={loading} type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-btn flex items-center gap-2 disabled:opacity-50">
          {loading && <Loader2 size={20} className="animate-spin" />}
          {initialData ? t('forum_form.update', 'Cập nhật') : t('forum_form.publish', 'Đăng bán')}
        </button>
      </div>
    </form>
  );
};

export default ForumPostForm;
