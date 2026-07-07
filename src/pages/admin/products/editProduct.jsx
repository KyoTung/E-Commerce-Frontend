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

  const { brands } = useSelector((state) => state.brandAdmin);
  const { categories } = useSelector((state) => state.categoryAdmin);
  const { colors } = useSelector((state) => state.colorAdmin);
  const { product } = useSelector((state) => state.productAdmin);

  const [gallery, setGallery] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // ----- HÀM XỬ LÝ TIỀN TỆ AN TOÀN (KHÔNG SAI SỐ) -----
  const formatCurrencyHelper = (value) => {
    if (value === undefined || value === null || value === "") return "";
    const num = Math.round(Number(value));
    if (isNaN(num) || num === 0) return "";
    return new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const parseCurrencyToNumber = (value) => {
    if (!value) return 0;
    const cleaned = String(value).replace(/\D/g, "");
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
  };

  // ----- STATE CHO GIÁ CƠ BẢN -----
  const [basePriceDisplay, setBasePriceDisplay] = useState("");
  const [basePriceRaw, setBasePriceRaw] = useState("");
  const [isBasePriceFocused, setIsBasePriceFocused] = useState(false);

  // ----- STATE CHO GIÁ VARIANT -----
  const [variantPriceRaw, setVariantPriceRaw] = useState([]);
  const [variantPriceDisplay, setVariantPriceDisplay] = useState([]);
  const [variantPriceFocusIndex, setVariantPriceFocusIndex] = useState(null);

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

  // ========== XỬ LÝ GIÁ CƠ BẢN ==========
  const handleBasePriceFocus = () => {
    setIsBasePriceFocused(true);
    const raw = basePriceRaw || String(parseCurrencyToNumber(basePriceDisplay));
    setBasePriceDisplay(raw);
  };

  const handleBasePriceBlur = () => {
    setIsBasePriceFocused(false);
    const numericValue = parseCurrencyToNumber(basePriceDisplay);
    const formatted = formatCurrencyHelper(numericValue);
    setBasePriceDisplay(formatted);
    setBasePriceRaw(String(numericValue));
    setValue("basePrice", numericValue, { shouldValidate: true });
  };

  const handleBasePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setBasePriceDisplay(rawValue);
    setBasePriceRaw(rawValue);
    const numericValue = parseCurrencyToNumber(rawValue);
    setValue("basePrice", numericValue, { shouldValidate: true });
  };

  // ========== XỬ LÝ GIÁ VARIANT ==========
  const handleVariantPriceFocus = (index) => {
    setVariantPriceFocusIndex(index);
    const raw = variantPriceRaw[index] || String(parseCurrencyToNumber(variantPriceDisplay[index] || ""));
    const updatedDisplay = [...variantPriceDisplay];
    updatedDisplay[index] = raw;
    setVariantPriceDisplay(updatedDisplay);
  };

  const handleVariantPriceBlur = (index) => {
    setVariantPriceFocusIndex(null);
    const rawValue = variantPriceDisplay[index] || variantPriceRaw[index] || "";
    const numericValue = parseCurrencyToNumber(rawValue);
    const formatted = formatCurrencyHelper(numericValue);

    const updatedDisplay = [...variantPriceDisplay];
    updatedDisplay[index] = formatted;
    setVariantPriceDisplay(updatedDisplay);

    const updatedRaw = [...variantPriceRaw];
    updatedRaw[index] = String(numericValue);
    setVariantPriceRaw(updatedRaw);

    // Cập nhật vào variants (không mutate)
    const updatedVariants = variants.map((v, i) => {
      if (i === index) {
        return {
          ...v,
          price: numericValue,
        };
      }
      return v;
    });
    setVariants(updatedVariants);
  };

  const handleVariantPriceChange = (index, e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const updatedRaw = [...variantPriceRaw];
    updatedRaw[index] = rawValue;
    setVariantPriceRaw(updatedRaw);

    const updatedDisplay = [...variantPriceDisplay];
    updatedDisplay[index] = rawValue;
    setVariantPriceDisplay(updatedDisplay);
  };

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    dispatch(getAllBrand());
    dispatch(getAllCategory());
    dispatch(getAllColor());
    if (product_id) {
      dispatch(getProduct(product_id));
    }
  }, [product_id, dispatch]);

  // Điền dữ liệu vào form
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

      const baseFormatted = formatCurrencyHelper(product.basePrice);
      setBasePriceDisplay(baseFormatted);
      setBasePriceRaw(String(product.basePrice || ""));

      if (product.images) {
        setGallery(product.images);
      }

      if (product.variants && product.variants.length > 0) {
        const cleanedVariants = product.variants.map((v) => ({
          ...v,
          images: v.images || [],
          price: v.price || 0,
          quantity: v.quantity ?? 0, // Nếu không có quantity thì set 0
        }));
        setVariants(cleanedVariants);
        const rawPrices = cleanedVariants.map((v) => String(v.price));
        const formattedPrices = cleanedVariants.map((v) => formatCurrencyHelper(v.price));
        setVariantPriceRaw(rawPrices);
        setVariantPriceDisplay(formattedPrices);
      } else {
        setVariants([{ color: "", storage: "", price: "", quantity: 0, images: [] }]);
        setVariantPriceRaw([""]);
        setVariantPriceDisplay([""]);
      }
    }
  }, [product, product_id, reset]);

  const handleEditorChange = (newContent) => {
    setValue("description", newContent);
  };

  const uploadImagesHelper = async (files) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const imageForm = new FormData();
      imageForm.append("images", file);
      const response = await axiosClient.put("/product/upload-images", imageForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const image = response.data[0];
      return {
        url: image.url,
        asset_id: image.asset_id,
        public_id: image.public_id,
      };
    });
    return await Promise.all(uploadPromises);
  };

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
        await axiosClient.delete(`/product/delete-images/${product_id}/${image.public_id}`);
      }
      setGallery((prev) => prev.filter((img) => img.public_id !== image.public_id));
      toast.success("Đã xoá ảnh");
    } catch (error) {
      toast.error("Xoá ảnh thất bại");
    }
  };

  const handleVariantChange = (index, field, value) => {
    if (field === "quantity") {
      value = String(value).replace(/\D/g, "");
    }
    const updatedVariants = variants.map((v, i) => {
      if (i === index) {
        return {
          ...v,
          [field]: value,
        };
      }
      return v;
    });
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    const lastVariant = variants[variants.length - 1];
    if (!lastVariant.color || !lastVariant.storage || !lastVariant.price) {
      toast.warning("Vui lòng nhập đầy đủ thông tin cho phân loại hiện tại (màu, dung lượng, giá)");
      return;
    }
    setVariants([
      ...variants,
      {
        color: "",
        storage: "",
        price: lastVariant.price,
        quantity: 0, // Mặc định 0
        images: [],
      },
    ]);
    setVariantPriceRaw([...variantPriceRaw, ""]);
    setVariantPriceDisplay([...variantPriceDisplay, ""]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
      setVariantPriceRaw(variantPriceRaw.filter((_, i) => i !== index));
      setVariantPriceDisplay(variantPriceDisplay.filter((_, i) => i !== index));
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
      const updatedVariants = variants.map((v, i) => {
        if (i === variantIndex) {
          return {
            ...v,
            images: [...v.images, ...uploadedImages],
          };
        }
        return v;
      });
      setVariants(updatedVariants);
      e.target.value = null;
    } catch (err) {
      toast.error("Tải ảnh phân loại thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    const updatedVariants = variants.map((v, i) => {
      if (i === variantIndex) {
        return {
          ...v,
          images: v.images.filter((_, idx) => idx !== imageIndex),
        };
      }
      return v;
    });
    setVariants(updatedVariants);
  };

  // Submit cập nhật
  const handleUpdateProduct = async (formData) => {
    if (isSubmitting) return;

    // Chỉ kiểm tra color, storage, price (không bắt buộc quantity)
    const invalidVariants = variants.filter(
      (v) => !v.color || !v.storage || !v.price
    );
    if (invalidVariants.length > 0) {
      toast.error("Vui lòng điền đầy đủ thông tin cho tất cả các phân loại (màu, dung lượng, giá)");
      return;
    }

    setIsSubmitting(true);

    try {
      // Chuẩn hóa dữ liệu variants: đảm bảo giá trị số, images là mảng
      const cleanedVariants = variants.map((variant) => ({
        ...variant,
        price: parseCurrencyToNumber(variant.price),
        quantity: parseInt(variant.quantity, 10) || 0,
        images: variant.images || [],
      }));

      const productData = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        basePrice: parseCurrencyToNumber(formData.basePrice),
        description: formData.description,
        brand: formData.brand,
        category: formData.category,
        images: gallery,
        variants: cleanedVariants,
        tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
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

      console.log("📦 Dữ liệu gửi lên:", productData);

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
        toast.error(resultAction.payload?.message || "Cập nhật sản phẩm thất bại");
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
        <button onClick={() => navigate("/admin/products")} className="text-gray-600 hover:text-blue-600 transition">
          <IoArrowBackCircleOutline size={32} />
        </button>
        <h1 className="title mb-0">Chỉnh sửa sản phẩm</h1>
      </div>

      <form onSubmit={handleSubmit(handleUpdateProduct)} className="mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Cột trái */}
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">Thông tin chung</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên sản phẩm *</label>
                  <input
                    type="text"
                    {...register("title", { required: "Bắt buộc" })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <input {...register("slug")} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">Giá cơ bản (VND) *</label>
                    {basePriceDisplay && !isBasePriceFocused && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {basePriceDisplay} ₫
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={basePriceDisplay}
                    onChange={handleBasePriceChange}
                    onFocus={handleBasePriceFocus}
                    onBlur={handleBasePriceBlur}
                    placeholder="Nhập số tiền..."
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input type="hidden" {...register("basePrice", { required: "Bắt buộc" })} />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Ảnh sản phẩm</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="mt-1 block w-full text-sm text-gray-500"
                    />
                    {isUploading && <span className="text-sm text-blue-500">Đang tải...</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {gallery.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image.url} className="w-20 h-20 rounded object-cover border" alt={`Sản phẩm ${index}`} />
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
                  <label className="block text-sm font-medium text-gray-700">Thẻ tags</label>
                  <input {...register("tags")} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" />
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">Liên kết</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thương hiệu *</label>
                  <select {...register("brand", { required: "Bắt buộc" })} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm">
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((b) => (
                      <option key={b._id || b.id} value={b.title}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Danh mục *</label>
                  <select {...register("category", { required: "Bắt buộc" })} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm">
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
                <div key={index} className="variant-item border-b pb-4 mb-4 border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium">Phiên bản {index + 1}</h3>
                    {variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(index)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Xoá
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Màu sắc</label>
                      <select
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, "color", e.target.value)}
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
                      <label className="block text-xs font-medium text-gray-600">Dung lượng</label>
                      <select
                        value={variant.storage}
                        onChange={(e) => handleVariantChange(index, "storage", e.target.value)}
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
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-medium text-gray-600">Giá *</label>
                        {variantPriceDisplay[index] && variantPriceFocusIndex !== index && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                            {variantPriceDisplay[index]} ₫
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={variantPriceFocusIndex === index ? variantPriceDisplay[index] : variantPriceDisplay[index]}
                        onChange={(e) => handleVariantPriceChange(index, e)}
                        onFocus={() => handleVariantPriceFocus(index)}
                        onBlur={() => handleVariantPriceBlur(index)}
                        placeholder="Nhập số tiền..."
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Số lượng tồn kho</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={variant.quantity}
                        onChange={(e) => handleVariantChange(index, "quantity", e.target.value)}
                        placeholder="Mặc định 0, cập nhật qua nhập kho"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                      />
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Sẽ được cập nhật khi nhập kho
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Ảnh phân loại</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleVariantImageChange(e, index)}
                      disabled={isUploading}
                      className="text-xs text-gray-500"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {variant.images?.map((img, imgIdx) => (
                        <div key={imgIdx} className="relative">
                          <img src={img.url || img} className="w-10 h-10 rounded border object-cover" alt="" />
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
              <button type="button" onClick={addVariant} className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                + Thêm phân loại
              </button>
            </div>
          </div>

          {/* Cột phải */}
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">Thông số kỹ thuật</h2>
              <div className="grid grid-cols-1 gap-4">
                {["screen", "os", "frontCamera", "rearCamera", "processor", "ram", "storage", "battery", "sim", "design"].map(
                  (field) => {
                    const labels = {
                      screen: "Màn hình",
                      os: "Hệ điều hành",
                      frontCamera: "Camera trước",
                      rearCamera: "Camera sau",
                      processor: "Bộ vi xử lý",
                      ram: "RAM",
                      storage: "Bộ nhớ trong",
                      battery: "Pin & Sạc",
                      sim: "SIM",
                      design: "Thiết kế",
                    };
                    return (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700">{labels[field] || field}</label>
                        <input {...register(field)} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" />
                      </div>
                    );
                  }
                )}
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
                  isSubmitting || isUploading ? "opacity-50 cursor-not-allowed" : ""
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