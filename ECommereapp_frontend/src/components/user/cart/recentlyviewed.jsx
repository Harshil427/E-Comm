import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RecentlyViewed = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getRecentlyViewed = async () => {
    try {
      setIsLoading(true);
      const recentlyViewedProducts = JSON.parse(localStorage.getItem("recently") || '[]');
      
      if (recentlyViewedProducts.length === 0) {
        setIsLoading(false);
        return;
      }

      const productPromises = recentlyViewedProducts.map(async (element) => {
        const response = await fetch('https://ecommerse-assingment-backend.onrender.com/product/' + element);
        const productDetail = await response.json();
        return productDetail.product;
      });

      const fetchedProducts = await Promise.all(productPromises);
      
      // Remove duplicates
      const uniqueProducts = fetchedProducts.filter(
        (product, index, self) => 
          index === self.findIndex((p) => p._id === product._id)
      );

      setProducts(uniqueProducts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching recently viewed products:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRecentlyViewed();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Recently Viewed Products</h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Recently Viewed Products</h2>
        </div>
        <div className="flex flex-col justify-center items-center h-64 text-center p-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-gray-300 mb-4"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          <p className="text-gray-500 text-lg">No recently viewed products</p>
          <p className="text-gray-400 text-sm mt-2">
            Start exploring and your recently viewed items will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Recently Viewed Products</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={product.img}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded">
                    Save {Math.round(((400 - parseFloat(product.price.split('₹')[2]?.trim() || product.price)) / 400) * 100)}%
                  </span>
                </div>
              </div>
              <div className="p-3 text-center">
                <h4 className="font-semibold text-sm mb-1">{product.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 line-through text-xs">
                    ₹{product.price.split('₹')[1]||400}
                  </span>
                  <span className="font-bold text-pink-600">
                    ₹{product.price.split('₹')[2]|| product.price}
                  </span>
                  </div>
                <Link to={`/${product._id}`}>
                  <button 
                    className="mt-2 w-full bg-pink-50 text-pink-600 py-2 rounded-md 
                    hover:bg-pink-100 transition-colors"
                  >
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;