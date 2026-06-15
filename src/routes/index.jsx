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
import Profile from "../pages/guest/Profile";
import OrderHistory from "../pages/guest/OrderHistory";
import ChangePassword from "../pages/guest/ChangePassword";
import ForgotPassword from "../pages/guest/ForgotPassword";
import AllProducts from "../pages/guest/AllProducts";
import Wishlist from "../pages/guest/Wishlist";
import LoginSuccess from "../pages/authen/LoginSuccess";
import RecruitmentPage from "../pages/guest/RecruitmentPage"
import PolicyPage from "../pages/guest/PolicyPage";
import ComingSoonPage from "../pages/guest/ComingSoonPage";

import AdminLayout from "../layouts/admin/layout";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import ReportsPage from "../pages/admin/dashboard/ReportsPage"
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
import AdminProductDetail from "../pages/admin/products/adminProductDetail";
import AdminCreateOrder from "../pages/admin/orders/AdminCreateOrder";
import Supplier from "../pages/admin/supplier/SupplierList";
import ImportStock from "../pages/admin/inventory/ImportStock";
import StockOverview from "../pages/admin/inventory/StockOverview";
import ExportStock from "../pages/admin/inventory/ExportStock";
import TransactionHistory from "../pages/admin/inventory/TransactionHistory";
import BannerManager from "../pages/admin/banner/BannerManager";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginForm /> },
  { path: "/register", element: <RegisterForm /> },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/login-success",
    element: <LoginSuccess />,
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/products",
        element: <AllProducts />,
      },
      {
        path: "/wishlist",
        element: <Wishlist />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/product/:id",
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
        path: "/order-confirmation/:id",
        element: <OrderConfirmation />,
      },
      {
        path: "/orders",
        element: <OrderHistory />,
      },

      {
        path: "/blogs",
        element: <BlogPage />,
      },
      {
        path: "/blog-detail/:id",
        element: <BlogDetail />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path:"/recruitment",
        element: <RecruitmentPage/>
      },
      {
        path:"/policy",
        element:<PolicyPage/>
      },
      {
        path:"/comingsoon",
        element:<ComingSoonPage/>
      }
    ],
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole={["admin", "staff"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "sale-report",
        element: <ReportsPage />,
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
        path: "product-detail/:product_id",
        element: <AdminProductDetail />,
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
        path: "create-order",
        element: <AdminCreateOrder />,
      },

      {
        path: "suppliers",
        element: <Supplier />,
      },

      {
        path:"inventory/import",
        element: <ImportStock />,
      },

      {
        path:"inventory/export",
        element: <ExportStock />,
      },

      {
        path:"inventory/stock",
        element: <StockOverview />,
      },

      {
        path:"inventory/transactions",
        element: <TransactionHistory />,
      },

      {
        path: "blogs",
        element: <Blog />,
      },
      {
        path: "add-blog",
        element: <NewBlog />,
      },
      {
        path: "edit-blog/:blog_id",
        element: <EditBlog />,
      },
      {
        path: "enquiries",
        element: <Enquiries />,
      },
      {
       path:"banner",
       element:<BannerManager/>
      },

      {
        path: "settings",
        element: <h1 className="title">Settings</h1>,
      },
    ],
  },
]);
