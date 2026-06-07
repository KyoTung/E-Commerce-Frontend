import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { IoArrowBackCircleOutline } from "react-icons/io5";

import axiosClient from "../../../api/axiosClient";
import { getAllBrand } from "../../../features/adminSlice/brand/brandSlice";
import { getAllCategory } from "../../../features/adminSlice/category/categorySlice";
import {
  getProduct,
  updateProduct,
} from "../../../features/adminSlice/products/productSlice";
import { getAllColor } from "../../../features/adminSlice/color/colorSlice";

const EditProduct = ({ placeholder }) => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product_id } = useParams();

  // Redux Selectors
  const { brands } = useSelector((state) => state.brandAdmin);
  const { categories } = useSelector((state) => state.categoryAdmin);
  const { colors } = useSelector((state) => state.colorAdmin);
  const { product } = useSelector((state) => state.productAdmin);

  // Local State
  const [gallery, setGallery] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const description = watch("description");

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Bắt đầu viết mô tả...",
      height: 400,
    }),
    [placeholder]
  );

  // 1. Lấy dữ liệu
  useEffect(() => {
    dispatch(getAllBrand());
    dispatch(getAllCategory());
    dispatch(getAllColor());
    if (product_id) {
      dispatch(getProduct(product_id));
    }
  }, [product_id, dispatch]);

  // 2. Điền dữ liệu vào form
  useEffect(() => {
    if (product && (product._id === product_id || product.id === product_id)) {
      reset({
        title: product.title,
        slug: product.slug,
        basePrice: product.basePrice,
        description: product.description,
        brand: product.brand,
        category: product.category,
        tags: product.tags ? product.tags.join(", ") : "",
        // Thông số kỹ thuật
        screen: product.specifications?.screen,
        processor: product.specifications?.processor,
        storage: product.specifications?.storage,
        ram: product.specifications?.ram,
        battery: product.specifications?.battery,
        os: product.specifications?.os,
        frontCamera: product.specifications?.frontCamera,
        rearCamera: product.specifications?.rearCamera,
        sim: product.specifications?.sim,
        design: product.specifications?.design,
      });

      // Ảnh chính
      if (product.images) {
        setGallery(product.images);
      }

      // Phân loại
      if (product.variants && product.variants.length > 0) {
        setVariants(product.variants);
      } else {
        setVariants([
          { color: "", storage: "", price: "", quantity: "", images: [] },
        ]);
      }
    }
  }, [product, product_id, reset]);

  const handleEditorChange = (newContent) => {
    setValue("description", newContent);
  };

  // Helper upload ảnh
  const uploadImagesHelper = async (files) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const imageForm = new FormData();
      imageForm.append("images", file);
      const response = await axiosClient.put(
        "/product/upload-images",
        imageForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const image = response.data[0];
      return {
        url: image.url,
        asset_id: image.asset_id,
        public_id: image.public_id,
      };
    });
    return await Promise.all(uploadPromises);
  };

  // Xử lý ảnh chính
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const results = await uploadImagesHelper(files);
      setGallery((prev) => [...prev, ...results]);
      e.target.value = null;
    } catch (err) {
      toast.error("Tải ảnh thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (image) => {
    try {
      if (image.public_id) {
        await axiosClient.delete(
          `/product/delete-images/${product_id}/${image.public_id}`
        );
      }
      setGallery((prev) =>
        prev.filter((img) => img.public_id !== image.public_id)
      );
      toast.success("Đã xoá ảnh");
    } catch (error) {
      toast.error("Xoá ảnh thất bại");
    }
  };

  // Xử lý phân loại (variants)
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    const lastVariant = variants[variants.length - 1];
    if (
      !lastVariant.color ||
      !lastVariant.storage ||
      !lastVariant.price ||
      !lastVariant.quantity
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin cho phân loại hiện tại");
      return;
    }
    setVariants([
      ...variants,
      {
        color: "",
        storage: "",
        price: lastVariant.price,
        quantity: lastVariant.quantity,
        images: [],
      },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      const updatedVariants = variants.filter((_, i) => i !== index);
      setVariants(updatedVariants);
    } else {
      toast.error("Cần ít nhất một phân loại");
    }
  };

  const handleVariantImageChange = async (e, variantIndex) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedImages = await uploadImagesHelper(files);
      const updatedVariants = [...variants];
      updatedVariants[variantIndex].images = [
        ...updatedVariants[variantIndex].images,
        ...uploadedImages,
      ];
      setVariants(updatedVariants);
      e.target.value = null;
    } catch (err) {
      toast.error("Tải ảnh phân loại thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].images = updatedVariants[
      variantIndex
    ].images.filter((_, i) => i !== imageIndex);
    setVariants(updatedVariants);
  };

  // Submit cập nhật sản phẩm
  const handleUpdateProduct = async (formData) => {
    if (isSubmitting) return;

    const invalidVariants = variants.filter(
      (v) => !v.color || !v.storage || !v.price || !v.quantity
    );
    if (invalidVariants.length > 0) {
      toast.error("Vui lòng điền đầy đủ thông tin cho tất cả các phân loại");
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        title: formData.title,
        slug:
          formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        basePrice: Number(formData.basePrice),
        description: formData.description,
        brand: formData.brand,
        category: formData.category,
        images: gallery,
        variants: variants.map((variant) => ({
          ...variant,
          price: Number(variant.price),
          quantity: Number(variant.quantity),
        })),
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        specifications: {
          screen: formData.screen,
          processor: formData.processor,
          storage: formData.storage,
          ram: formData.ram,
          battery: formData.battery,
          os: formData.os,
          frontCamera: formData.frontCamera,
          rearCamera: formData.rearCamera,
          sim: formData.sim,
          design: formData.design,
        },
      };

      const resultAction = await dispatch(
        updateProduct({
          productId: product_id,
          productData: productData,
        })
      );

      if (updateProduct.fulfilled.match(resultAction)) {
        toast.success("Cập nhật sản phẩm thành công");
        setTimeout(() => navigate("/admin/products"), 1000);
      } else {
        const errorMessage =
          resultAction.payload?.message || "Cập nhật sản phẩm thất bại";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi không xác định");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate("/admin/products")}
          className="text-gray-600 hover:text-blue-600 transition"
        >
          <IoArrowBackCircleOutline size={32} />
        </button>
        <h1 className="title mb-0">Chỉnh sửa sản phẩm</h1>
      </div>

      <form
        onSubmit={handleSubmit(handleUpdateProduct)}
        className="mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-md"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Cột trái */}
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">Thông tin chung</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    {...register("title", { required: "Bắt buộc" })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <input
                    {...register("slug")}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giá cơ bản *
                  </label>
                  <input
                    type="number"
                    {...register("basePrice", { required: "Bắt buộc" })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>

                {/* Ảnh sản phẩm chính */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Ảnh sản phẩm
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="mt-1 block w-full text-sm text-gray-500"
                    />
                    {isUploading && (
                      <span className="text-sm text-blue-500">Đang tải...</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {gallery.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          className="w-20 h-20 rounded object-cover border"
                          alt={`Sản phẩm ${index}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thẻ tags
                  </label>
                  <input
                    {...register("tags")}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Liên kết */}
            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">Liên kết</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thương hiệu *
                  </label>
                  <select
                    {...register("brand", { required: "Bắt buộc" })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((b) => (
                      <option key={b._id || b.id} value={b.title}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Danh mục *
                  </label>
                  <select
                    {...register("category", { required: "Bắt buộc" })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((c) => (
                      <option key={c._id || c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Phiên bản */}
            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">Phiên bản</h2>
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="variant-item border-b pb-4 mb-4 border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium">
                      Phiên bản {index + 1}
                    </h3>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Xoá
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600">
                        Màu sắc
                      </label>
                      <select
                        value={variant.color}
                        onChange={(e) =>
                          handleVariantChange(index, "color", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                      >
                        <option value="">Chọn màu</option>
                        {colors.map((c, i) => (
                          <option key={i} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">
                        Dung lượng
                      </label>
                      <select
                        value={variant.storage}
                        onChange={(e) =>
                          handleVariantChange(index, "storage", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                      >
                        <option value="">Chọn dung lượng</option>
                        {["64GB", "128GB", "256GB", "512GB", "1TB"].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">
                        Giá
                      </label>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(index, "price", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">
                        Số lượng
                      </label>
                      <input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) =>
                          handleVariantChange(index, "quantity", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                      />
                    </div>
                  </div>

                  {/* Ảnh cho phân loại */}
                  <div className="mt-3">
                    <label className="block text-xs text-gray-600 mb-1">
                      Ảnh phân loại
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleVariantImageChange(e, index)}
                      disabled={isUploading}
                      className="text-xs text-gray-500"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {variant.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="relative">
                          <img
                            src={img.url || img}
                            className="w-10 h-10 rounded border object-cover"
                            alt=""
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(index, imgIdx)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addVariant}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                + Thêm phân loại
              </button>
            </div>
          </div>

          {/* Cột phải: Thông số kỹ thuật & Mô tả */}
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">Thông số kỹ thuật</h2>
              <div className="grid grid-cols-1 gap-4">
                {/* Danh sách các trường thông số, hiển thị bằng tiếng Việt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Màn hình
                  </label>
                  <input
                    {...register("screen")}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hệ điều hành
                  </label>
                  <input
                    {...register("os")}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Camera trước
                  </label>
                  <input
                    {...register("frontCamera")}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Camera sau
                  </label>
                  <input
                    {...register("rearCamera")}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CPU
                  </label>
                  <input
                    {...register("processor")}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    RAM
                  </label>
                  <input
                    {...register("ram")}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ROM
                  </label>
                  <input
                    {...register("storage")}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pin & Sạc
                  </label>
                  <input
                    {...register("battery")}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SIM
                  </label>
                  <input
                    {...register("sim")}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thiết kế
                  </label>
                  <input
                    {...register("design")}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pb-6">
              <h2 className="mb-4 text-xl font-semibold">Mô tả sản phẩm</h2>
              <JoditEditor
                ref={editor}
                value={description}
                config={config}
                tabIndex={1}
                onBlur={(newContent) => handleEditorChange(newContent)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="rounded-lg px-4 py-2 text-gray-700 border border-gray-300 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Huỷ bỏ
              </button>
              <button
                type="submit"
                className={`rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 font-medium ${
                  isSubmitting || isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;