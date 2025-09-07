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
                        <h3 className="mb-4 text-lg font-bold text-gray-800">About Us</h3>
                        <p className="text-gray-600 hover:text-red-600">
                            Specializing in providing genuine technology products at reasonable prices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h3 className="mb-4 text-lg font-bold text-gray-800">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div className="text-center md:text-left">
                        <h3 className="mb-4 text-lg font-bold text-gray-800">Policies</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/shipping-policy"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/return-policy"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Return Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/privacy-policy"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terms"
                                    className="text-gray-600 transition-colors duration-200 hover:text-red-600"
                                >
                                    Terms of Use
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media & Contact */}
                    <div
                        id="contact"
                        className="flex flex-col items-center text-center md:items-start md:text-left"
                    >
                        <h3 className="mb-4 text-lg font-bold text-gray-800">Connect With Us</h3>
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
                            <p className="text-gray-600">Working hours: 8:00 - 22:00</p>
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
