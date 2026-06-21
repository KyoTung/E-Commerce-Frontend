import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import {
  Plus,
  Trash,
  ArrowLeft,
  Search,
  Package,
  Minus,
  User,
} from "lucide-react";
import Select from "react-select";

import { getAllProducts } from "../../../features/adminSlice/products/productSlice";
import { adminCreateOrderThunk } from "../../../features/adminSlice/orders/orderSlice";
import { getAllUser } from "../../../features/adminSlice/customerSlice/customerSlice";
import Loading from "../../../components/Loading";

const AdminCreateOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { products, isLoading: productsLoading } = useSelector(
    (state) => state.productAdmin,
  );
  const { allUsers, isLoading: usersLoading } = useSelector(
    (state) => state.customer,
  );
  const { isLoading: orderLoading, isSuccess } = useSelector(
    (state) => state.orderAdmin,
  );

  // Local state cho đơn hàng
  const [orderItems, setOrderItems] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  // State tìm kiếm sản phẩm
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllUser({ page: 1, limit: 9999, search: "" }));
  }, [dispatch]);

  // Khi chọn user, tự động điền thông tin vào form
  useEffect(() => {
    if (selectedUser) {
      setValue(
        "name",
        selectedUser.fullName ||
          selectedUser.firstname + " " + selectedUser.lastname,
      );
      setValue("phone", selectedUser.mobile || "");
      setValue("address", selectedUser.address || "");
      setValue("email", selectedUser.email || "");
    }
  }, [selectedUser, setValue]);

  // Reset trạng thái thành công để chuyển trang
  useEffect(() => {
    if (isSuccess) {
      toast.success("Tạo đơn hàng thành công!");
      navigate("/admin/orders");
    }
  }, [isSuccess, navigate]);

  // Format tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  // Lọc sản phẩm theo từ khóa (có giới hạn 10)
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return products
      .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 10);
  }, [products, searchTerm]);

  // Thêm sản phẩm vào đơn hàng
  const handleAddProduct = () => {
    if (!selectedProduct || !selectedVariant) {
      return toast.warning("Vui lòng chọn sản phẩm và phân loại!");
    }

    const variantData = selectedProduct.variants.find(
      (v) => v._id === selectedVariant,
    );
    if (!variantData) return toast.error("Không tìm thấy biến thể");

    const newCount = Number(quantity);
    if (newCount > variantData.quantity) {
      return toast.error(`Tồn kho chỉ còn ${variantData.quantity} sản phẩm!`);
    }

    const existingIndex = orderItems.findIndex(
      (item) =>
        item.product === selectedProduct._id &&
        item.color === variantData.color &&
        item.storage === variantData.storage,
    );

    if (existingIndex >= 0) {
      const updatedItems = [...orderItems];
      const totalCount = updatedItems[existingIndex].count + newCount;
      if (totalCount > variantData.quantity) {
        return toast.error("Tổng số lượng vượt quá tồn kho!");
      }
      updatedItems[existingIndex].count = totalCount;
      setOrderItems(updatedItems);
    } else {
      setOrderItems([
        ...orderItems,
        {
          product: selectedProduct._id,
          title: selectedProduct.title,
          image:
            variantData.images?.[0]?.url || selectedProduct.images?.[0]?.url,
          color: variantData.color,
          storage: variantData.storage,
          price: variantData.price,
          count: newCount,
          maxQuantity: variantData.quantity,
        },
      ]);
    }

    // Reset form chọn
    setSelectedProduct(null);
    setSelectedVariant("");
    setSearchTerm("");
    setQuantity(1);
  };

  // Cập nhật số lượng sản phẩm trong giỏ tạm
  const updateItemCount = (index, newCount) => {
    const item = orderItems[index];
    if (newCount < 1) {
      removeItem(index);
      return;
    }
    if (newCount > item.maxQuantity) {
      toast.error(`Số lượng tối đa là ${item.maxQuantity}`);
      return;
    }
    const updated = [...orderItems];
    updated[index].count = newCount;
    setOrderItems(updated);
  };

  const removeItem = (index) => {
    const updated = [...orderItems];
    updated.splice(index, 1);
    setOrderItems(updated);
  };

  // Tính tổng tiền
  const itemsTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );
  const finalTotal = itemsTotal + Number(shippingFee) - Number(discountAmount);

  // Submit form
  const onSubmit = async (data) => {
    console.log("Form data:", data);

    if (orderItems.length === 0) {
      return toast.error("Vui lòng thêm ít nhất 1 sản phẩm!");
    }

    const payload = {
      customerInfo: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        email: data.email || "",
      },
      orderItems: orderItems.map((item) => ({
        product: item.product,
        color: item.color,
        storage: item.storage,
        count: item.count,
        // Không gửi price, backend sẽ tự lấy
      })),
      shippingFee: Number(shippingFee),
      discountAmount: Number(discountAmount),
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      orderStatus: data.orderStatus,
    };

    await dispatch(adminCreateOrderThunk(payload));
  };

  if (productsLoading || usersLoading) return <Loading />;

  // const userOptions = allUsers?.map((u) => ({
  //   value: u._id,
  //   label: `${u.fullName || u.firstname + " " + u.lastname} `,
  //   userData: u,
  // }));

  const userOptions = allUsers?.map((u) => {
  const name = u.fullName || (u.firstname + " " + u.lastname);
  const phone = u.mobile || u.phone || "Chưa có SĐT";
  return {
    value: u._id,
    // Hiển thị dạng: "Nguyễn Văn A - 0987654321" giúp dễ nhìn hơn
    label: `${name} — ${phone}`, 
    userData: u,
  };
});

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-lg border shadow-sm hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Tạo đơn hàng mới</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG & CẤU HÌNH */}
        <div className="lg:col-span-1 space-y-6">
          <form
            id="createOrderForm"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Box chọn khách hàng có sẵn */}
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <h2 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                <User size={18} /> Khách hàng
              </h2>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1 text-sm">
                  Chọn khách hàng (tùy chọn)
                </label>
                {/* <Select
                  options={userOptions}
                  onChange={(opt) => setSelectedUser(opt?.userData || null)}
                  isClearable
                  placeholder="-- Tìm kiếm khách hàng --"
                  className="text-sm"
                /> */}
                <Select
                  options={userOptions}
                  onChange={(opt) => setSelectedUser(opt?.userData || null)}
                  isClearable
                  placeholder="-- Tìm kiếm tên hoặc số điện thoại --"
                  className="text-sm"
                  // Logic tìm kiếm tùy chỉnh: Khớp theo Tên HOẶC Số điện thoại công khai
                  filterOption={(option, rawInput) => {
                    const input = rawInput.toLowerCase();
                    const userData = option.data.userData;

                    const name = (
                      userData.fullName
                    ).toLowerCase();
                    const phone = (
                      userData.phone ||
                      ""
                    ).toLowerCase();

                    return name.includes(input) || phone.includes(input);
                  }}
                />
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-gray-600 mb-1">Họ tên *</label>
                  <input
                    {...register("name", { required: "Vui lòng nhập họ tên" })}
                    className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    {...register("phone", { required: "Vui lòng nhập SĐT" })}
                    className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-xs">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Địa chỉ *</label>
                  <textarea
                    {...register("address", {
                      required: "Vui lòng nhập địa chỉ",
                    })}
                    rows={2}
                    className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  {errors.address && (
                    <span className="text-red-500 text-xs">
                      {errors.address.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">
                    Email (tùy chọn)
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
            </div>

            {/* Box thiết lập đơn hàng */}
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <h2 className="font-bold text-gray-900 mb-4 border-b pb-2">
                Thiết lập đơn
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-gray-600 mb-1">
                    Trạng thái đơn hàng
                  </label>
                  <select
                    {...register("orderStatus")}
                    className="w-full border rounded p-2"
                  >
                    <option value="Confirmed">Đã xác nhận (Confirmed)</option>
                    <option value="Processing">Đang xử lý (Processing)</option>
                    <option value="Dispatched">Đang giao (Dispatched)</option>
                    <option value="Delivered">Đã giao (Delivered)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">
                    Phương thức thanh toán
                  </label>
                  <select
                    {...register("paymentMethod")}
                    className="w-full border rounded p-2"
                  >
                    <option value="cod">COD - Thanh toán khi nhận</option>
                    <option value="bank_transfer">Chuyển khoản / Thẻ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">
                    Trạng thái thanh toán
                  </label>
                  <select
                    {...register("paymentStatus")}
                    className="w-full border rounded p-2"
                  >
                    <option value="not_paid">Chưa thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* CỘT PHẢI: THÊM SẢN PHẨM & GIỎ TẠM */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bộ tìm kiếm sản phẩm */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h2 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
              <Package size={18} className="text-blue-500" /> Thêm sản phẩm
            </h2>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="flex items-center border rounded p-2 bg-gray-50">
                  <Search size={18} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Nhập tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedProduct(null);
                    }}
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
                {searchTerm &&
                  !selectedProduct &&
                  filteredProducts.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                      {filteredProducts.map((p) => (
                        <div
                          key={p._id}
                          onClick={() => {
                            setSelectedProduct(p);
                            setSearchTerm(p.title);
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-blue-50 cursor-pointer border-b"
                        >
                          <img
                            src={p.images?.[0]?.url}
                            className="w-10 h-10 object-contain border rounded bg-white"
                            alt=""
                          />
                          <div className="text-sm font-medium text-gray-800 line-clamp-1">
                            {p.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {selectedProduct && (
                <div className="w-full md:w-48">
                  <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    className="w-full border rounded p-2 text-sm outline-none"
                  >
                    <option value="">-- Chọn phân loại --</option>
                    {selectedProduct.variants?.map((v) => (
                      <option
                        key={v._id}
                        value={v._id}
                        disabled={v.quantity <= 0}
                      >
                        {v.color} - {v.storage}{" "}
                        {v.quantity <= 0 ? "(Hết hàng)" : `(Còn ${v.quantity})`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 border rounded p-2 text-center text-sm outline-none"
                />
                <button
                  onClick={handleAddProduct}
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 flex items-center gap-1"
                >
                  <Plus size={16} /> Thêm
                </button>
              </div>
            </div>
          </div>

          {/* Bảng sản phẩm đã chọn (có thể sửa số lượng) */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                <tr>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3">Phân loại</th>
                  <th className="px-4 py-3 text-center">SL</th>
                  <th className="px-4 py-3 text-right">Đơn giá</th>
                  <th className="px-4 py-3 text-right">Thành tiền</th>
                  <th className="px-4 py-3 text-center w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orderItems.length > 0 ? (
                  orderItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img
                          src={item.image}
                          className="w-10 h-10 border rounded object-contain p-0.5"
                          alt=""
                        />
                        <span className="font-medium text-gray-800 line-clamp-1">
                          {item.title}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.color} - {item.storage}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateItemCount(idx, item.count - 1)}
                            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-bold">
                            {item.count}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateItemCount(idx, item.count + 1)}
                            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[#d70018]">
                        {formatPrice(item.price * item.count)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeItem(idx)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">
                      Chưa có sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tổng kết tài chính */}
          <div className="bg-gray-50 rounded-xl border p-5 ml-auto md:w-1/2">
            <h3 className="font-bold text-gray-800 mb-3 text-lg">Tổng kết</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-bold">{formatPrice(itemsTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Giảm giá (VNĐ):</span>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="border rounded p-1 w-28 text-right outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-between items-center">
                <span>Phí vận chuyển:</span>
                <input
                  type="number"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(Number(e.target.value))}
                  className="border rounded p-1 w-28 text-right outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-bold text-base">Tổng cộng:</span>
                <span className="text-2xl font-bold text-[#d70018]">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>
            <button
              form="createOrderForm"
              type="submit"
              disabled={orderLoading}
              className="w-full bg-[#d70018] text-white py-3 rounded-lg font-bold mt-5 hover:bg-[#b00117] disabled:opacity-70 transition"
            >
              {orderLoading ? "Đang xử lý..." : "Xác nhận tạo đơn"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateOrder;
