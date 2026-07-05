import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

import axiosClient from "../../../api/axiosClient";
import { getAllBrand } from "../../../features/adminSlice/brand/brandSlice";
import { getAllCategory } from "../../../features/adminSlice/category/categorySlice";
import { createProduct } from "../../../features/adminSlice/products/productSlice";
import { getAllColor } from "../../../features/adminSlice/color/colorSlice";

const NewProduct = ({ placeholder }) => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { brands } = useSelector((state) => state.brandAdmin);
  const { categories } = useSelector((state) => state.categoryAdmin);
  const { colors } = useSelector((state) => state.colorAdmin);

  const [gallery, setGallery] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Khởi tạo variants với quantity = 0
  const [variants, setVariants] = useState([
    { color: "", storage: "", price: "", quantity: 0, images: [] },
  ]);

  // State cho giá cơ bản
  const [basePriceDisplay, setBasePriceDisplay] = useState("");
  const [basePriceRaw, setBasePriceRaw] = useState("");
  const [isBasePriceFocused, setIsBasePriceFocused] = useState(false);

  // State cho giá variant
  const [variantPriceRaw, setVariantPriceRaw] = useState([]);
  const [variantPriceDisplay, setVariantPriceDisplay] = useState([]);
  const [variantPriceFocusIndex, setVariantPriceFocusIndex] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
      basePrice: "",
    },
  });

  const description = watch("description");

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Bắt đầu viết mô tả...",
      height: 400,
    }),
    [placeholder]
  );

  useEffect(() => {
    dispatch(getAllBrand());
    dispatch(getAllCategory());
    dispatch(getAllColor());
  }, [dispatch]);

  // ---------- HÀM XỬ LÝ TIỀN TỆ AN TOÀN ----------
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

  // ---------- XỬ LÝ GIÁ CƠ BẢN ----------
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

  // ---------- XỬ LÝ GIÁ VARIANT ----------
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

    // Cập nhật vào variants
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

  // ---------- CÁC HANDLER KHÁC ----------
  const handleEditorChange = (newContent) => {
    setValue("description", newContent);
  };

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

  const handleCanceledImage = (imageToRemove) => {
    const newGallery = gallery.filter(
      (img) => img.public_id !== imageToRemove.public_id
    );
    setGallery(newGallery);
  };

  const handleVariantChange = (index, field, value) => {
    if (field === "quantity") {
      value = String(value).replace(/\D/g, "");
    }
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    const lastVariant = variants[variants.length - 1];

    if (
      !lastVariant.color ||
      !lastVariant.storage ||
      !lastVariant.price
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

  // ---------- SUBMIT ----------
  const handleAddProduct = async (formData) => {
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
      const cleanedVariants = variants.map((variant) => ({
        ...variant,
        price: parseCurrencyToNumber(variant.price),
        quantity: parseInt(variant.quantity, 10) || 0,
        images: variant.images || [],
      }));

      const productData = {
        title: formData.title,
        slug:
          formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        basePrice: parseCurrencyToNumber(formData.basePrice),
        description: formData.description,
        brand: formData.brand,
        category: formData.category,
        images: gallery,
        variants: cleanedVariants,
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

      const resultAction = await dispatch(createProduct(productData));

      if (createProduct.fulfilled.match(resultAction)) {
        toast.success("Thêm sản phẩm thành công");
        setTimeout(() => navigate("/admin/products"), 1000);
      } else {
        const errorMessage =
          resultAction.payload?.message || "Thêm sản phẩm thất bại";
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
      <h1 className="title mb-6">Thêm sản phẩm mới</h1>
      <form
        onSubmit={handleSubmit(handleAddProduct)}
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
                    {...register("title", {
                      required: "Tên sản phẩm là bắt buộc",
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">
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
                    placeholder="Tự động tạo từ tên sản phẩm"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Giá cơ bản (VND) *
                    </label>
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
                  <input
                    type="hidden"
                    {...register("basePrice", { required: "Giá cơ bản là bắt buộc" })}
                  />
                  {errors.basePrice && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.basePrice.message}
                    </p>
                  )}
                </div>

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
                      className="mt-1 block w-full text-sm text-gray-500"
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <span className="text-sm text-blue-500">Đang tải...</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {gallery.map((image, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <img
                          src={image.url}
                          className="w-20 h-20 rounded object-cover border"
                          alt={`Sản phẩm ${imgIndex}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleCanceledImage(image)}
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
                    placeholder="Phân cách bằng dấu phẩy"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">Liên kết</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thương hiệu *
                  </label>
                  <select
                    {...register("brand", { required: "Thương hiệu là bắt buộc" })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand._id || brand.id} value={brand.title}>
                        {brand.title}
                      </option>
                    ))}
                  </select>
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.brand.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Danh mục *
                  </label>
                  <select
                    {...register("category", {
                      required: "Danh mục là bắt buộc",
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option
                        key={category._id || category.id}
                        value={category.title}
                      >
                        {category.title}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Phiên bản biến thể */}
            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">Phiên bản</h2>
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="variant-item border-b pb-4 mb-4 border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium text-gray-800">
                      Phiên bản {index + 1}
                    </h3>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Xoá
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">
                        Màu sắc *
                      </label>
                      <select
                        value={variant.color}
                        onChange={(e) =>
                          handleVariantChange(index, "color", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                      >
                        <option value="">Chọn màu</option>
                        {colors.map((color, i) => (
                          <option key={i} value={color.title}>
                            {color.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">
                        Dung lượng *
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
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-medium text-gray-600">
                          Giá *
                        </label>
                        {variantPriceDisplay[index] && variantPriceFocusIndex !== index && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                            {variantPriceDisplay[index]} ₫
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={variantPriceDisplay[index] || ""}
                        onChange={(e) => handleVariantPriceChange(index, e)}
                        onFocus={() => handleVariantPriceFocus(index)}
                        onBlur={() => handleVariantPriceBlur(index)}
                        placeholder="Nhập số tiền..."
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">
                        Số lượng tồn kho
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={variant.quantity}
                        onChange={(e) =>
                          handleVariantChange(index, "quantity", e.target.value)
                        }
                        placeholder="Mặc định 0, cập nhật qua nhập kho"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                      />
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Sẽ được cập nhật khi nhập kho
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Ảnh phân loại
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleVariantImageChange(e, index)}
                      className="block w-full text-xs text-gray-500"
                      disabled={isUploading}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {variant.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="relative">
                          <img
                            src={img.url}
                            className="w-12 h-12 rounded object-cover border"
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
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                + Thêm phân loại khác
              </button>
            </div>
          </div>

          {/* Cột phải */}
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">Thông số kỹ thuật</h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  "screen",
                  "os",
                  "frontCamera",
                  "rearCamera",
                  "processor",
                  "ram",
                  "storage",
                  "battery",
                  "sim",
                  "design",
                ].map((field) => {
                  let label = field;
                  switch (field) {
                    case "screen":
                      label = "Màn hình";
                      break;
                    case "os":
                      label = "Hệ điều hành";
                      break;
                    case "frontCamera":
                      label = "Camera trước";
                      break;
                    case "rearCamera":
                      label = "Camera sau";
                      break;
                    case "processor":
                      label = "CPU";
                      break;
                    case "ram":
                      label = "RAM";
                      break;
                    case "storage":
                      label = "ROM";
                      break;
                    case "battery":
                      label = "Pin & Sạc";
                      break;
                    case "sim":
                      label = "SIM";
                      break;
                    case "design":
                      label = "Thiết kế";
                      break;
                    default:
                      label = field;
                  }
                  return (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {label}
                      </label>
                      <input
                        {...register(field)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      />
                    </div>
                  );
                })}
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
                {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewProduct;