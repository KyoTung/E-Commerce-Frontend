import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../index.css";

const Footer = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                // Add highlight class
                element.classList.add("highlight");
                // Remove highlight after 1.5s
                setTimeout(() => {
                    element.classList.remove("highlight");
                }, 1500);
            }
        }
    }, [location]);
    return (
        <footer className="border-t-4 border-red-600 bg-white py-8 text-black">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-8 md:grid md:grid-cols-4 md:gap-8">
                    {/* About Us */}
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="mb-4 text-lg font-bold text-gray-800">Về chúng tôi</h3>
                        <p className="text-gray-600 hover:text-red-600">
                            Chuyên cung cấp các sản phẩm công nghệ chính hãng với giá cả hợp lý.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h3 className="mb-4 text-lg font-bold text-gray-800">Liên kết nhanh</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blogs"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Blogs
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div className="text-center md:text-left">
                        <h3 className="mb-4 text-lg font-bold text-gray-800">Chính sách</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/shipping-policy"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Chính sách vận chuyển
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/return-policy"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Chính sách hoàn trả
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/privacy-policy"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Chính sách bảo mật
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terms"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Điều khoản sử dụng
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media & Contact */}
                    <div
                        id="contact"
                        className="flex flex-col items-center text-center md:items-start md:text-left"
                    >
                        <h3 className="mb-4 text-lg font-bold text-gray-800">Kết nối với chúng tôi</h3>
                        <div className="flex justify-center space-x-4 md:justify-start">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                            >
                                <FaFacebook size={24} />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                            >
                                <FaInstagram size={24} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                            >
                                <FaTwitter size={24} />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                            >
                                <FaYoutube size={24} />
                            </a>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-6 space-y-2 text-sm">
                            <p className="text-gray-600">Email: support@neststore.com</p>
                            <p className="text-gray-600">Hotline: 1900 1234</p>
                            <p className="text-gray-600">Giờ làm việc: 8:00 - 22:00</p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm">
                    <p className="text-gray-600">© 2025 Nest Store.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
