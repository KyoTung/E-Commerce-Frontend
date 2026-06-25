import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form"; // Thêm useFieldArray
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axiosClient from "../../../api/axiosClient";
import { getProduct, updateProduct } from "../../../features/adminSlice/products/productSlice";

const EditProduct = () => {
  const { product_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product } = useSelector((state) => state.productAdmin);

  const { register, control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      basePrice: "",
      brand: "",
      category: "",
      variants: []
    }
  });

  // Sử dụng useFieldArray để quản lý danh sách biến thể động chính xác hơn
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants"
  });

  // Khi có dữ liệu sản phẩm từ Redux, đổ vào Form
  useEffect(() => {
    if (product_id) {
      dispatch(getProduct(product_id));
    }
  }, [product_id, dispatch]);

  useEffect(() => {
    if (product && product._id === product_id) {
      reset({
        title: product.title,
        basePrice: product.basePrice,
        brand: product.brand,
        category: product.category,
        variants: product.variants || []
      });
    }
  }, [product, reset, product_id]);

  // Hàm xử lý xóa ảnh trực tiếp thông qua API backend đã sửa
  const handleRemoveImage = async (publicId) => {
    try {
      const response = await axiosClient.post(`/product/delete-image/${product_id}`, {
        publicIdToDelete: publicId
      });
      
      if (response.data.success) {
        toast.success("Xóa ảnh thành công!");
        // Tải lại dữ liệu sản phẩm mới nhất để cập nhật UI giao diện ảnh
        dispatch(getProduct(product_id));
      }
    } catch (error) {
      toast.error("Không thể xóa ảnh, vui lòng thử lại!");
      console.error(error);
    }
  };

  const onSubmit = (data) => {
    // Gửi toàn bộ data gồm các trường text và mảng variants đã chỉnh sửa lên Redux
    dispatch(updateProduct({ productId: product_id, productData: data }))
      .unwrap()
      .then(() => {
        toast.success("Cập nhật sản phẩm thành công!");
        navigate("/admin/products");
      })
      .catch((err) => toast.error(err.message || "Có lỗi xảy ra!"));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ... Các thành phần input Tên, Giá, Danh mục ... */}

      {/* Khu vực hiển thị và chỉnh sửa biến thể */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <h3 className="text-lg font-semibold mb-4">Biến thể sản phẩm</h3>
        
        {fields.map((item, index) => (
          <div key={item.id} className="grid grid-cols-5 gap-4 items-end border-b pb-4 mb-4">
            <div>
              <label className="text-sm font-medium">Màu sắc</label>
              <input
                type="text"
                {...register(`variants.${index}.color`)}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Bộ nhớ</label>
              <input
                type="text"
                {...register(`variants.${index}.storage`)}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Giá tiền</label>
              <input
                type="number"
                {...register(`variants.${index}.price`)}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Số lượng</label>
              <input
                type="number"
                {...register(`variants.${index}.quantity`)}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            >
              Xóa biến thể
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => append({ color: "", storage: "", price: 0, quantity: 0, images: [] })}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Thêm biến thể mới
        </button>
      </div>

      {/* Giao diện render danh sách ảnh và nút xóa ảnh */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {product?.images?.map((img) => (
          <div key={img.public_id} className="relative group border rounded p-2">
            <img src={img.url} alt="product" className="w-full h-32 object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(img.public_id)}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
        Cập nhật sản phẩm
      </button>
    </form>
  );
};

export default EditProduct;