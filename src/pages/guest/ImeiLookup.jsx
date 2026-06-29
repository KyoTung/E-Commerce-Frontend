import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderByImei } from "../../features/adminSlice/orders/orderSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../components/Loading";

const ImeiLookup = () => {
  const dispatch = useDispatch();
  const { imeiResult, loading, error } = useSelector((state) => state.orderAdmin);
  const [imei, setImei] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = imei.trim();
    if (!trimmed) {
      toast.warning("Vui lòng nhập IMEI/Serial");
      return;
    }
    if (trimmed.length < 10) {
      toast.warning("IMEI/Serial phải có ít nhất 10 ký tự");
      return;
    }
    dispatch(getOrderByImei(trimmed));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const map = {
      "Not Processed": "text-gray-600",
      Confirmed: "text-blue-600",
      Processing: "text-yellow-600",
      Dispatched: "text-cyan-600",
      Delivered: "text-green-600",
      Cancelled: "text-red-600",
      Returned: "text-orange-600",
    };
    return map[status] || "text-gray-600";
  };

  const getStatusText = (status) => {
    const map = {
      "Not Processed": "Chờ xác nhận",
      Confirmed: "Đã xác nhận",
      Processing: "Đang chuẩn bị",
      Dispatched: "Đang giao hàng",
      Delivered: "Đã giao hàng",
      Cancelled: "Đã hủy",
      Returned: "Đã trả hàng",
    };
    return map[status] || status;
  };

  // Xóa kết quả cũ khi người dùng nhập mới
  const handleInputChange = (e) => {
    setImei(e.target.value);
    // Nếu có kết quả cũ và input thay đổi, ta có thể reset (không bắt buộc)
    // dispatch(resetImeiResult()); // nếu có action
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tra cứu bảo hành sản phẩm</h1>
          <p className="text-gray-500 mt-2">
            Nhập mã IMEI hoặc số Serial để kiểm tra thông tin bảo hành
          </p>
        </div>

        {/* Form tìm kiếm */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={imei}
              onChange={handleInputChange}
              placeholder="VD: 123456789012345"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 font-medium transition"
            >
              {loading ? "Đang tra..." : "Tra cứu"}
            </button>
          </form>
        </div>

        {/* Kết quả */}
        {loading && (
          <div className="flex justify-center py-10">
            <Loading />
          </div>
        )}

        {!loading && imeiResult && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-start gap-4 border-b pb-4">
              <img
                src={imeiResult.product?.images?.[0]?.url || "https://via.placeholder.com/80"}
                alt={imeiResult.product?.title}
                className="w-20 h-20 object-contain border rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/80";
                }}
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {imeiResult.product?.title || "Sản phẩm không xác định"}
                </h2>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">IMEI:</span> {imeiResult.imei}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p><span className="font-medium">Khách hàng:</span> {imeiResult.customerName}</p>
                <p><span className="font-medium">Số điện thoại:</span> {imeiResult.customerPhone}</p>
                <p><span className="font-medium">Ngày mua:</span> {formatDate(imeiResult.orderDate)}</p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Hạn bảo hành:</span>{" "}
                  <span className="text-green-600 font-semibold">
                    {formatDate(imeiResult.warrantyExpiry)}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Trạng thái đơn hàng:</span>{" "}
                  <span className={`font-semibold ${getStatusColor(imeiResult.status)}`}>
                    {getStatusText(imeiResult.status)}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Mã đơn hàng:</span> #{imeiResult.orderId?.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            {imeiResult.status === "Delivered" || imeiResult.status === "Completed" ? (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                ✅ Sản phẩm đang trong thời gian bảo hành (nếu còn hạn)
              </div>
            ) : imeiResult.status === "Cancelled" || imeiResult.status === "Returned" ? (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                ⚠️ Đơn hàng đã bị hủy/trả, không áp dụng bảo hành
              </div>
            ) : (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                ℹ️ Đơn hàng chưa hoàn tất, vui lòng liên hệ cửa hàng để được hỗ trợ
              </div>
            )}
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center">
            {error?.error || error?.message || "Không tìm thấy sản phẩm với IMEI này"}
          </div>
        )}

        {!loading && !imeiResult && !error && (
          <div className="text-center text-gray-400 mt-10">
            Nhập IMEI để tra cứu thông tin bảo hành.
          </div>
        )}
      </div>
    </div>
  );
};

export default ImeiLookup;