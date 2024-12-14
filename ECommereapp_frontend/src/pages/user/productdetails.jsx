import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { 
  FaMinus, 
  FaPlus, 
  FaShoppingCart, 
  FaStar, 
  FaTag,
  FaBox, 
  FaShippingFast,
  FaWarehouse,
  FaExclamationCircle
} from 'react-icons/fa';
import Navbar from '../../components/user/navbar/navbar';
import { Helmet } from "react-helmet";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showAddAnimation, setShowAddAnimation] = useState(false);
  const [stockStatus, setStockStatus] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://ecommerse-assingment-backend.onrender.com/product/${productId}`);
        const data = await response.json();
        if (data.success) {
          setProduct(data.product);
          calculateStockStatus(data.product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  const calculateStockStatus = (productData) => {
    const stock = productData.inStockValue || 0;
    let status = '';
    let color = '';

    if (stock > 50) {
      status = 'In Stock';
      color = 'text-green-600 bg-green-50';
    } else if (stock > 10) {
      status = 'Low Stock';
      color = 'text-yellow-600 bg-yellow-50';
    } else if (stock > 0) {
      status = 'Very Low Stock';
      color = 'text-orange-600 bg-orange-50';
    } else {
      status = 'Out of Stock';
      color = 'text-red-600 bg-red-50';
    }

    setStockStatus({ status, color, stock });
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (stockStatus?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    const userId = sessionStorage.getItem('userId');
    
    if (!userId) {
      setShowLoginDialog(true);
      return;
    }

    if (stockStatus?.stock === 0) {
      toast.error('Sorry, this product is currently out of stock');
      return;
    }

    try {
      const response = await fetch('https://ecommerse-assingment-backend.onrender.com/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.message === 'Product added to cart successfully') {
        setShowAddAnimation(true);
        setTimeout(() => {
          setShowAddAnimation(false);
          toast(
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/cart')}>
              Go to Cart →
            </div>,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            ease: "linear" 
          }}
          className="w-16 h-16 border-4 border-t-4 border-t-pink-600 border-pink-200 rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | Mera Bestie</title>
      </Helmet>
      <Navbar />
      <ToastContainer />

      {/* Login Dialog and Add to Cart Animation (previous implementation) */}
      {/* ... (keep the existing dialog and animation components) */}

      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image Section */}
              <div className="p-8 bg-gray-50 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-full max-w-md h-[500px] relative"
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain rounded-2xl shadow-lg"
                  />
                </motion.div>
              </div>

              {/* Product Info Section */}
              <div className="p-8 space-y-6">
                {/* Header Section with Name and Price */}
                <div className="border-b border-pink-100 pb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-pink-600 to-rose-500 text-transparent bg-clip-text">
                    {product.name}
                  </h1>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-semibold text-pink-600">
                      {product.price}
                    </p>
                    <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
                      <FaStar className="text-yellow-400" />
                      <span className="font-medium text-yellow-600">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock Status Section */}
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-full flex items-center ${stockStatus?.color}`}>
                    {stockStatus?.status === 'In Stock' && <FaBox className="mr-2 text-green-600" />}
                    {stockStatus?.status === 'Low Stock' && <FaExclamationCircle className="mr-2 text-yellow-600" />}
                    {stockStatus?.status === 'Very Low Stock' && <FaWarehouse className="mr-2 text-orange-600" />}
                    {stockStatus?.status === 'Out of Stock' && <FaShippingFast className="mr-2 text-red-600" />}
                    <span className="font-medium">
                      {stockStatus?.status} ({stockStatus?.stock} available)
                    </span>
                  </div>
                  <div className="bg-pink-50 px-4 py-2 rounded-full flex items-center">
                    <FaTag className="mr-2 text-pink-600" />
                    <span className="text-pink-600 font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Description Section */}
                <div className="border-t border-b border-pink-100 py-6">
                  <h2 className="text-xl font-semibold mb-4 text-pink-700">
                    Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || 'No description available'}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Quantity:</span>
                    <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                      <button 
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <FaMinus className="text-gray-600" />
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        className="w-16 text-center bg-transparent focus:outline-none"
                        readOnly
                      />
                      <button 
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= (stockStatus?.stock || 1)}
                      >
                        <FaPlus className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-4 rounded-xl hover:shadow-xl transition duration-300 flex items-center justify-center space-x-3 ${
                        stockStatus?.stock === 0 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-pink-600 to-rose-500 text-white'
                      }`}
                      onClick={handleAddToCart}
                      disabled={stockStatus?.stock === 0}
                    >
                      <FaShoppingCart />
                      <Link to={'/cart'}>
                      <span>
                        {stockStatus?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </span>
                      </Link>
                    </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;