import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


const SearchMobile = () => {
    const [query, setQuery] = useState("");
    const inputRef = useRef();
    const navigate = useNavigate();


    // Search submit
    const handleSearch = (e) => {
        e.preventDefault();
        const val = query.trim();
        if (!val) return;
        setQuery("");
        navigate(`/product-search?q=${encodeURIComponent(val)}`);
    };

    const handleClearInput = () => {
        setQuery("");
    };

    return (
        <form
            onSubmit={handleSearch}
            className="relative mt-4 pb-4 md:hidden"
            autoComplete="off"
        >
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-black focus:outline-none"
                />
                <button
                    type="submit"
                    className="absolute left-3 top-3"
                    aria-label="Search"
                >
                    <FiSearch className="text-gray-400" />
                </button>
                {query && (
                    <button
                        type="button"
                        className="absolute right-3 top-2 p-1 text-gray-400 hover:text-red-600"
                        onClick={handleClearInput}
                        aria-label="Clear search"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                )}
            </div>
           
        </form>
    );
};

export default SearchMobile;
