import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import {
  updateBlog,
  getBlog,
} from "../../../features/adminSlice/blog/blogSlice";
import { getAllBlogCategory } from "../../../features/adminSlice/blogCategory/blogCategorySlice";
import axiosClient from "../../../Axios";
import { useSelector, useDispatch } from "react-redux";

const EditBlog = ({ placeholder }) => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const { blog_id } = useParams();
  const dispatch = useDispatch();

  const [gallery, setGallery] = useState([]);

  const currentUser = useSelector((state) => state.auth.user);
  const { blogCategories } = useSelector((state) => state.blogCategoryAdmin);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { blog } = useSelector((state) => state.blogAdmin);

  useEffect(() => {
    getCategories();
    if (blog_id) {
      dispatch(getBlog({ blogId: blog_id, token: currentUser?.token }));
    }
  }, [blog_id, dispatch, currentUser?.token]);


  const getCategories = () => {
    dispatch(getAllBlogCategory());
  };

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

  const handleEditorChange = (newContent) => {
    setValue("description", newContent);
  };

  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title || "",
        description: blog.description || "",
        author: blog.author || "",
        category: blog.category || "",
      });
      if (blog.images) {
        setGallery(blog.images);
      }
    }
  }, [blog, reset]);

  const handleUpdateBlog = async (formData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const blogData = {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        images: gallery.map((img) => ({
          url: img.url,
          public_id: img.public_id,
          asset_id: img.asset_id,
        })),
        description: formData.description,
      };
      const resultAction = await dispatch(
        updateBlog({
          blogId: blog_id,
          blogData: blogData,
          token: currentUser.token,
        })
      );
      if (updateBlog.fulfilled.match(resultAction)) {
        toast.success("Blog updated successfully");
        navigate("/admin/blogs");
      } else {
        toast.error("Failed to update blog");
      }
    } catch (error) {
      toast.error("Failed to update blog");
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
      const id = blog_id;

      await axiosClient.delete(
        `/blog/delete-images/${id}/${publicIdToDelete}`,
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

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Edit Blog</h1>
      <form
        onSubmit={handleSubmit(handleUpdateBlog)}
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

export default EditBlog;
