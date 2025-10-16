import React, { useEffect, useState } from "react";
import { PencilLine, Trash } from "lucide-react";
import Axios from "../../../Axios";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  createColor,
  updateColor,
  deleteColor,
  getAllColor,
} from "../../../features/adminSlice/color/colorSlice";

const Colors = () => {
  const [editingColor, setEditingColor] = useState(null);
  const [editColor, setEditColor] = useState({ title: "" });
  const [newColor, setNewColor] = useState({ title: "" });

  const currentUser = useSelector((state) => state.auth.user);
  const { colors, loading, error } = useSelector((state) => state.colorAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getColors();
  }, [dispatch, currentUser.accessToken]);

  // get all colors
  const getColors = () => {
    dispatch(getAllColor({ token: currentUser.token }));
  };

  // added color
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newColor.title.trim()) {
      toast.error("Color title is required");
      return;
    }
    try {
      const resultAction = await dispatch(
        createColor({ colorData: newColor, token: currentUser.token })
      );

      if (createColor.fulfilled.match(resultAction)) {
        toast.success("Color created successfully");
        setNewColor({ title: "" });
        getColors();
      } else {
        toast.error("Failed to create color");
        toast.error(resultAction.payload || "Error: Create color failed!");
      }
    } catch (error) {
      toast.error("Error: Create brand failed!");
    }
  };

  // edit color
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        updateColor({
          colorId: editingColor._id || editColor.id,
          colorData: editColor,
          token: currentUser.token,
        })
      );
      if (updateColor.fulfilled.match(resultAction)) {
        toast.success("Color updated successfully");
        setEditingColor(null);
        getColors();
      } else {
        toast.error("Failed to update color");
        toast.error(resultAction.payload || "Error: Update color failed!");
      }
    } catch (error) {
      toast.error("Error updating color");
    }
  };

  const startEdit = (color) => {
    setEditingColor(color);
    setEditColor(color);
  };

  // delete color
  const onDelete = async (color) => {
    if (!window.confirm("Are you sure you want to delete this color ?")) {
      return;
    }
    try {
      const resultAction = await dispatch(
        deleteColor({
          colorId: color._id || color.id,
          token: currentUser.token,
        })
      );
      if (deleteColor.fulfilled.match(resultAction)) {
        toast.success("Color deleted successfully");
        getColors();
      } else {
        toast.error("Failed to delete color");
        toast.error(resultAction.payload || "Error: Delete color failed!");
      }
    } catch {
      toast.error("Error deleting color");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Colors</h1>
      <div className="card">
        <div className="flex">
          <form className="flex" onSubmit={handleSubmit}>
            <div className="mr-2">
              <input
                type="text"
                id="name"
                value={newColor.title}
                onChange={(e) =>
                  setNewColor({ ...newColor, title: e.target.value })
                }
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                placeholder="Enter new color title"
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
            onClick={() => getColors()}
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
                    <th className="table-head">Title</th>
                    <th className="table-head">Action</th>
                  </tr>
                </thead>

                <tbody className="table-body">
                  {colors.map((color, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell">{(index += 1)}</td>
                      <td className="table-cell">
                        <div className="flex w-max gap-x-4">
                          <div className="flex flex-col">
                            <p>{color.title}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className=""></div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-x-4">
                          <button
                            onClick={() => startEdit(color)}
                            className="text-blue-500 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-800"
                          >
                            <PencilLine size={20} />
                          </button>
                          <button
                            onClick={(e) => onDelete(color)}
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
      {editingColor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Edit Color</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={editingColor.title}
                  onChange={(e) =>
                    setEditingColor({ ...editingColor, title: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Color title"
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

export default Colors;
