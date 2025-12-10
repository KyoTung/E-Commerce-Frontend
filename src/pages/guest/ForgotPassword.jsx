import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { forgotPasswordToken } from "../../features/authSlice/authSlice";
import { ToastContainer, toast } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [emailSent, setEmailSent] = useState(false);

 
  useEffect(() => {
    
    if (isError && message) {
      toast.error(message); 
    }
  }, [isError, message]);


  const onSubmit = async (data) => {
    const result = await dispatch(forgotPasswordToken(data.email));
    
    
    if (forgotPasswordToken.fulfilled.match(result)) {
        setEmailSent(true);
     
        toast.success("Gửi yêu cầu thành công!"); 
    }
  };

  if (emailSent) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <ToastContainer />
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="text-green-600 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã gửi email!</h2>
                <p className="text-gray-600 mb-6">
                   
                    Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư đến (và cả mục spam).
                </p>
                <div className="space-y-3">
                    <Link to="/login" className="block w-full bg-[#d70018] text-white py-2.5 rounded-lg font-bold hover:bg-[#b00117] transition">
                        Quay lại Đăng nhập
                    </Link>
                    <button 
                        onClick={() => setEmailSent(false)} 
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        Thử lại với email khác
                    </button>
                </div>
            </div>
        </div>
      )
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="text-center mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiMail className="text-[#d70018] text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Quên mật khẩu?</h2>
            <p className="text-gray-500 text-sm mt-2">
              Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
            </p>
        </div>

        {isError && message && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                <FiAlertCircle className="shrink-0" />
                <span>{message}</span>
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email đăng ký</label>
            <input
              type="email"
              {...register("email", { 
                  required: "Vui lòng nhập email",
                  pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" }
              })}
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#d70018] focus:border-[#d70018] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="example@gmail.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#d70018] text-white py-3 rounded-lg font-bold hover:bg-[#b00117] transition flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : "Gửi yêu cầu"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-[#d70018]">
            <FiArrowLeft className="mr-1" /> Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;