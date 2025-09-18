import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../compoments/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PencilLine, Trash } from "lucide-react";
const Products = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = () => {
        setIsLoading(true);
        axiosClient
            .get("/products")
            .then(({ data }) => {
                setIsLoading(false);
                setProducts(data.data);
            })
            .catch(() => {
                setIsLoading(false);
            });
    };
    // Lọc sản phẩm theo tên hoặc sku
    const filteredProducts = search.trim()
        ? products.filter(
              (product) =>
                  product.name.toLowerCase().includes(search.toLowerCase()) ||
                  (product.sku && product.sku.toLowerCase().includes(search.toLowerCase())),
          )
        : products;

    const onDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this product ?")) {
            return;
        }

        axiosClient
            .delete(`/delete-product/${id}`)
            .then((response) => {
                if (response.data.status === 200) {
                    setTimeout(() => {
                        const newProducts = products.filter((product) => product.id !== id);
                        setProducts(newProducts);
                        toast.success(response.data?.message || "Product deleted successfully");
                        getProducts();
                        // getCate(); // Nếu không có hàm này thì bỏ đi
                    }, 1200);
                }
            })
            .catch(() => {
                toast.error(response?.data?.error || "Deleted fail ");
            });
    };

    return (
        <div>
            <ToastContainer />
            <h1 className="title mb-6">Products</h1>
            <div className="card">
                <div className="card-header flex items-center gap-2">
                    <Link
                        to="/admin/new-product"
                        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    >
                        Add new
                    </Link>
                    <button
                        onClick={() => getProducts()}
                        className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                    >
                        Refresh
                    </button>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or SKU"
                        className="ml-auto rounded border px-3 py-2 focus:outline-none"
                    />
                </div>
                {isLoading ? (
                    <Loading className="flex items-center justify-center" />
                ) : (
                    <div className="card-body p-0">
                        <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                            <table className="table">
                                <thead className="table-header">
                                    <tr className="table-row">
                                        <th className="table-head">#</th>
                                        <th className="table-head">Product</th>
                                        <th className="table-head">Price</th>
                                        <th className="table-head">Quantity</th>
                                        <th className="table-head">SKU</th>
                                        <th className="table-head">Status</th>
                                        <th className="table-head">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product, index) => (
                                            <tr
                                                key={product.id}
                                                className="table-row"
                                            >
                                                <td className="table-cell">{index + 1}</td>
                                                <td className="table-cell">
                                                    <div className="flex w-max gap-x-4">
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="w-35 h-40 rounded-lg object-cover"
                                                        />
                                                        <div className="flex flex-col">
                                                            <p>{product.name}</p>
                                                            <p className="font-normal text-slate-600 dark:text-slate-400">
                                                                {product.short_description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="table-cell">{formatPrice(product.price)}</td>
                                                <td className="table-cell">{product.quantity}</td>
                                                <td className="table-cell">{product.sku}</td>
                                                <td className="table-cell">
                                                    {product.status === 1 ? (
                                                        <p className="text-green-500">In Stock</p>
                                                    ) : (
                                                        <p className="text-red-500">Out Of Stock</p>
                                                    )}
                                                </td>
                                                <td className="table-cell">
                                                    <div className="flex items-center gap-x-4">
                                                        <button
                                                            onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                                                            className="text-blue-500 dark:text-blue-600"
                                                        >
                                                            <PencilLine size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => onDelete(product.id)}
                                                            className="text-red-500"
                                                        >
                                                            <Trash size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : search.trim() ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="py-8 text-center text-gray-500"
                                            >
                                                No products found.
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
