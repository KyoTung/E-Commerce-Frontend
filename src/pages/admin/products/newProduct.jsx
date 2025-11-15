import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import axiosClient from "../../../Axios";

import { useSelector, useDispatch } from "react-redux";
import { getAllBrand } from "../../../features/adminSlice/brand/brandSlice";
import { getAllCategory } from "../../../features/adminSlice/category/categorySlice";
import { createProduct } from "../../../features/adminSlice/products/productSlice";

const NewProduct = ({ placeholder }) => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const { brands } = useSelector((state) => state.brandAdmin);
  const { categories } = useSelector((state) => state.categoryAdmin);

  const [gallery, setGallery] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      placeholder: placeholder || "Start typings...",
    }),
    [placeholder]
  );

  useEffect(() => {
    getCategories();
    getBrands();
  }, []);

  const getBrands = async () => {
    dispatch(getAllBrand({ token: currentUser.token }));
  };

  const getCategories = async () => {
    dispatch(getAllCategory({ token: currentUser.token }));
  };

  const handleEditorChange = (newContent) => {
    setValue("description", newContent);
  };

  const handleAddProduct = async (formData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    console.log("add product", formData);
    try {
      // Chuẩn bị dữ liệu theo model Product
      const productData = {
        title: formData.title,
        slug: formData.slug,
        basePrice: formData.basePrice,
        description: formData.description,
        brand: formData.brand,
        category: formData.category,
        images: gallery,
        variants: Array.isArray(variants)
          ? variants.map((variant) => ({
              ...variant,
              price: Number(variant.price),
              quantity: Number(variant.quantity),
            }))
          : [],
        tags: Array.isArray(formData.tags)
          ? formData.tags.map((tag) => tag.value?.trim())
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

      console.log("add product", productData);
      const resultAction = await dispatch(
        createProduct({ productData: productData, token: currentUser.token })
      );

      if (createProduct.fulfilled.match(resultAction)) {
        toast.success("Product created successfully");
        navigate("/admin/products");
      } else {
        toast.error("Failed to create product");
        toast.error(resultAction.payload || "Error: Create product failed!");
      }
    } catch (error) {
      toast.error("Failed to add product");
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
    setVariants([
      ...variants,
      { color: "", storage: "", price: "", quantity: "", images: [] },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      const updatedVariants = variants.filter((_, i) => i !== index);
      setVariants(updatedVariants);
    }
  };

  const handleVariantImageChange = async (e, variantIndex) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const imageForm = new FormData();
        imageForm.append("image", file);
        const response = await Axios.post("/temp-images", imageForm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data.data.image_url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      const updatedVariants = [...variants];
      updatedVariants[variantIndex].images = [
        ...updatedVariants[variantIndex].images,
        ...imageUrls,
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

  const handlImageUpload = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const res = await axiosClient.put("/product/upload-images", formData);
    setGalleies(res.data); // lưu ảnh đại diện
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      // Tạo mảng promises cho tất cả các file
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

        const image = response.data[0]; // lấy phần tử đầu tiên trong mảng

        return {
          url: image.url,
          asset_id: image.asset_id,
          public_id: image.public_id,
        };
      });

      // Chờ tất cả requests hoàn thành
      const results = await Promise.all(uploadPromises);

      // Cập nhật state theo cách immutable
      setGallery((prev) => [...prev, ...results]); // lưu toàn bộ object ảnh

      // Reset input
      e.target.value = null;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload images");
    }
  };


  const handleCanceledImage = (image) => {
    console.log(image);
    const newGallery = gallery.filter((gallery) => gallery != image);
    setGallery(newGallery);
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">New Product</h1>
      <form
        onSubmit={handleSubmit(handleAddProduct)}
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
                    Base Price
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
                    Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {gallery.map((image, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <img
                          src={image.url}
                          className="w-20 h-20 rounded object-cover"
                          alt={`Ảnh ${imgIndex + 1}`}
                        />
                        <button
                          type="button"
                          onClick={handleCanceledImage}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
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
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Variants */}
            <div className="border-b pb-6">
              <h2 className="mb-4 text-xl font-semibold">Variants</h2>
              {variants.map((variant, index) => (
                <div key={index} className="variant-item border-b pb-4 mb-4">
                  <h3 className="text-lg font-medium">Variant {index + 1}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Color *
                      </label>
                      <input
                        value={variant.color}
                        onChange={(e) =>
                          handleVariantChange(index, "color", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Storage *
                      </label>
                      <input
                        value={variant.storage}
                        onChange={(e) =>
                          handleVariantChange(index, "storage", e.target.value)
                        }
                        placeholder="128GB, 256GB, etc."
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      />
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
                      onChange={(e) => handlImageUpload(e, index)}
                      className="mt-1 block w-full text-sm text-gray-500"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {variant.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img
                            src={image}
                            className="w-20 h-20 rounded object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(index, imgIndex)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-800"
                    >
                      Remove Variant
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addVariant}
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-800"
              >
                Add Variant
              </button>
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
                {isSubmitting ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewProduct;
