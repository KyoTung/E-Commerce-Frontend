import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import orderService from "../../features/guestSlice/order/orderService"

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Lấy status từ URL (1: Thành công, Các mã khác: Thất bại)
  const status = searchParams.get('status');
  
  // Lấy ID đơn hàng từ LocalStorage (Đã lưu lúc bấm nút Thanh toán ở bước Checkout)
  const currentOrderId = localStorage.getItem("currentOrderId");

  // --- 1. XỬ LÝ ĐỔI SANG COD ---
  const handleSwitchToCOD = async () => {
    if (!currentOrderId) return alert("Không tìm thấy thông tin đơn hàng!");
    
    if (window.confirm("Bạn có chắc muốn đổi sang thanh toán khi nhận hàng?")) {
      setIsLoading(true);
      try {
        // Gọi API trong orderService
        await orderService.switchToCOD(currentOrderId);

        // Thành công
        alert("Đã chuyển đổi phương thức thanh toán thành công!");
        
        // Xóa ID đơn hàng tạm và chuyển về trang quản lý đơn hàng
        localStorage.removeItem("currentOrderId");
        navigate("/orders");
      } catch (error) {
        console.error("Lỗi đổi COD:", error);
        alert(error.response?.data?.message || "Có lỗi xảy ra khi đổi phương thức thanh toán.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- 2. XỬ LÝ THANH TOÁN LẠI ZALOPAY ---
  const handleRetryZalo = async () => {
    if (!currentOrderId) return alert("Không tìm thấy thông tin đơn hàng!");

    setIsLoading(true);
    try {
      // Gọi API repayOrder để lấy link thanh toán mới
      const data = await orderService.repayOrder(currentOrderId);

      if (data && data.paymentUrl) {
        //Chuyển hướng trình duyệt sang cổng ZaloPay
        window.location.href = data.paymentUrl;
      } else {
        alert("Không lấy được đường dẫn thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi Retry Zalo:", error);
      alert(error.response?.data?.message || "Không thể tạo lại yêu cầu thanh toán.");
      setIsLoading(false); // Chỉ tắt loading khi lỗi, nếu thành công thì trang đã redirect rồi
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {status === '1' ? (
        // --- TRƯỜNG HỢP THÀNH CÔNG ---
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
           <h2 className="text-2xl font-bold text-green-600 mb-2">Thanh toán thành công!</h2>
           <p className="text-gray-600">Cảm ơn bạn đã mua hàng.</p>
           <button 
              onClick={() => {
                localStorage.removeItem("currentOrderId"); // Dọn dẹp
                navigate("/");
              }} 
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition">
              Về trang chủ
           </button>
        </div>
      ) : (
        // --- TRƯỜNG HỢP THẤT BẠI / HỦY BỎ ---
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-3xl">⚠️</span>
           </div>
           <h2 className="text-2xl font-bold text-red-600 mb-2">Giao dịch chưa hoàn tất</h2>
           <p className="text-gray-600 mb-6 text-sm">
             Bạn đã hủy giao dịch hoặc thanh toán gặp sự cố. <br/>
             Đơn hàng của bạn vẫn được lưu giữ.
           </p>
           
           <div className="space-y-3">
               {/* Nút 1: Thử lại ZaloPay */}
               <button 
                  onClick={handleRetryZalo}
                  disabled={isLoading}
                  className={`w-full text-white font-medium py-2 px-4 rounded transition flex justify-center items-center
                    ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
               >
                  {isLoading ? "Đang xử lý..." : "Thử thanh toán lại bằng ZaloPay"}
               </button>

               {/* Nút 2: Đổi sang COD */}
               <button 
                  onClick={handleSwitchToCOD}
                  disabled={isLoading}
                  className={`w-full bg-white border-2 border-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
               >
                  Đổi sang Thanh toán khi nhận hàng (COD)
               </button>

               {/* Nút 3: Về trang chủ */}
               <button 
                  onClick={() => navigate("/")}
                  className="text-gray-400 text-sm hover:underline mt-2">
                  Quay về trang chủ
               </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PaymentResult;