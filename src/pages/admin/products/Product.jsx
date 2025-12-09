import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PencilLine, Trash, Plus, RefreshCw } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../../components/Loading";

import {
  getAllProducts,
  deleteProduct,
} from "../../../features/adminSlice/products/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { products, loading } = useSelector((state) => state.productAdmin);
  
  // Local state
  const [search, setSearch] = useState("");

  // 1. Fetch Data
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Helper format tiền tệ
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Client-side Search
  const filteredProducts = products.filter((product) => {
    const searchTerm = search.toLowerCase();
    const matchTitle = product.title?.toLowerCase().includes(searchTerm);
    const matchSku = product.sku?.toLowerCase().includes(searchTerm);
    return matchTitle || matchSku;
  });

  //Delete Handler
  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      const resultAction = await dispatch(deleteProduct(id));

      if (deleteProduct.fulfilled.match(resultAction)) {
        toast.success("Product deleted successfully");
       dispatch(getAllProducts());
      } else {
        const errorMsg = resultAction.payload?.message || "Failed to delete product";
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Products Management</h1>
      
      <div className="card">
        {/* --- TOOLBAR --- */}
        <div className="card-header flex flex-col md:flex-row items-center gap-4 py-4 px-6 border-b border-gray-100">
          <div className="flex gap-2 w-full md:w-auto">
            <Link
              to="/admin/new-product"
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition w-full md:w-auto"
            >
              <Plus size={18} />
              Add New
            </Link>
            <button
              onClick={() => dispatch(getAllProducts())}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          <div className="w-full md:ml-auto md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Name or SKU..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* --- TABLE CONTENT --- */}
        {loading ? (
          <div className="p-12">
            <Loading className="flex items-center justify-center" />
          </div>
        ) : (
          <div className="card-body p-0">
            <div className="relative w-full overflow-x-auto">
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500 italic">
                  No products found.
                </div>
              ) : (
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                    <tr>
                      <th className="px-6 py-3 w-16 text-center">#</th>
                      <th className="px-6 py-3">Product Info</th>
                      <th className="px-6 py-3">Base Price</th>
                      <th className="px-6 py-3 text-center">Stock</th>
                      <th className="px-6 py-3 w-40 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredProducts.map((product, index) => (
                      <tr key={product._id || product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-center text-gray-400">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-4">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                              {product.images?.[0]?.url ? (
                                <img
                                  src={product.images[0].url}
                                  alt={product.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                  No Img
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col justify-center">
                              <p className="font-medium text-gray-900 line-clamp-2 max-w-[200px]" title={product.title}>
                                {product.title}
                              </p>
                              {product.sku && (
                                <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {formatPrice(product.basePrice || product.price)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {/* Logic tính tổng tồn kho từ variants hoặc lấy quantity gốc */}
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                             (product.quantity > 0 || product.variants?.length > 0) 
                             ? "bg-green-100 text-green-700" 
                             : "bg-red-100 text-red-700"
                          }`}>
                            {product.variants?.length > 0
                              ? product.variants.reduce((total, v) => total + (v.quantity || 0), 0)
                              : product.quantity || 0
                            }
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => navigate(`/admin/edit-product/${product._id || product.id}`)}
                              className="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
                              title="Edit"
                            >
                              <PencilLine size={18} />
                            </button>
                            <button
                              onClick={() => onDelete(product._id || product.id)}
                              className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-800 transition"
                              title="Delete"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;