import React, { useEffect, useState, useRef, useMemo } from "react";
import axiosClient from "../../../axios-client";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";


const EditProduct = ({ placeholder }) => {
    const editor = useRef(null);
    const navigate = useNavigate();
    const { product_id } = useParams();

    //const [gallery, setGallery] = useState([]);
    //const [galleryImages, setGalleryImages] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChange, setIsChange] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            axiosClient.get(`/products/${product_id}`).then(({ data }) => {
                console.log(data.data);
                setProductImages(data.data.product_images);
                reset({
                    name: data.data.name,
                    description: data.data.description,
                    short_description: data.data.short_description,
                    price: data.data.price,
                    compare_price: data.data.compare_price,
                    quantity: data.data.quantity,
                    image: data.data.imageForm,
                    status: data.data.status,
                    is_featured: data.data.is_featured,
                    sku: data.data.sku,
                    resolution: data.data.resolution,
                    infrared: data.data.infrared,
                    sound: data.data.sound,
                    smart_function: data.data.smart_function,
                    AI_function: data.data.AI_function,
                    network: data.data.network,
                    other_features: data.data.other_features,
                    battery_capacity: data.data.battery_capacity,
                    category_id: data.data.category_id,
                    brand_id: data.data.brand_id,
                });
            });
        },
    });

    const description = watch("description");
    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: placeholder || "Start typings...",
        }),
        [placeholder],
    );

    useEffect(() => {
        getCategories();
        getBrands();
    }, []);

    const handleEditorChange = (newContent) => {
        setValue("description", newContent);
    };

    const handleUpdateProduct = async (formData) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            console.log(formData);

            const response = await axiosClient.put(`/products/${product_id}`, formData);

            if (response.data.status === 200) {
                toast.success(response.data.message || "Product updated Successfully");
                setIsChange(true);
                setTimeout(() => {
                    //navigate("/admin/products");
                }, 1200);
                console.log(response.data);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update product";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getCategories = () => {
        axiosClient
            .get("/categories")
            .then(({ data }) => {
                setCategories(data.data);
            })
            .catch(() => {
                toast.error("Failed to load categories");
            });
    };

    const getBrands = () => {
        axiosClient
            .get("/brands")
            .then(({ data }) => {
                setBrands(data.data);
            })
            .catch(() => {
                toast.error("Failed to load brands");
            });
    };

    const handleFile = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            // Tạo mảng promises cho tất cả các file
            const uploadPromises = Array.from(files).map(async (file) => {
                const imageForm = new FormData();
                imageForm.append("image", file);
                const response = await axiosClient.post(`/save-product-image/${product_id}`, imageForm);
                return response.data.data; // Trả về data của mỗi ảnh
            });

            // Chờ tất cả requests hoàn thành
            const newImages = await Promise.all(uploadPromises);

            // Cập nhật state với tất cả ảnh mới
            setProductImages((prev) => [...prev, ...newImages]);

            // Reset input
            e.target.value = "";
        } catch (err) {
            toast.error("Failed to upload images");
        }
    };

    const deleteImage = async (id) => {
        try {
            const response = await axiosClient.delete(`delete-product-image/${id}`);

            if (response.data.status == 200) {
                const newProductImage = productImages.filter((productImage) => productImage.id != id);
                setProductImages(newProductImage);
                toast.success(response.data.message);
            }
            console.log(response);
        } catch (err) {
            toast.error("Failed to detete image");
        }
    };

    const changeImage = async (image) => {
        try {
            const response = await axiosClient.get(`update-default-image?product_id=${product_id}&image=${image}`);

            if (response.data.status == 200) {
                toast.success(response.data.message);
            }
            console.log(response);
        } catch (err) {
            toast.error("Failed to upload image");
        }
    };

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
                            <h2 className="mb-4 text-xl font-semibold">General Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                                    <input
                                        {...register("name", { required: "Product name is required" })}
                                        className={`mt-1 block w-full rounded-md border ${errors.name ? "border-red-500" : "border-gray-300"} p-2 shadow-sm`}
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Technical Specifications */}
                        <div className="border-b pb-6">
                            <h2 className="mb-4 text-xl font-semibold">Technical Specifications</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Resolution</label>
                                    <input
                                        {...register("resolution")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Infrared</label>
                                    <input
                                        {...register("infrared")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sound</label>
                                    <input
                                        {...register("sound")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Smart function</label>
                                    <input
                                        {...register("smart_function")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">AI function</label>
                                    <input
                                        {...register("AI_function")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Network</label>
                                    <input
                                        {...register("network")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Other features</label>
                                    <input
                                        {...register("other_features")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Pricing */}
                        <div className="border-b pb-6">
                            <h2 className="mb-4 text-xl font-semibold">Pricing</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register("price", {
                                            required: "Price is required",
                                            min: { value: 0, message: "Price must be positive" },
                                        })}
                                        className={`mt-1 block w-full rounded-md border ${errors.price ? "border-red-500" : "border-gray-300"} p-2 shadow-sm`}
                                    />
                                    {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Compare Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register("compare_price")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Inventory & Image */}
                        <div className="border-b pb-6">
                            <h2 className="mb-4 text-xl font-semibold">Inventory & Image</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                                    <input
                                        type="number"
                                        {...register("quantity", {
                                            required: "Quantity is required",
                                            min: { value: 0, message: "Quantity must be positive" },
                                        })}
                                        className={`mt-1 block w-full rounded-md border ${errors.quantity ? "border-red-500" : "border-gray-300"} p-2 shadow-sm`}
                                    />
                                    {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">SKU</label>
                                    <input
                                        {...register("sku")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        {...register("status")}
                                        className={`mt-1 block w-full rounded-md border p-2 shadow-sm`}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="1">In Stock</option>
                                        <option value="0">Out Of Stock</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Featured product</label>
                                    <select
                                        {...register("is_featured")}
                                        className={`mt-1 block w-full rounded-md border p-2 shadow-sm`}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFile}
                                        className="mt-1 block w-full text-sm text-gray-500"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {productImages &&
                                        productImages.map((productImage, index) => {
                                            return (
                                                <div
                                                    className="w-full p-1 sm:w-1/2 md:w-1/4"
                                                    key={`image-${index}`}
                                                >
                                                    <div className="rounded bg-gray-200 p-0.5">
                                                        <img
                                                            src={productImage.image_url}
                                                            className="h-auto w-full rounded"
                                                        />
                                                        <button
                                                            onClick={() => deleteImage(productImage.id)}
                                                            className="mt-2 w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-800 disabled:opacity-50"
                                                        >
                                                            Delete
                                                        </button>
                                                        <button
                                                            onClick={() => changeImage(productImage.image)}
                                                            className="mt-2 w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-50"
                                                        >
                                                            Set as default
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>

                        {/* Relations */}
                        <div className="pb-6">
                            <h2 className="mb-4 text-xl font-semibold">Relations</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                                    <select
                                        {...register("category_id", { required: "Category is required" })}
                                        className={`mt-1 block w-full rounded-md border ${errors.category_id ? "border-red-500" : "border-gray-300"} p-2 shadow-sm`}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Brand *</label>
                                    <select
                                        {...register("brand_id", { required: "Brand is required" })}
                                        className={`mt-1 block w-full rounded-md border ${errors.brand_id ? "border-red-500" : "border-gray-300"} p-2 shadow-sm`}
                                    >
                                        <option value="">Select Brand</option>
                                        {brands.map((br) => (
                                            <option
                                                key={br.id}
                                                value={br.id}
                                            >
                                                {br.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.brand_id && <p className="mt-1 text-sm text-red-500">{errors.brand_id.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Short Description</label>
                                    <textarea
                                        {...register("short_description")}
                                        className="mt-1 block h-20 w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
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
                            {isChange ? (
                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/products")}
                                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    Back
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/products")}
                                    className="rounded px-4 py-2 text-gray-600 hover:bg-gray-300"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            )}
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

export default EditProduct;
