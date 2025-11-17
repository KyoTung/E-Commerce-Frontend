import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import axiosClient from "../../../Axios";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
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

  const currentUser = useSelector((state) => state.auth.user);
  const { brands } = useSelector((state) => state.brandAdmin);
  const { categories } = useSelector((state) => state.categoryAdmin);
  const { product, isLoading } = useSelector((state) => state.productAdmin);
  const { colors } = useSelector((state) => state.colorAdmin);

  const [gallery, setGallery] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variants, setVariants] = useState([]);

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
      placeholder: placeholder || "Start typings...",
    }),
    [placeholder]
  );

  useEffect(() => {
    getCategories();
    getBrands();
    getColors();
    if (product_id) {
      dispatch(getProduct({ productId: product_id, token: currentUser.token }));
    }
  }, [product_id, dispatch, currentUser.token]);

  useEffect(() => {
    if (product) {
      // Điền dữ liệu sản phẩm vào form
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

      // Điền variants
      if (product.variants && product.variants.length > 0) {
        setVariants(product.variants);
      } else {
        // Nếu không có variants, tạo một variant mặc định
        setVariants([{ color: "", storage: "", price: "", quantity: "", images: [] }]);
      }

      // Điền ảnh sản phẩm (nếu có)
      if (product.images) {
        setGallery(product.images);
      }
    }
  }, [product, reset]);

  const getBrands = async () => {
    dispatch(getAllBrand({ token: currentUser.token }));
  };

  const getCategories = async () => {
    dispatch(getAllCategory({ token: currentUser.token }));
  };

  const getColors = () => {
    dispatch(getAllColor({ token: currentUser.token }));
  };

  const handleEditorChange = (newContent) => {
    setValue("description", newContent);
  };

  const handleUpdateProduct = async (formData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Validate variants
      const invalidVariants = variants.filter(variant => 
        !variant.color || !variant.storage || !variant.price || !variant.quantity
      );

      if (invalidVariants.length > 0) {
        toast.error("Please complete all variant information before submitting");
        setIsSubmitting(false);
        return;
      }

      // Chuẩn bị dữ liệu theo model Product
      const productData = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        basePrice: Number(formData.basePrice),
        description: formData.description,
        brand: formData.brand,
        category: formData.category,
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
        // Thêm gallery images vào product data
        images: gallery.map((img) => ({
          url: img.url,
          public_id: img.public_id,
          asset_id: img.asset_id,
        })),
      };

      const resultAction = await dispatch(
        updateProduct({
          productId: product_id,
          productData: productData,
          token: currentUser.token,
        })
      );

      if (updateProduct.fulfilled.match(resultAction)) {
        toast.success("Product updated successfully");
        navigate("/admin/products");
      } else {
        const errorMessage =
          resultAction.payload?.message ||
          resultAction.error?.message ||
          "Failed to update product";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Update product error:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý variants
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    const lastVariant = variants[variants.length - 1];
    
    // Kiểm tra variant hiện tại đã đầy đủ chưa
    if (!lastVariant.color || !lastVariant.storage || !lastVariant.price || !lastVariant.quantity) {
      toast.error("Please complete the current variant before adding a new one");
      return;
    }
    
    setVariants([
      ...variants,
      { 
        color: "", 
        storage: "", 
        price: lastVariant.price,
        quantity: lastVariant.quantity,
        images: [] 
      },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      const updatedVariants = variants.filter((_, i) => i !== index);
      setVariants(updatedVariants);
    } else {
      toast.error("At least one variant is required");
    }
  };

  const handleVariantImageChange = async (e, variantIndex) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const imageForm = new FormData();
        imageForm.append("images", file);
        const response = await axiosClient.put(
          "/product/upload-images",
          imageForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );
        return response.data[0]; // lấy phần tử đầu tiên
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const updatedVariants = [...variants];
      updatedVariants[variantIndex].images = [
        ...updatedVariants[variantIndex].images,
        ...uploadedImages, // SỬA: trả về toàn bộ object ảnh, không chỉ URL
      ];
      setVariants(updatedVariants);

      e.target.value = null;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload images");
    }
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].images = updatedVariants[
      variantIndex
    ].images.filter((_, i) => i !== imageIndex);
    setVariants(updatedVariants);
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const imageForm = new FormData();
        imageForm.append("images", file);
        const response = await axiosClient.put(
          "/product/upload-images",
          imageForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );
        return response.data[0]; // lấy phần tử đầu tiên trong mảng
      });

      const results = await Promise.all(uploadPromises);
      setGallery((prev) => [...prev, ...results]);
      e.target.value = null;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload images");
    }
  };

  const handleDeleteImage = async (image) => {
    try {
      const publicIdToDelete = image.public_id;
      const id = product_id;

      await axiosClient.delete(
        `/product/delete-images/${id}/${publicIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );

      // Xóa ảnh khỏi gallery sau khi xóa thành công
      setGallery((prev) =>
        prev.filter((img) => img.public_id !== publicIdToDelete)
      );
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Delete image error:", error);
      toast.error("Failed to delete image");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Edit Product</h1>
      <form
        onSubmit={handleSubmit(handleUpdateProduct)}
        className="mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-md"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* General Information */}
            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">
                General Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product title *
                  </label>
                  <textarea
                    {...register("title", {
                      required: "Product title is required",
                    })}
                    rows={2}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm resize-y"
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
                    placeholder="Auto-generated from title"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Base Price *
                  </label>
                  <input
                    type="number"
                    step="1"
                    {...register("basePrice", {
                      required: "Product base price is required",
                    })}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.basePrice ? "border-red-500" : "border-gray-300"
                    } p-2 shadow-sm`}
                  />
                  {errors.basePrice && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.basePrice.message}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can select multiple images
                  </p>

                  {/* Hiển thị ảnh hiện tại */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {gallery.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={`Product image ${index + 1}`}
                          className="w-20 h-20 rounded object-cover border"
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
                    Tags
                  </label>
                  <input
                    {...register("tags")}
                    placeholder="Separate tags with commas"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Relations */}
            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">Relations</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Brand *
                  </label>
                  <select
                    {...register("brand", { required: "Brand is required" })}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.brand ? "border-red-500" : "border-gray-300"
                    } p-2 shadow-sm`}
                  >
                    <option value="">Select Brand</option>
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
                    Category *
                  </label>
                  <select
                    {...register("category", {
                      required: "Category is required",
                    })}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    } p-2 shadow-sm`}
                  >
                    <option value="">Select Category</option>
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

            {/* Variants */}
            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">Variants</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {variants.length === 1 
                    ? "Product variants" 
                    : `${variants.length} variants`}
                </p>
              </div>
              
              {variants.map((variant, index) => (
                <div key={index} className="variant-item border-b pb-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Variant {index + 1}</h3>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Color *
                      </label>
                      <select
                        value={variant.color}
                        onChange={(e) =>
                          handleVariantChange(index, "color", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      >
                        <option value="">Select Color</option>
                        {colors.map((color, colorIndex) => (
                          <option key={colorIndex} value={color.title}>
                            {color.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Storage *
                      </label>
                      <select
                        value={variant.storage}
                        onChange={(e) => handleVariantChange(index, "storage", e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      >
                        <option value="">Select Storage</option>
                        <option value="64GB">64GB</option>
                        <option value="128GB">128GB</option>
                        <option value="256GB">256GB</option>
                        <option value="512GB">512GB</option>
                        <option value="1TB">1TB</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(index, "price", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) =>
                          handleVariantChange(index, "quantity", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Variant Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleVariantImageChange(e, index)}
                      className="mt-1 block w-full text-sm text-gray-500"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {variant.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img
                            src={image.url || image} // SỬA: hỗ trợ cả object và string
                            className="w-20 h-20 rounded object-cover border"
                            alt={`Variant ${index + 1} image ${imgIndex + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(index, imgIndex)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
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
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-800"
              >
                + Add Another Variant
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Technical Specifications */}
            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">
                Technical Specifications
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Screen
                  </label>
                  <textarea
                    {...register("screen")}
                    rows={5}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    OS
                  </label>
                  <input
                    {...register("os")}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rear Camera
                  </label>
                  <textarea
                    {...register("rearCamera")}
                    rows={7}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Front Camera
                  </label>
                  <textarea
                    {...register("frontCamera")}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Processor
                  </label>
                  <textarea
                    {...register("processor")}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Storage
                  </label>
                  <input
                    {...register("storage")}
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
                    Battery
                  </label>
                  <textarea
                    {...register("battery")}
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm resize-y"
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
                    Design
                  </label>
                  <textarea
                    {...register("design")}
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pb-6">
              <h2 className="mb-4 text-xl font-semibold">Description</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Description
                  </label>
                  <JoditEditor
                    ref={editor}
                    value={description}
                    config={config}
                    tabIndex={1}
                    onChange={handleEditorChange}
                    onBlur={(newContent) => handleEditorChange(newContent)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="rounded px-4 py-2 text-gray-600 hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;