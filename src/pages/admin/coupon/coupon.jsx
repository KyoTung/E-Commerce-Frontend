import React, { useEffect, useState } from "react";
import { PencilLine, Trash } from "lucide-react";
import Axios from "../../../Axios";
import Loading from "../../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCoupon,
  getCoupon,
  getAllCoupon,
  createCoupon,
} from "../../../features/adminSlice/coupons/couponSlice";

const Coupon = () => {
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector((state) => state.couponAdmin);
  const currentUser = useSelector((state) => state.auth.user);
  const [isNew, setIsNew] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCoupon, setEditCoupon] = useState({
    name: "",
    expiry: "",
    discount: "",
  });
  const [newCoupon, setNewCoupon] = useState({
    name: "",
    expiry: "",
    discount: "",
  });

  useEffect(() => {
    getCoupons();
  }, []);

  const getCoupons = async () => {
    dispatch(getAllCoupon({ token: currentUser.token }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("newCoupon", newCoupon);
      const resultAction = await dispatch(createCoupon({ couponData: newCoupon, token: currentUser.token }));
      if(createCoupon.fulfilled.match(resultAction)){
        toast.success("Discount code added successfully");
        setIsNew(false);
        getCoupons();
      }
    } catch (error) {
      toast.error(
        "Error adding discount code"
      );
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.put(
        `/discount-codes/${editingCode.id}`,
        editCode
      );
      if (response.status === 200) {
        toast.success("Discount code updated successfully");
        setEditingCode(null);
        getCodes();
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        toast.error(Object.values(error.response.data.errors).join(" | "));
      } else {
        toast.error(
          error.response?.data?.message || "Error updating discount code"
        );
      }
    }
  };

  const handleNewCoupon = (code) => {
    setNewCoupon(code);
    setNewCoupon({
      name: code.name || "",
      value: code.value || "",
      start_date: code.start_date || "",
      end_date: code.end_date || "",
    });
  };

  const startEdit = (code) => {
    setEditingCode(code);
    setEditCoupon({
      name: code.name || "",
      value: code.value || "",
      start_date: code.start_date || "",
      end_date: code.end_date || "",
    });
  };

  const onDelete = (code) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
      return;
    }
    Axios.delete(`/discount-codes/${code.id}`)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data?.message || "Xóa mã giảm giá thành công");
          getCodes();
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Delete failed");
      });
  };


  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Coupons</h1>

      <div className="card">
        <div className="card-header">
          <div className="flex">
            <button
              type="submit"
              onClick={() => setIsNew(true)}
              className="mr-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Add new
            </button>

            <button
              onClick={() => getCoupons()}
              className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            >
              Refresh
            </button>
          </div>
        </div>
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
                    <th className="table-head">Value</th>
                    <th className="table-head">Start Date</th>
                    {/* <th className="table-head">End Date</th> */}
                    <th className="table-head">Action</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {coupons.map((coupon, index) => (
                    <tr key={coupon.id} className="table-row">
                      <td className="table-cell">{index + 1}</td>
                      <td className="table-cell">{coupon.name}</td>
                      <td className="table-cell">{coupon.discount * 100} %</td>
                      <td className="table-cell">{coupon.expiry}</td>
                      {/* <td className="table-cell">{coupon.end_date}</td> */}
                      <td className="table-cell">
                        <div className="flex items-center gap-x-4">
                          <button
                            onClick={() => startEdit(coupon)}
                            className="text-blue-500 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-800"
                          >
                            <PencilLine size={20} />
                          </button>
                          <button
                            onClick={() => onDelete(code)}
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
      {/* Edit discount code popup menu */}
      {isNew && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">New Coupon</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={newCoupon.name}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, name: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Coupon name"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Discount
                </label>
                <input
                  type="number"
                  value={newCoupon.discount}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, discount: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Discount value"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Expiry date
                </label>
                <input
                  type="date"
                  value={newCoupon.expiry}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, expiry: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Expiry date"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNew(false)}
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
      {isEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Edit Discount Code</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={editCode.name}
                  onChange={(e) =>
                    setEditCode({ ...editCode, name: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Discount code"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Value</label>
                <input
                  type="number"
                  value={editCode.value}
                  onChange={(e) =>
                    setEditCode({ ...editCode, value: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Discount value"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Start date
                </label>
                <input
                  type="date"
                  value={editCode.start_date}
                  onChange={(e) =>
                    setEditCode({ ...editCode, start_date: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Start date"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  End date
                </label>
                <input
                  type="date"
                  value={editCode.end_date}
                  onChange={(e) =>
                    setEditCode({ ...editCode, end_date: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="End date"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCode(null)}
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

export default Coupon;
