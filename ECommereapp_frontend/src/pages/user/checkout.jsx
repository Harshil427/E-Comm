import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, ShoppingCart, CreditCard, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Helmet } from "react-helmet";
import Navbar from '../../components/user/navbar/navbar';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation()
  const total = parseFloat(location.state?.total || 0)
  const discount = parseFloat(location.state?.discount || 0)
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [saveAddress, setSaveAddress] = useState(false);
  useEffect(() => {
    const savedAddress = localStorage.getItem('savedShippingAddress');
    const savedSaveAddressPreference = localStorage.getItem('saveAddressPreference');
    
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        setAddress(parsedAddress);
      } catch (error) {
        console.error('Error parsing saved address:', error);
      }
    }

    if (savedSaveAddressPreference) {
      setSaveAddress(JSON.parse(savedSaveAddressPreference));
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      const cartResponse = await fetch(`https://ecommerse-assingment-backend.onrender.com/cart/${userId}`);
      const cartData = await cartResponse.json();

      if (!cartData.success) {
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
            quantity: item.productQty
          };
        }
        return null;
      });

      const products = await Promise.all(productPromises);
      setCartItems(products.filter(product => product !== null));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const updatedAddress = {
      ...address,
      [name]: value
    };
    
    setAddress(updatedAddress);

    if (saveAddress) {
      localStorage.setItem('savedShippingAddress', JSON.stringify(updatedAddress));
    }
  };

  const handleSaveAddressToggle = (e) => {
    const isChecked = e.target.checked;
    setSaveAddress(isChecked);

    // Save address preference
    localStorage.setItem('saveAddressPreference', JSON.stringify(isChecked));

    if (isChecked) {
      // Save current address to localStorage
      localStorage.setItem('savedShippingAddress', JSON.stringify(address));
    } else {
      // Remove saved address from localStorage
      localStorage.removeItem('savedShippingAddress');
    }
  };

  const isAddressValid = () => {
    return Object.values(address).every(value => value.trim() !== '');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity);
    }, 0);
  };

  const calculateDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * (discount / 100)).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    const userId = sessionStorage.getItem('userId');
  
    // Save address if selected
    if (saveAddress) {
      try {
        await fetch('https://ecommerse-assingment-backend.onrender.com/update-address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            address: Object.values(address).join(', ')
          })
        });
      } catch (err) {
        console.error('Error saving address:', err);
      }
    }
  
    const now = new Date();
    const date = now.toLocaleDateString('en-GB');
    const time = now.toLocaleTimeString('en-GB');
  
    const productsOrdered = cartItems.map(item => ({
      productId: item._id,
      productQty: item.quantity
    }));
  
    try {
      // Fetch order details to get the payment amount
      const response = await fetch('https://ecommerse-assingment-backend.onrender.com/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          date,
          time,
          address: Object.values(address).join(', '),
          price: total,
          productsOrdered
        })
      });
  
      const data = await response.json();
  
      if (data.message === 'Order created successfully') {
        // Initialize Razorpay payment
        const razorpayOptions = {
          key: "your-razorpay-key", // Replace with your Razorpay key
          amount: total * 100, // Amount is in paise (1 INR = 100 paise)
          currency: "INR",
          name: "Mera Bestie",
          description: "Order Payment",
          image: "https://example.com/logo.png", // Optional logo image
          order_id: data.orderId, // Order ID from backend
          handler: function (response) {
            // After payment, confirm the order
            confirmOrder(response.razorpay_payment_id);
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: address.phone
          },
          theme: {
            color: "#F37254" // Customize color if needed
          }
        };
  
        const rzp1 = new window.Razorpay(razorpayOptions);
        rzp1.open();
      }
    } catch (err) {
      console.error('Error placing order:', err);
    }
  };
  
  const confirmOrder = async (paymentId) => {
    const userId = sessionStorage.getItem('userId');
    const now = new Date();
    const date = now.toLocaleDateString('en-GB');
    const time = now.toLocaleTimeString('en-GB');
  
    const productsOrdered = cartItems.map(item => ({
      productId: item._id,
      productQty: item.quantity
    }));
  
    try {
      const response = await fetch('https://ecommerse-assingment-backend.onrender.com/confirm-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          date,
          time,
          address: Object.values(address).join(', '),
          price: total,
          productsOrdered,
          paymentId
        })
      });
  
      const data = await response.json();
  
      if (data.message === 'Order confirmed and payment successful') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
  
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/cart');
        }, 5000);
      }
    } catch (err) {
      console.error('Error confirming payment:', err);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
      </div>
    );
  }

  return (      
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Checkout | Mera Bestie</title>
      </Helmet>
      <Navbar/>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Address Section */}
          <div className="md:w-2/3 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6 space-x-4">
              <MapPin className="text-pink-600 w-8 h-8" />
              <h2 className="text-3xl font-bold text-gray-800">Shipping Details</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                />
              </div>
              
              <div className="md:col-span-2 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="saveAddress"
                  checked={saveAddress}
                  onChange={handleSaveAddressToggle}
                  className="text-pink-600 focus:ring-pink-500 rounded"
                />
                <label htmlFor="saveAddress" className="text-sm text-gray-700">
                  Save this address for future orders
                </label>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6 space-x-4">
              <ShoppingCart className="text-pink-600 w-8 h-8" />
              <h2 className="text-3xl font-bold text-gray-800">Order Summary</h2>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-800">
                    Rs. {(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold">Rs. {calculateSubtotal().toFixed(2)}</span>
              </div>
              
              {/* Discount Section */}
              {discount > 0 && (
                <div className="flex justify-between text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-green-600" />
                    <span>Discount ({discount}%)</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    - Rs. {calculateDiscountAmount()}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              
              <div className="flex justify-between text-xl font-bold border-t pt-4">
                <span>Total</span>
                <span className="text-pink-600">Rs. {total.toFixed(2)}</span>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={!isAddressValid()}
                className={`w-full flex items-center justify-center space-x-2 py-4 rounded-lg transition-all duration-300 ${
                  isAddressValid() 
                    ? 'bg-black text-white hover:bg-gray-800 hover:shadow-lg' 
                    : 'bg-gray-300 cursor-not-allowed opacity-50'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span>Place Order</span>
              </button>
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-10 text-center shadow-2xl">
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h3>
              <p className="text-gray-600 mb-6">Your order has been processed. Check your email for tracking details.</p>
              <button 
                onClick={() => navigate('/cart')}
                className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Back to Cart
              </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;