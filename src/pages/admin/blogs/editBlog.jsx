import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { X, Upload, Trash2, ArrowLeft } from "lucide-react";

import { updateBlog, getBlog } from "../../../features/adminSlice/blog/blogSlice";
import { getAllBlogCategory } from "../../../features/adminSlice/blogCategory/blogCategorySlice";
import axiosClient from "../../../api/axiosClient";

const EditBlog = ({ placeholder }) => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const { blog_id } = useParams();
  const dispatch = useDispatch();

  const [gallery, setGallery] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { blogCategories } = useSelector((state) => state.blogCategoryAdmin);
  const { blog } = useSelector((state) => state.blogAdmin);

  useEffect(() => {
    dispatch(getAllBlogCategory());
    if (blog_id) {
      dispatch(getBlog(blog_id));
    }
  }, [blog_id, dispatch]);

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
      placeholder: placeholder || "Bắt đầu viết nội dung...",
      height: 400,
    }),
    [placeholder]
  );

  const handleEditorChange = (newContent) => {
    setValue("description", newContent);
  };

  useEffect(() => {
    if (blog && (blog._id === blog_id || blog.id === blog_id)) {
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
  }, [blog, blog_id, reset]);

  const handleUpdateBlog = async (formData) => {
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

      const resultAction = await dispatch(
        updateBlog({
          blogId: blog_id,
          blogData: blogData,
        })
      );

      if (updateBlog.fulfilled.match(resultAction)) {
        toast.success("Cập nhật bài viết thành công");
        setTimeout(() => {
          navigate("/admin/blogs");
        }, 1000);
      } else {
        toast.error(resultAction.payload?.message || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
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
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data[0];
      });
      const results = await Promise.all(uploadPromises);
      setGallery((prev) => [...prev, ...results]);
      e.target.value = null;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Tải ảnh thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (image) => {
    try {
      const publicIdToDelete = image.public_id;
      await axiosClient.delete(`/blog/delete-images/${blog_id}/${publicIdToDelete}`);
      setGallery((prev) => prev.filter((img) => img.public_id !== publicIdToDelete));
      toast.success("Xóa ảnh thành công");
    } catch (error) {
      console.error("Delete image error:", error);
      toast.error("Xóa ảnh thất bại");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa bài viết</h1>
        <button
          onClick={() => navigate("/admin/blogs")}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>
      </div>

      {/* Form */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit(handleUpdateBlog)} className="p-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tiêu đề bài viết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Vui lòng nhập tiêu đề" })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Nhập tiêu đề..."
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tác giả <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("author", { required: "Vui lòng nhập tên tác giả" })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="VD: Admin, Nguyễn Văn A..."
                />
                {errors.author && (
                  <p className="mt-1 text-xs text-red-500">{errors.author.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("category", { required: "Vui lòng chọn danh mục" })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Chọn danh mục</option>
                  {blogCategories?.map((category) => (
                    <option key={category._id || category.id} value={category.title}>
                      {category.title}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                )}
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hình ảnh
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition">
                    <Upload size={16} />
                    Chọn ảnh
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                  {isUploading && (
                    <span className="text-sm text-blue-500">Đang tải lên...</span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {gallery.map((image, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={image.url}
                        alt={`blog-img-${idx}`}
                        className="h-20 w-20 rounded-lg border border-gray-200 object-cover shadow-sm transition group-hover:shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(image)}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow-sm hover:bg-red-700"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Hỗ trợ nhiều ảnh (jpg, png, webp)
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung bài viết
            </label>
            <JoditEditor
              ref={editor}
              value={description}
              config={config}
              tabIndex={1}
              onBlur={(newContent) => handleEditorChange(newContent)}
            />
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/blogs")}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              disabled={isSubmitting || isUploading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition ${
                (isSubmitting || isUploading) ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật bài viết"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;