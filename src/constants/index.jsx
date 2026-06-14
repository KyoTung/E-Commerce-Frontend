import {
  ChartColumn,
  Home,
  NotepadText,
  Package,
  PackagePlus,
  Settings,
  ShoppingBag,
  UserCheck,
  UserPlus,
  Users,
  LogOut,
  Building2,        
  PackageMinus,     
  Warehouse,        
  History,
  Image          
} from "lucide-react";
import ProfileImage from "../assets/profile-image.jpg";
import ProductImage from "../assets/product-image.jpg";
import { BiCategoryAlt } from "react-icons/bi";
import { MdOutlineEventNote } from "react-icons/md";
import { MdOutlineInvertColors } from "react-icons/md";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";
import { RiCoupon2Line } from "react-icons/ri";

const _path = "/admin";

export const navbarLinks = [
  // 1. Tổng quan
  {
    title: "Tổng quan",
    links: [
      { label: "Dashboard", icon: Home, path: _path },
      { label: "Báo cáo/Thống kê", icon: ChartColumn, path: `${_path}/sale-report` },
    ],
  },

  // 2. Người dùng
  {
    title: "Người dùng",
    links: [
      { label: "Quản lý người dùng", icon: Users, path: `${_path}/users` },
    ],
  },

  // 3. Quản lý sản phẩm
  {
    title: "Quản lý sản phẩm",
    links: [
      { label: "Danh mục", icon: BiCategoryAlt, path: `${_path}/categories` },
      { label: "Thương hiệu", icon: BiCategoryAlt, path: `${_path}/brands` },
      { label: "Màu sắc", icon: MdOutlineInvertColors, path: `${_path}/colors` },
      { label: "Sản phẩm", icon: Package, path: `${_path}/products` },
    ],
  },

  // 4. Quản lý kho
  {
    title: "Quản lý kho",
    links: [
      { label: "Nhà cung cấp", icon: Building2, path: `${_path}/suppliers` },
      { label: "Nhập kho", icon: PackagePlus, path: `${_path}/inventory/import` },
      { label: "Xuất kho", icon: PackageMinus, path: `${_path}/inventory/export` },
      { label: "Tồn kho", icon: Warehouse, path: `${_path}/inventory/stock` },
      { label: "Lịch sử giao dịch", icon: History, path: `${_path}/inventory/transactions` },
    ],
  },

  // 5. Đơn hàng & Khuyến mãi
  {
    title: "Đơn hàng & Khuyến mãi",
    links: [
      { label: "Đơn hàng", icon: ShoppingBag, path: `${_path}/orders` },
      { label: "Mã giảm giá", icon: RiCoupon2Line, path: `${_path}/coupons` },
    ],
  },

  // 6. Nội dung
  {
    title: "Nội dung",
    links: [
      { label: "Danh mục bài viết", icon: MdOutlineEventNote, path: `${_path}/blog-categories` },
      { label: "Bài viết", icon: BsFillFileEarmarkPostFill, path: `${_path}/blogs` },
      { label: "Banner", icon: Image, path: "/admin/banner" },
    ],
  },

  // 7. Tiện ích
  {
    title: "Tiện ích",
    links: [
      { label: "Về trang khách", icon: LogOut, path: "/" },
    ],
  },
];

export const overviewData = [
    {
        name: "Jan",
        total: 1500,
    },
    {
        name: "Feb",
        total: 2000,
    },
    {
        name: "Mar",
        total: 1000,
    },
    {
        name: "Apr",
        total: 5000,
    },
    {
        name: "May",
        total: 2000,
    },
    {
        name: "Jun",
        total: 5900,
    },
    {
        name: "Jul",
        total: 2000,
    },
    {
        name: "Aug",
        total: 5500,
    },
    {
        name: "Sep",
        total: 2000,
    },
    {
        name: "Oct",
        total: 4000,
    },
    {
        name: "Nov",
        total: 1500,
    },
    {
        name: "Dec",
        total: 2500,
    },
];

export const recentSalesData = [
    {
        id: 1,
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        image: ProfileImage,
        total: 1500,
    },
    {
        id: 2,
        name: "James Smith",
        email: "james.smith@email.com",
        image: ProfileImage,
        total: 2000,
    },
    {
        id: 3,
        name: "Sophia Brown",
        email: "sophia.brown@email.com",
        image: ProfileImage,
        total: 4000,
    },
    {
        id: 4,
        name: "Noah Wilson",
        email: "noah.wilson@email.com",
        image: ProfileImage,
        total: 3000,
    },
    {
        id: 5,
        name: "Emma Jones",
        email: "emma.jones@email.com",
        image: ProfileImage,
        total: 2500,
    },
    {
        id: 6,
        name: "William Taylor",
        email: "william.taylor@email.com",
        image: ProfileImage,
        total: 4500,
    },
    {
        id: 7,
        name: "Isabella Johnson",
        email: "isabella.johnson@email.com",
        image: ProfileImage,
        total: 5300,
    },
];

export const topProducts = [
    {
        number: 1,
        name: "Wireless Headphones",
        image: ProductImage,
        description: "High-quality noise-canceling wireless headphones.",
        price: 99.99,
        status: "1",
        quanity: 100,
        sku: "SKMNFN",
    },
    {
        number: 2,
        name: "Smartphone",
        image: ProductImage,
        description: "Latest 5G smartphone with excellent camera features.",
        price: 799.99,
        status: "1",
        quanity: 100,
        sku: "SUDFNC",
    },
    {
        number: 3,
        name: "Gaming Laptop",
        image: ProductImage,
        description: "Powerful gaming laptop with high-end graphics.",
        price: 1299.99,
        status: "1",
        quanity: 100,
        sku: "MCMFIR",
    },
    {
        number: 4,
        name: "Smartwatch",
        image: ProductImage,
        description: "Stylish smartwatch with fitness tracking features.",
        price: 199.99,
        status: "0",
        quanity: 100,
        sku: "VRUEUS",
    },
    {
        number: 5,
        name: "Bluetooth Speaker",
        image: ProductImage,
        description: "Portable Bluetooth speaker with deep bass sound.",
        price: 59.99,
        status: "1",
        quanity: 100,
        sku: "DNUTUUI",
    },
];
