import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = () => {
    const [inputValue, setInputValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (inputValue.trim()) {
                fetchProducts(inputValue);
            } else {
                setSearchResult([]);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [inputValue]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchProducts = async (input) => {
        setIsLoading(true);
        try {
            const response = await fetch('https://ecommerse-assingment-backend.onrender.com/get-product');
            const data = await response.json();
            if (data.success) {
                const validProducts = data.products.filter(product => 
                    (product.name.toLowerCase().includes(input.toLowerCase()) || 
                     product.category.toLowerCase().includes(input.toLowerCase())) &&
                    product.price && 
                    product.img && 
                    product._id &&
                    product.visibility === "on" 
                );
                setSearchResult(validProducts);
                setShowResults(validProducts.length > 0);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setInputValue('');
        setSearchResult([]);
        setShowResults(false);
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-md mx-auto">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search gifts for your loved ones..."
                    className="w-full px-4 py-3 pl-10 pr-10 border-2 border-pink-200 rounded-full 
                               focus:outline-none focus:ring-2 focus:ring-pink-500 
                               transition-all duration-300 ease-in-out"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setShowResults(searchResult.length > 0)}
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
                {inputValue && (
                    <button 
                        onClick={clearSearch} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 
                                   text-pink-400 hover:text-pink-600 transition-colors"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            {/* Search Results */}
            <AnimatePresence>
                {showResults && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-white 
                                   shadow-lg rounded-xl overflow-hidden 
                                   max-h-96 overflow-y-auto"
                    >
                        {isLoading ? (
                            <div className="p-4 text-center text-pink-500">
                                Searching...
                            </div>
                        ) : searchResult.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No products found
                            </div>
                        ) : (
                            <ul>
                                {searchResult.map((result) => (
                                    <Link 
                                        to={`/${result._id}`} 
                                        key={result._id}
                                        onClick={() => setShowResults(false)}
                                    >
                                        <li 
                                            className="flex items-center p-3 
                                                       hover:bg-pink-50 
                                                       transition-colors 
                                                       cursor-pointer 
                                                       border-b last:border-b-0"
                                        >
                                            <img 
                                                src={result.img} 
                                                alt={result.name} 
                                                className="w-16 h-16 object-cover rounded-md mr-4"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {result.name}
                                                </h3>
                                                <p className="text-pink-600 font-medium">
                                                    {result.price}
                                                </p>
                                                <span className="text-xs text-gray-500">
                                                    {result.category}
                                                </span>
                                            </div>
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;