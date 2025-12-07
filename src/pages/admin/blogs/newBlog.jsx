import React, { useEffect, useState, useRef, useMemo } from "react"; // Bỏ 'use'
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import { createBlog } from "../../../features/adminSlice/blog/blogSlice";
import { getAllBlogCategory } from "../../../features/adminSlice/blogCategory/blogCategorySlice";
import axiosClient from "../../../api/axiosClient";
import { useSelector, useDispatch } from "react-redux";

const NewBlog = ({ placeholder }) => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [gallery, setGallery] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { blogCategories } = useSelector((state) => state.blogCategoryAdmin);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
      title: "",
      author: "",
      category: "",
    },
  });

  const description = watch("description");

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
      height: 400, // Thêm chiều cao cho đẹp
    }),
    [placeholder]
  );

  useEffect(() => {
    dispatch(getAllBlogCategory());
  }, [dispatch]);

  const handleEditorChange = (newContent) => {
    setValue("description", newContent);
  };

  const handleAddBlog = async (formData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const blogData = {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        images: gallery,
        description: formData.description,
      };

      console.log("Blog data to create:", blogData);

      const resultAction = await dispatch(createBlog(blogData));

      if (createBlog.fulfilled.match(resultAction)) {
        toast.success("Blog created successfully");
        setTimeout(() => {
          navigate("/admin/blogs");
        }, 1000);
      } else {
        const errorMessage =
          resultAction.payload?.message || "Failed to create blog";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Create blog error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const imageForm = new FormData();
        imageForm.append("images", file);

        const response = await axiosClient.put("/blog/upload", imageForm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const image = response.data[0];
        return {
          url: image.url,
          asset_id: image.asset_id,
          public_id: image.public_id,
        };
      });

      const results = await Promise.all(uploadPromises);
      setGallery((prev) => [...prev, ...results]);

      e.target.value = null;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload images");
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

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">New Blog</h1>
      <form
        onSubmit={handleSubmit(handleAddBlog)}
        className="mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-md"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Blog Title *
              </label>
              <input
                type="text"
                {...register("title", { required: "Blog title is required" })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Author *
              </label>
              <input
                type="text"
                {...register("author", { required: "Author is required" })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.author.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Blog Images
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {isUploading && (
                  <span className="text-sm text-blue-500">Uploading...</span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {gallery.map((image, imgIndex) => (
                  <div key={imgIndex} className="relative group">
                    <img
                      src={image.url}
                      className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                      alt={`Blog img ${imgIndex}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleCanceledImage(image)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`mt-1 block w-full rounded-md border ${
                  errors.category ? "border-red-500" : "border-gray-300"
                } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
              >
                <option value="">Select Category</option>
                {blogCategories?.map((category) => (
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
        <div className="pb-6 mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <JoditEditor
            ref={editor}
            value={description}
            config={config}
            tabIndex={1}
            onBlur={(newContent) => handleEditorChange(newContent)}
            onChange={() => {}}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/admin/blogs")}
            className="rounded-lg px-4 py-2 text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors flex items-center ${
              isSubmitting || isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? "Saving..." : "Save Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBlog;
