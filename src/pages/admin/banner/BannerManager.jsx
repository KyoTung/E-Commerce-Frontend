// src/pages/admin/banner/BannerManager.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBanners,
  createBannerThunk,
  updateBannerThunk,
  deleteBannerThunk,
  uploadBannerImageThunk,
  deleteBannerImageThunk,
} from '../../../features/adminSlice/banner/bannerSlice';
import Loading from '../../../components/Loading';
import { toast } from 'react-toastify';
import { Trash2, Edit, Plus, Upload, X } from 'lucide-react';

const BannerManager = () => {
  const dispatch = useDispatch();
  const { banners, loading, total, page, limit } = useSelector((state) => state.banner);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    position: 'top',
    order: 0,
    isActive: true,
    startDate: '',
    endDate: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchBanners({ page, limit }));
  }, [dispatch, page, limit]);

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        link: banner.link || '',
        position: banner.position || 'top',
        order: banner.order,
        isActive: banner.isActive,
        startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
        endDate: banner.endDate ? banner.endDate.split('T')[0] : '',
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        link: '',
        position: 'top',
        order: 0,
        isActive: true,
        startDate: '',
        endDate: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.warning('Vui lòng nhập tiêu đề');
    if (editingBanner) {
      await dispatch(updateBannerThunk({ id: editingBanner._id, data: formData }));
    } else {
      await dispatch(createBannerThunk(formData));
    }
    setShowModal(false);
    dispatch(fetchBanners({ page, limit }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa banner này?')) {
      await dispatch(deleteBannerThunk(id));
      dispatch(fetchBanners({ page, limit }));
    }
  };

  const handleUploadImage = async (bannerId, file) => {
    if (!file) return;
    setUploading(true);
    await dispatch(uploadBannerImageThunk({ id: bannerId, file }));
    setUploading(false);
    dispatch(fetchBanners({ page, limit }));
  };

  const handleDeleteImage = async (bannerId) => {
    if (window.confirm('Xóa ảnh này?')) {
      await dispatch(deleteBannerImageThunk(bannerId));
      dispatch(fetchBanners({ page, limit }));
    }
  };

  if (loading && banners.length === 0) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Banner</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Thêm banner
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ảnh</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vị trí</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thứ tự</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {banners.map((banner) => (
              <tr key={banner._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {banner.image?.url ? (
                    <div className="relative w-16 h-16 group">
                      <img
                        src={banner.image.url}
                        className="w-full h-full object-cover rounded border"
                        alt={banner.title}
                      />
                      <button
                        onClick={() => handleDeleteImage(banner._id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-gray-200 w-fit">
                      <Upload size={12} /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadImage(banner._id, e.target.files[0])}
                        disabled={uploading}
                      />
                    </label>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">{banner.title}</td>
                <td className="px-6 py-4">
                  <span className="capitalize px-2 py-1 rounded-full bg-gray-100 text-xs">
                    {banner.position}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs truncate text-gray-500">{banner.link || '-'}</td>
                <td className="px-6 py-4 text-center">{banner.order}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {banner.isActive ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenModal(banner)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {total > limit && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => dispatch(fetchBanners({ page: p, limit }))}
              className={`px-3 py-1 rounded transition ${page === p ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Modal thêm/sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{editingBanner ? 'Sửa banner' : 'Thêm banner'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link (URL)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="top">Top (toàn bộ chiều rộng)</option>
                  <option value="bottom-left">Góc dưới trái</option>
                  <option value="bottom-right">Góc dưới phải</option>
                  <option value="center">Giữa màn hình (popup)</option>
                  <option value="left">Bên trái (dọc)</option>
                  <option value="right">Bên phải (dọc)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự (số nhỏ lên trước)</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="true">Hiển thị</option>
                  <option value="false">Ẩn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu (không bắt buộc)</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {editingBanner ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManager;