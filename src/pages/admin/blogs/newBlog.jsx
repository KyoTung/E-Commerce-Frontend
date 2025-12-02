import React, { useEffect, useState, useRef, useMemo, use } from "react";
import Axios from "../../../Axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import { createBlog } from "../../../features/adminSlice/blog/blogSlice";
import { getAllBlogCategory } from "../../../features/adminSlice/blogCategory/blogCategorySlice";
import axiosClient from "../../../Axios";
import { useSelector, useDispatch } from "react-redux";

const NewBlog = ({ placeholder }) => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [gallery, setGallery] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = useSelector((state) => state.auth.user);
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
    getBlogCategories();
  }, []);

  const getBlogCategories = () => {
    dispatch(getAllBlogCategory());
  };

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

      const resultAction = await dispatch(
        createBlog({ blogData: blogData, token: currentUser.token })
      );

      if (createBlog.fulfilled.match(resultAction)) {
        toast.success("Blog created successfully");
        navigate("/admin/blogs");
      } else {
        const errorMessage =
          resultAction.payload?.message ||
          resultAction.error?.message ||
          "Failed to create blog";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Create blog error:", error);
      toast.error("Failed to add blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const imageForm = new FormData();
        imageForm.append("images", file);
        const response = await axiosClient.put("/blog/upload", imageForm, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${currentUser?.token}`,
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
      toast.error(err.response?.data?.message || "Failed to upload images");
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
                Blog title *
              </label>
              <textarea
                {...register("title", {
                  required: "Blog title is required",
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
                Author *
              </label>
              <textarea
                {...register("author", {
                  required: "author title is required",
                })}
                rows={1}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm resize-y"
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
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {gallery.map((image, imgIndex) => (
                  <div key={imgIndex} className="relative">
                    <img
                      src={image.url}
                      className="w-20 h-20 rounded object-cover border"
                      alt={`Product image ${imgIndex + 1}`}
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
        <div className="pb-6">
          <h2 className="mb-4 mt-2 text-xl font-semibold">Description</h2>
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
            onClick={() => navigate("/admin/blogs")}
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
            {isSubmitting ? "Saving..." : "Save Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBlog;
