import React, { useEffect, useState } from "react";
import { PencilLine, Trash } from "lucide-react";
import Axios from "../../../Axios";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  createBrand,
  updateBrand,
  getBrand,
  getAllBrand,
  deleteBrand,
} from "../../../features/adminSlice/brand/brandSlice";

const Brands = () => {
  const [editingBrand, setEditingBrand] = useState(null);
  const [editBrand, setEditBrand] = useState({ title: "" });
  const [newBrand, setNewBrand] = useState({ title: "" });

  const currentUser = useSelector((state) => state.auth.user);
  const { brands, loading, error } = useSelector((state) => state.brandAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getBrands();
  }, [dispatch, currentUser.accessToken]);

  // get all brands
  const getBrands = () => {
    dispatch(getAllBrand({ token: currentUser.token }));
  };

  // added brand
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newBrand.title.trim()) {
      toast.error("Brand title is required");
      return;
    }
    try {
      const resultAction = await dispatch(
        createBrand({ brandData: newBrand, token: currentUser.token })
      );

      if (createBrand.fulfilled.match(resultAction)) {
        toast.success("Brand created successfully");
        setNewBrand({ title: "" });
        getBrands();
      } else {
        toast.error("Failed to create brand");
        toast.error(resultAction.payload || "Error: Create brand failed!");
      }
    } catch (error) {
      toast.error("Error: Create brand failed!");
    }
  };

  // edit category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.put(
        `/brands/${editingCategory.id}`,
        editCate
      );

      if (response.status === 200) {
        toast.success("Brand updated successfully");
        setEditingCategory(null);
        getCate();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating brand");
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setEditCate(category);
  };

  // delete category
  const onDelete = (cate) => {
    if (!window.confirm("Are you sure you want to delete this brand ?")) {
      return;
    }

    Axios.delete(`/brands/${cate.id}`)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data?.message || "Brand deleted successfully");
          getCate();
        }
      })
      .catch(() => {
        toast.error(response?.data?.error || "Deleted fail ");
      });
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Brands</h1>
      <div className="card">
        <div className="flex">
          <form className="flex" onSubmit={handleSubmit}>
            <div className="mr-2">
              <input
                type="text"
                id="name"
                value={newBrand.title}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, title: e.target.value })
                }
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                placeholder="Enter new brand title"
              />
            </div>
            <button
              type="submit"
              class="mr-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Add new
            </button>
          </form>
          <button
            onClick={() => getBrands()}
            class="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
          >
            Refresh
          </button>
        </div>

        <div className="card-header"></div>
        {loading ? (
          <Loading className="flex items-center justify-center text-center" />
        ) : (
          <div className="card-body p-0">
            <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
              <table className="table">
                <thead className="table-header">
                  <tr className="table-row">
                    <th className="table-head">#</th>
                    <th className="table-head">Name</th>
                    <th className="table-head">Action</th>
                  </tr>
                </thead>

                <tbody className="table-body">
                  {brands.map((brand, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell">{(index += 1)}</td>
                      <td className="table-cell">
                        <div className="flex w-max gap-x-4">
                          <div className="flex flex-col">
                            <p>{brand.title}</p>
                            {/* <p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p> */}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-x-4">
                          <button
                            onClick={() => startEdit(brand)}
                            className="text-blue-500 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-800"
                          >
                            <PencilLine size={20} />
                          </button>
                          <button
                            onClick={(e) => onDelete(brand)}
                            className="text-red-500 hover:text-red-800"
                          >
                            <Trash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Edit brand popup menu */}
      {editingBrand && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Edit Brand</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={editBrand.title}
                  onChange={(e) =>
                    setEditBrand({ ...editBrand, title: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brand title"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
