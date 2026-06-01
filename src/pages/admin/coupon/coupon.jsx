import React, { useEffect, useState } from "react";
import { PencilLine, Trash, Plus, RefreshCw, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteCoupon,
  getCoupon,
  getAllCoupon,
  createCoupon,
  updateCoupon,
} from "../../../features/adminSlice/coupons/couponSlice";

const Coupon = () => {
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector((state) => state.couponAdmin);
  const currentUser = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCoupon, setEditCoupon] = useState({
    id: null,
    name: "",
    expiry: "",
    discount: "",
  });
  const [newCoupon, setNewCoupon] = useState({
    name: "",
    expiry: "",
    discount: "",
  });

  useEffect(() => {
    getCoupons();
  }, []);

  const getCoupons = async () => {
    dispatch(getAllCoupon({ token: currentUser?.token }));
  };

  const filteredCoupons = search.trim()
    ? coupons.filter(
        (coupon) =>
          coupon.name?.toLowerCase().includes(search.toLowerCase()) ||
          coupon.discount?.toString().includes(search)
      )
    : coupons;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCoupon.name.trim() || !newCoupon.discount || !newCoupon.expiry) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      const resultAction = await dispatch(
        createCoupon({ couponData: newCoupon, token: currentUser?.token })
      );
      if (createCoupon.fulfilled.match(resultAction)) {
        toast.success("Thêm mã giảm giá thành công");
        setIsNew(false);
        setNewCoupon({ name: "", expiry: "", discount: "" });
        getCoupons();
      } else {
        toast.error(resultAction.payload?.message || "Thêm thất bại");
      }
    } catch (error) {
      toast.error("Lỗi hệ thống");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editCoupon.name.trim() || !editCoupon.discount || !editCoupon.expiry) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      const resultAction = await dispatch(
        updateCoupon({
          couponId: editCoupon.id,
          couponData: editCoupon,
          token: currentUser?.token,
        })
      );
      if (updateCoupon.fulfilled.match(resultAction)) {
        toast.success("Cập nhật mã giảm giá thành công");
        setIsEdit(false);
        getCoupons();
      } else {
        toast.error(resultAction.payload?.message || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Lỗi hệ thống");
    }
  };

  const startEdit = (coupon) => {
    setIsEdit(true);
    setEditCoupon({
      id: coupon._id || coupon.id,
      name: coupon.name || "",
      discount: coupon.discount || "",
      expiry: coupon.expiry || "",
    });
  };

  const onDelete = async (couponId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;
    try {
      const resultAction = await dispatch(
        deleteCoupon({ couponId: couponId, token: currentUser?.token })
      );
      if (deleteCoupon.fulfilled.match(resultAction)) {
        toast.success("Xóa mã giảm giá thành công");
        getCoupons();
      } else {
        toast.error(resultAction.payload?.message || "Xóa thất bại");
      }
    } catch {
      toast.error("Lỗi hệ thống");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý mã giảm giá</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsNew(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Thêm mã mới
          </button>
          <button
            onClick={() => getCoupons()}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
          >
            <RefreshCw size={18} /> Tải lại
          </button>
        </div>
      </div>

      {/* Ô tìm kiếm */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên mã hoặc phần trăm giảm..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:w-80"
        />
      </div>

      {/* Bảng mã giảm giá */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredCoupons.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Không tìm thấy mã giảm giá nào.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">#</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Tên mã</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Giảm giá (%)</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Ngày hết hạn</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-black-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredCoupons.map((coupon, idx) => (
                    <tr key={coupon._id || coupon.id} className="hover:bg-gray-50 transition">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{idx + 1}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{coupon.name}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{coupon.discount}%</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(coupon.expiry).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => startEdit(coupon)}
                            className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50 transition"
                            title="Sửa"
                          >
                            <PencilLine size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(coupon._id || coupon.id)}
                            className="rounded-md p-1.5 text-red-600 hover:bg-red-50 transition"
                            title="Xóa"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Modal thêm mới */}
      {isNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h3 className="text-xl font-bold text-gray-800">Thêm mã giảm giá</h3>
              <button onClick={() => setIsNew(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tên mã <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCoupon.name}
                  onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="VD: GIAM10, TET2025"
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Giảm giá (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="VD: 10, 20"
                  min="0"
                  max="100"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Ngày hết hạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newCoupon.expiry}
                  onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNew(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Thêm mã
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa */}
      {isEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h3 className="text-xl font-bold text-gray-800">Chỉnh sửa mã giảm giá</h3>
              <button onClick={() => setIsEdit(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-5">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tên mã <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editCoupon.name}
                  onChange={(e) => setEditCoupon({ ...editCoupon, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="VD: GIAM10, TET2025"
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Giảm giá (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={editCoupon.discount}
                  onChange={(e) => setEditCoupon({ ...editCoupon, discount: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="VD: 10, 20"
                  min="0"
                  max="100"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Ngày hết hạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={editCoupon.expiry}
                  onChange={(e) => setEditCoupon({ ...editCoupon, expiry: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEdit(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupon;