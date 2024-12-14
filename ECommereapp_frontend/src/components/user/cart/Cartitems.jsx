import React, { useState, useEffect } from "react";
import { faTrash, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import emptyCart from '../../Images/empty_cart.webp';
import { Link } from 'react-router-dom';

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voucher, setVoucher] = useState('');
  const [discountInfo, setDiscountInfo] = useState({
    code: '',
    percentage: 0,
    message: ''
  });
  const VOUCHERS = {
    'OFF10': { percentage: 0.1, message: '10% discount applied!' },
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        setError('Please login to view cart');
        setLoading(false);
        return;
      }

      try {
        const cartResponse = await fetch(`https://ecommerse-assingment-backend.onrender.com/cart/${userId}`);
        const cartData = await cartResponse.json();

        if (!cartData.success) {
          setError(cartData.message || 'Failed to fetch cart');
          setLoading(false);
          return;
        }

        const groupedItems = cartData.cart.reduce((acc, item) => {
          if (!acc[item.productId]) {
            acc[item.productId] = {
              productId: item.productId,
              productQty: item.productQty
            };
          } else {
            acc[item.productId].productQty += item.productQty;
          }
          return acc;
        }, {});

        const productPromises = Object.values(groupedItems).map(async (item) => {
          const productResponse = await fetch(`https://ecommerse-assingment-backend.onrender.com/product/${item.productId}`);
          const productData = await productResponse.json();
          
          if (productData.success) {
            return {
              ...productData.product,
              quantity: item.productQty,
              cartItemId: item._id
            };
          }
          return null;
        });

        const products = await Promise.all(productPromises);
        setCartItems(products.filter(product => product !== null));
        setLoading(false);

      } catch (err) {
        setError('Error fetching cart items');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (itemId, change) => {
    const item = cartItems.find(item => item._id === itemId);
    const newQuantity = item.quantity + change;
    
    if (newQuantity >= 1) {
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await fetch('https://ecommerse-assingment-backend.onrender.com/update-quantity', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            productId: itemId,
            productQty: newQuantity
          })
        });

        const data = await response.json();
        if (data.success) {
          const updatedItems = cartItems.map(item => {
            if (item._id === itemId) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
          setCartItems(updatedItems);
        }
      } catch (err) {
        console.error('Error updating quantity:', err);
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const userId = sessionStorage.getItem('userId');
      const response = await fetch('https://ecommerse-assingment-backend.onrender.com/delete-items', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          productId: itemId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setCartItems(cartItems.filter(item => item._id !== itemId));
      }
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity);
    }, 0);
    const discountedTotal = subtotal * (1 - discountInfo.percentage);
    return discountedTotal.toFixed(2);
  };

  const handleVoucherRedeem = () => {
    const normalizedVoucher = voucher.toUpperCase().trim();
    
    if (VOUCHERS[normalizedVoucher]) {
      setDiscountInfo({
        code: normalizedVoucher,
        percentage: VOUCHERS[normalizedVoucher].percentage,
        message: VOUCHERS[normalizedVoucher].message
      });
    } else {
      setDiscountInfo({
        code: '',
        percentage: 0,
        message: 'Invalid voucher code'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
      </div>
    );
  }

  if (error || cartItems.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center">
        <img src={emptyCart} alt="Empty Cart" className="w-48 h-48 mb-4" />
        <p className="text-lg text-gray-600 mb-4">{error || 'Your cart is empty'}</p>
        <Link 
          to="/shop" 
          className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
        </div>
        <div className="p-4 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b pb-4 last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-medium text-base">Rs. {item.price}</span>
                
                <div className="flex items-center border rounded-md">
                  <button 
                    onClick={() => handleQuantityChange(item._id, -1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faMinus} className="text-sm" />
                  </button>
                  <input
                    type="text"
                    value={item.quantity}
                    readOnly
                    className="w-12 text-center border-none text-sm"
                  />
                  <button 
                    onClick={() => handleQuantityChange(item._id, 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-sm" />
                  </button>
                </div>
                
                <span className="font-medium text-base">
                  Rs. {(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toFixed(2)}
                </span>
                
                <button 
                  onClick={() => handleRemoveItem(item._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter voucher code"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              className="flex-grow border rounded-md px-3 py-2"
            />
            <button 
              className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600" 
              onClick={handleVoucherRedeem}
            >
              Redeem
            </button>
          </div>
          
          {discountInfo.message && (
            <div className={`text-sm ${discountInfo.code ? 'text-green-600' : 'text-red-600'}`}>
              {discountInfo.message}
            </div>
          )}
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {cartItems.reduce((total, item) => 
                total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity), 
                0).toFixed(2)}</span>
            </div>
            {discountInfo.percentage > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discountInfo.percentage * 100}%)</span>
                <span>- Rs. {(cartItems.reduce((total, item) => 
                  total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity), 
                  0) * discountInfo.percentage).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Rs. 0.00</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>Rs. {calculateTotal()}</span>
            </div>
          </div>
          
          <Link 
            to={'/checkout'}
            state={{
              total: calculateTotal(),
              discount: discountInfo.percentage
            }}
            className="block"
          >
            <button className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartItems;