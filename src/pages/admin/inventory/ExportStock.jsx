import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Plus, Trash, ArrowLeft, Search, Package, Minus, Building2, AlertTriangle } from "lucide-react";
import Select from "react-select";

import { getAllProducts } from "../../../features/adminSlice/products/productSlice";
import { getSuppliers } from "../../../features/adminSlice/supplier/supplierSlice";
import { createExport } from "../../../features/adminSlice/inventory/inventorySlice";
import Loading from "../../../components/Loading";

const ExportStock = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, isLoading: productsLoading } = useSelector((state) => state.productAdmin);
  const { suppliers, loading: suppliersLoading } = useSelector((state) => state.supplier);
  const { loading: exportLoading, exportSuccess } = useSelector((state) => state.inventory);

  const [exportType, setExportType] = useState("return_to_supplier");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [note, setNote] = useState("");

  // State tìm kiếm sản phẩm
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getSuppliers({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (exportSuccess) {
      toast.success("Xuất kho thành công!");
      navigate("/admin/inventory/transactions");
    }
  }, [exportSuccess, navigate]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return products
      .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 10);
  }, [products, searchTerm]);

  const supplierOptions = suppliers?.map((s) => ({
    value: s._id,
    label: `${s.name} - ${s.phone}`,
    supplierData: s,
  }));

  const exportTypeOptions = [
    { value: "return_to_supplier", label: "Trả hàng nhà cung cấp" },
    { value: "internal_use", label: "Sử dụng nội bộ" },
    { value: "damage", label: "Hàng hỏng / mất" },
    { value: "adjustment", label: "Điều chỉnh giảm (kiểm kê)" },
  ];

  const handleAddProduct = () => {
    if (!selectedProduct || !selectedVariant) {
      return toast.warning("Vui lòng chọn sản phẩm và phân loại!");
    }

    const variantData = selectedProduct.variants.find((v) => v._id === selectedVariant);
    if (!variantData) return toast.error("Không tìm thấy biến thể");

    const newCount = Number(quantity);
    if (newCount <= 0) return toast.error("Số lượng phải lớn hơn 0");

    // Kiểm tra tồn kho đủ để xuất
    if (newCount > variantData.quantity) {
      return toast.error(`Tồn kho chỉ còn ${variantData.quantity} sản phẩm!`);
    }

    const existingIndex = orderItems.findIndex(
      (item) =>
        item.product === selectedProduct._id &&
        item.color === variantData.color &&
        item.storage === variantData.storage
    );

    if (existingIndex >= 0) {
      const updatedItems = [...orderItems];
      const totalCount = updatedItems[existingIndex].quantity + newCount;
      if (totalCount > variantData.quantity) {
        return toast.error("Tổng số lượng vượt quá tồn kho!");
      }
      updatedItems[existingIndex].quantity = totalCount;
      setOrderItems(updatedItems);
    } else {
      setOrderItems([
        ...orderItems,
        {
          product: selectedProduct._id,
          title: selectedProduct.title,
          image: variantData.images?.[0]?.url || selectedProduct.images?.[0]?.url,
          color: variantData.color,
          storage: variantData.storage,
          quantity: newCount,
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
    updated[index].quantity = newCount;
    setOrderItems(updated);
  };

  const removeItem = (index) => {
    const updated = [...orderItems];
    updated.splice(index, 1);
    setOrderItems(updated);
  };

  const itemsTotal = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (exportType === "return_to_supplier" && !selectedSupplier) {
      return toast.error("Vui lòng chọn nhà cung cấp để trả hàng");
    }
    if (orderItems.length === 0) {
      return toast.error("Vui lòng thêm ít nhất 1 sản phẩm");
    }

    const payload = {
      exportType,
      supplierId: exportType === "return_to_supplier" ? selectedSupplier?.value : undefined,
      items: orderItems.map((item) => ({
        productId: item.product,
        color: item.color,
        storage: item.storage,
        quantity: item.quantity,
      })),
      note,
    };

    await dispatch(createExport(payload));
  };

  if (productsLoading || suppliersLoading) return <Loading />;

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
        <h1 className="text-2xl font-bold text-gray-800">Xuất kho</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Loại xuất kho */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-orange-500" /> Loại xuất
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1 text-sm">Chọn loại xuất *</label>
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="w-full border rounded p-2 text-sm outline-none"
              >
                {exportTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {exportType === "return_to_supplier" && (
              <div>
                <label className="block text-gray-600 mb-1 text-sm">Nhà cung cấp *</label>
                <Select
                  options={supplierOptions}
                  onChange={setSelectedSupplier}
                  isClearable
                  placeholder="-- Chọn nhà cung cấp --"
                  className="text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Thêm sản phẩm xuất */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={18} className="text-red-500" /> Thêm sản phẩm xuất
          </h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px] relative">
              <div className="flex items-center border rounded p-2 bg-gray-50">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedProduct(null);
                  }}
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
              {searchTerm && !selectedProduct && filteredProducts.length > 0 && (
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
                      <div className="text-sm font-medium text-gray-800">{p.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedProduct && (
              <div className="w-48">
                <select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="w-full border rounded p-2 text-sm outline-none"
                >
                  <option value="">-- Phân loại --</option>
                  {selectedProduct.variants?.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.color} - {v.storage} (Tồn: {v.quantity})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="w-24">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border rounded p-2 text-center text-sm outline-none"
                placeholder="SL"
              />
            </div>
            <button
              type="button"
              onClick={handleAddProduct}
              className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 flex items-center gap-1"
            >
              <Plus size={16} /> Thêm
            </button>
          </div>
        </div>

        {/* Bảng sản phẩm đã chọn */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Phân loại</th>
                <th className="px-4 py-3 text-center">SL</th>
                <th className="px-4 py-3 text-center w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orderItems.length > 0 ? (
                orderItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={item.image} className="w-10 h-10 border rounded object-contain" alt="" />
                      <span className="font-medium">{item.title}</span>
                    </td>
                    <td className="px-4 py-3">{item.color} - {item.storage}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateItemCount(idx, item.quantity - 1)}
                          className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateItemCount(idx, item.quantity + 1)}
                          className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-400">Chưa có sản phẩm nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Ghi chú và tổng kết */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white rounded-xl shadow-sm border p-5">
            <label className="block text-gray-700 font-medium mb-2">Ghi chú (lý do xuất)</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded p-2 outline-none focus:border-blue-500"
              placeholder="Nhập lý do xuất kho..."
            />
          </div>
          <div className="md:w-80 bg-gray-50 rounded-xl border p-5">
            <h3 className="font-bold text-gray-800 mb-3 text-lg">Tổng kết</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Tổng số lượng xuất:</span>
                <span className="font-bold">{itemsTotal}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={exportLoading}
              className="w-full bg-[#d70018] text-white py-3 rounded-lg font-bold mt-5 hover:bg-[#b00117] disabled:opacity-70 transition"
            >
              {exportLoading ? "Đang xử lý..." : "Xác nhận xuất kho"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExportStock;