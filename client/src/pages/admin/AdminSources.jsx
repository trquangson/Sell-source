import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Plus, Edit, Trash2, X, Upload, AlertCircle } from 'lucide-react';
import siteConfig from '../../config/siteConfig';

const AdminSources = () => {
  const [sources, setSources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Khác',
    status: 'active'
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [demoImages, setDemoImages] = useState([]);
  const [sourceFile, setSourceFile] = useState(null);

  const categories = siteConfig.categories;

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const res = await axiosClient.get('/admin/sources');
      setSources(res.data || []);
    } catch (error) {
      console.error('Lỗi lấy danh sách', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditId(null);
    setFormData({ title: '', description: '', price: '', category: 'Khác', status: 'active' });
    setThumbnail(null);
    setDemoImages([]);
    setSourceFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (source) => {
    setEditId(source._id);
    setFormData({
      title: source.title,
      description: source.description,
      price: source.price,
      category: source.category || 'Khác',
      status: source.status || 'active'
    });
    setThumbnail(null);
    setDemoImages([]);
    setSourceFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await axiosClient.delete(`/admin/sources/${deleteId}`);
      fetchSources();
      setDeleteId(null);
    } catch (error) {
      alert('Lỗi xóa sản phẩm');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('status', formData.status);

    if (thumbnail) data.append('thumbnail', thumbnail);
    if (sourceFile) data.append('sourceFile', sourceFile);
    if (demoImages.length > 0) {
      for (let i = 0; i < demoImages.length; i++) {
        data.append('demoImages', demoImages[i]);
      }
    }

    try {
      if (editId) {
        await axiosClient.put(`/admin/sources/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axiosClient.post('/admin/sources', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      fetchSources();
    } catch (error) {
      alert(error.message || 'Lỗi lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Quản lý Mã nguồn</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Thêm mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                <th className="p-4 font-medium">Sản phẩm</th>
                <th className="p-4 font-medium">Giá bán</th>
                <th className="p-4 font-medium">Danh mục</th>
                <th className="p-4 font-medium">Trạng thái</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sources.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    Chưa có sản phẩm nào
                  </td>
                </tr>
              ) : (
                sources.map((item) => (
                  <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={item.thumbnail ? `http://localhost:3000${item.thumbnail}` : 'https://via.placeholder.com/150'}
                        alt="thumbnail"
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">{item.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{item.description}</p>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-primary-600 whitespace-nowrap">
                      {item.price.toLocaleString()}đ
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {item.category || 'Khác'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                        {item.status === 'active' ? 'Đang bán' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteClick(item._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Xóa */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Xóa Mã Nguồn?</h3>
            <p className="text-slate-500 text-sm mb-6">Bạn có chắc chắn muốn xóa? Thao tác này sẽ xóa vĩnh viễn cả file trên server và không thể hoàn tác.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors w-full">Hủy</button>
              <button onClick={confirmDelete} className="px-4 py-2 font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors w-full">Xóa ngay</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{editId ? 'Sửa Mã Nguồn' : 'Thêm Mã Nguồn Mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên mã nguồn</label>
                  <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="input-field" placeholder="VD: Website bán hàng ReactJS..." />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả ngắn</label>
                  <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="3" className="input-field resize-none" placeholder="Mô tả các tính năng chính..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giá bán (VNĐ)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="input-field" placeholder="VD: 500000" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Danh mục</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="input-field py-3">
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="input-field py-3">
                    <option value="active">Đang bán (Active)</option>
                    <option value="inactive">Ẩn (Inactive)</option>
                  </select>
                </div>
              </div>

              {editId && <p className="text-xs text-orange-600 mb-2 mt-4">* Bỏ trống các mục Upload dưới đây nếu bạn không muốn thay đổi file cũ.</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
                  <label className="block cursor-pointer">
                    <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                    <span className="text-sm font-medium text-primary-600">Chọn Ảnh Thumbnail</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
                  </label>
                  {thumbnail && <p className="text-xs text-slate-500 mt-2 truncate">{thumbnail.name}</p>}
                </div>

                <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
                  <label className="block cursor-pointer">
                    <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                    <span className="text-sm font-medium text-primary-600">Chọn File Mã Nguồn (ZIP)</span>
                    <input required={!editId} type="file" className="hidden" accept=".zip,.rar" onChange={(e) => setSourceFile(e.target.files[0])} />
                  </label>
                  {sourceFile && <p className="text-xs text-slate-500 mt-2 truncate">{sourceFile.name}</p>}
                </div>
              </div>

              <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
                <label className="block cursor-pointer">
                  <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                  <span className="text-sm font-medium text-primary-600">Chọn Ảnh Demo (Tối đa 5 ảnh)</span>
                  <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => setDemoImages(Array.from(e.target.files))} />
                </label>
                {demoImages.length > 0 && <p className="text-xs text-slate-500 mt-2 truncate">Đã chọn {demoImages.length} ảnh</p>}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  Hủy bỏ
                </button>
                <button type="submit" disabled={loading} className="btn-primary w-auto min-w-[120px]">
                  {loading ? 'Đang xử lý...' : (editId ? 'Cập nhật' : 'Lưu sản phẩm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSources;
