import React, { useState } from "react";
import { FiX, FiCheckCircle, FiSmartphone } from "react-icons/fi";
import { toast } from "react-toastify";
import orderService from "../features/guestSlice/order/orderService";

const PaymentModal = ({ orderId, totalAmount, paymentUrl, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleSimulatePayment = async () => {
    try {
      setLoading(true);
      await orderService.simulatePaymentSuccess(orderId);
      toast.success("Giả lập thanh toán thành công!");
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error) {
      toast.error("Lỗi giả lập thanh toán");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <FiX size={24} />
          </button>
          <img 
            src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" 
            alt="ZaloPay" 
            className="w-12 h-12 mx-auto mb-2 rounded-lg bg-white p-1"
          />
          <h3 className="text-white font-bold text-lg">Cổng thanh toán ZaloPay</h3>
          <p className="text-blue-100 text-sm">Đơn hàng: #{orderId.slice(-6).toUpperCase()}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-1">Số tiền thanh toán</p>
            <p className="text-3xl font-bold text-gray-800">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalAmount)}
            </p>
          </div>

          <div className="flex justify-center my-4">
             <div className="border-2 border-dashed border-gray-300 p-2 rounded-lg relative">
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${paymentUrl || "DEMO"}`} 
                    alt="QR Code" 
                    className="w-40 h-40 opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-2 py-1 text-xs font-bold text-gray-500 shadow-sm rounded">DEMO QR</span>
                </div>
             </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSimulatePayment}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              {loading ? (
                "Đang xử lý..."
              ) : (
                <>
                  <FiCheckCircle size={20} />
                  Xác nhận đã thanh toán (Test)
                </>
              )}
            </button>
            
            {paymentUrl && (
                <a 
                    href={paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center py-3 text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition"
                >
                    Thử mở App ZaloPay thật <FiSmartphone className="inline ml-1" />
                </a>
            )}

            {/* ✅ Nút Hủy thanh toán – mới thêm */}
            <button
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-all"
            >
              Hủy thanh toán
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 text-center text-xs text-gray-400">
          Hệ thống đang chạy trong chế độ Test Mode
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;