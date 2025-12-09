import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRout";

import LoginForm from "../pages/authen/Login";
import RegisterForm from "../pages/authen/Register";
import GuestLayout from "../layouts/guest/Layout";
import Home from "../pages/guest/Home";
import About from "../pages/guest/About";
import Contact from "../pages/guest/Contact";
import ProductDetail from "../pages/guest/ProductDetail";
import Cart from "../pages/guest/Cart";
import Checkout from "../pages/guest/Checkout";
import OrderConfirmation from "../pages/guest/OrderConfirmation";
import BlogPage from "../pages/guest/BlogPage";
import BlogDetail from "../pages/guest/BlogDetail";

import AdminLayout from "../layouts/admin/layout";
import DashboardPage from "../pages/admin/dashboard/page";
import User from "../pages/admin/user/users";
import EditUser from "../pages/admin/user/editUser";
import NewUser from "../pages/admin/user/newUser";
import Categories from "../pages/admin/categories/categories";
import Brands from "../pages/admin/brands/brands";
import Products from "../pages/admin/products/Product";
import NewProduct from "../pages/admin/products/newProduct";
import EditProduct from "../pages/admin/products/editProduct";
import Orders from "../pages/admin/orders/orders";
import OrderDetail from "../pages/admin/orders/orderDetail";
import Coupon from "../pages/admin/coupon/coupon";
import Colors from "../pages/admin/color/color";
import BlogCategory from "../pages/admin/blogCategory/blogCategory";
import Enquiries from "../pages/admin/enquiry/users";
import Blog from "../pages/admin/blogs/Blog";
import EditBlog from "../pages/admin/blogs/editBlog";
import NewBlog from "../pages/admin/blogs/newBlog";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginForm /> },
  { path: "/register", element: <RegisterForm /> },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/product-detail",
        element: <ProductDetail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/order-confirmation",
        element: <OrderConfirmation />,
      },
      {
        path: "/blogs",
        element: <BlogPage />,
      },
      {
        path: "/blog-detail",
        element: <BlogDetail />,
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "users",
        element: <User />,
      },
      {
        path: "edit-user/:id",
        element: <EditUser />,
      },
      {
        path: "new-user",
        element: <NewUser />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "coupons",
        element: <Coupon />,
      },
      {
        path: "brands",
        element: <Brands />,
      },
      {
        path: "colors",
        element: <Colors />,
      },
      {
        path: "blog-categories",
        element: <BlogCategory />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "new-product",
        element: <NewProduct />,
      },
      {
        path: "edit-product/:product_id",
        element: <EditProduct />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "order-detail/:id",
        element: <OrderDetail />,
      },
      {
        path: "blogs",
        element: <Blog />,
      },
      {
        path:"add-blog",
        element:<NewBlog/>,
      },
       {
        path:"edit-blog/:blog_id",
        element:<EditBlog/>,
      },
      {
        path: "enquiries",
        element: <Enquiries />,
      },
      {
        path: "settings",
        element: <h1 className="title">Settings</h1>,
      },
    ],
  },
]);
