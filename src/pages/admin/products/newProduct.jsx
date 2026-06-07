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
  const [variants, setVariants] = useState([
    { color: "", storage: "", price: "", quantity: "", images: [] },
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
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

  // Xử lý upload ảnh cho từng phân loại
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

  // Xoá ảnh của phân loại
  const removeVariantImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].images = updatedVariants[
      variantIndex
    ].images.filter((_, i) => i !== imageIndex);
    setVariants(updatedVariants);
  };

  // Submit form
  const handleAddProduct = async (formData) => {
    if (isSubmitting) return;

    // Kiểm tra các phân loại đã đầy đủ chưa
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
            {/* Thông tin chung */}
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
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Giá cơ bản *
                  </label>
                  <input
                    type="number"
                    {...register("basePrice", {
                      required: "Giá cơ bản là bắt buộc",
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                  {errors.basePrice && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.basePrice.message}
                    </p>
                  )}
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

            {/* Liên kết thương hiệu, danh mục */}
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
                    {/* Màu sắc */}
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
                    {/* Dung lượng */}
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
                    {/* Giá phân loại */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600">
                        Giá *
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
                    {/* Số lượng tồn kho */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600">
                        Số lượng *
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

                  {/* Ảnh cho phân loại (có xoá) */}
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

          {/* Cột phải: Thông số kỹ thuật & Mô tả */}
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