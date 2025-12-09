import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

import { updateBlog, getBlog } from "../../../features/adminSlice/blog/blogSlice";
import { getAllBlogCategory } from "../../../features/adminSlice/blogCategory/blogCategorySlice";
import axiosClient from "../../../api/axiosClient"; // 

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
      placeholder: placeholder || "Start typing...",
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
        toast.success("Blog updated successfully");
        setTimeout(() => {
            navigate("/admin/blogs");
        }, 1000);
      } else {
        const errorMsg = resultAction.payload?.message || "Failed to update blog";
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("An error occurred");
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
        return response.data[0]; 
      });

      const results = await Promise.all(uploadPromises);
      setGallery((prev) => [...prev, ...results]);
      e.target.value = null; // Reset input file
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };


  const handleDeleteImage = async (image) => {
    try {
      const publicIdToDelete = image.public_id;
  
      await axiosClient.delete(
        `/blog/delete-images/${blog_id}/${publicIdToDelete}`
      );

      setGallery((prev) =>
        prev.filter((img) => img.public_id !== publicIdToDelete)
      );
      toast.success("Image deleted");
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
                Blog Title *
              </label>
              <input
                type="text"
                {...register("title", { required: "Blog title is required" })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
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
                <p className="mt-1 text-sm text-red-500">{errors.author.message}</p>
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
                  {isUploading && <span className="text-sm text-blue-500">Uploading...</span>}
              </div>
             
              <div className="flex flex-wrap gap-2 mt-2">
                {gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Blog img ${index}`}
                      className="w-24 h-24 rounded object-cover border"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm"
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
            Description
          </label>
          <JoditEditor
            ref={editor}
            value={description}
            config={config}
            tabIndex={1}
            onBlur={(newContent) => handleEditorChange(newContent)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/admin/blogs")}
            className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 border border-gray-300 transition"
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition ${
                 (isSubmitting || isUploading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;