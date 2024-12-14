import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaSearch, FaTimes, FaBars, FaUser, FaHeart, FaShoppingCart, 
  FaGift, FaHome, FaStore, FaEnvelope 
} from "react-icons/fa";
import SearchBar from "./SearchBar";

const ProfessionalNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState(0)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const isActive = (path) => location.pathname === path;
  const searchRef = useRef()

  useEffect(() => {
    const fetchCartItems = async () => {
      var total = 0
      const userId = sessionStorage.getItem('userId');
      if (!userId) return;
      const cartResponse = await fetch(`https://ecommerse-assingment-backend.onrender.com/cart/${userId}`);
      const cartData = await cartResponse.json()
      cartData.cart?.forEach(item => {
        total = total + item.productQty
      })
      setCartItemCount(total)
    }
    fetchCartItems()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    const fetchUserName = async () => {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        try {
          const response = await fetch(`https://ecommerse-assingment-backend.onrender.com/auth/user/${userId}`);
          const data = await response.json();
          setUserName(data.name);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    fetchUserName();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    window.location.reload();
  };

  const userId = sessionStorage.getItem("userId");

  return (
    <nav className={`top-0 left-0 w-full z-50 transition-all duration-300 mb-auto ${
      scrolled 
        ? 'bg-white shadow-md' 
        : 'bg-transparent'
    }`}>
      {/* Top Promotional Banner */}
      <div 
        className={`bg-pink-600 text-white py-2 text-center text-xs transition-all duration-300 ${
          scrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-center">
          <FaGift className="mr-2" />
          <span>USE CODE OFF10 TO GET FLAT 10% OFF ON ORDERS ABOVE RS.499 | FREE SHIPPING | COD AVAILABLE</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
          <div className="h-[70px] flex items-center justify-between">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-black hover:text-pink-600 transition"
            >
              <FaBars className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link 
              to="/HomePage" 
              className="text-2xl flex items-center hover:opacity-80 transition"
            >
              <span className="font-['Bodoni_MT'] font-bold text-2xl text-pink-600">MERA Bestie</span>
            </Link>

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:flex space-x-8 text-sm font-medium">
              {[
                { path: "/HomePage", name: "HOME" },
                { path: "/shop", name: "SHOP" },
                { path: "/OccasionsPage", name: "OCCASIONS" },
                { path: "/contact", name: "CONTACT" },
                { path: "/about", name: "ABOUT" }
              ].map(({ path, name }) => (
                <Link
                  key={path}
                  to={path}
                  className={`
                    relative group transition-colors
                    ${isActive(path) ? 'text-pink-600' : 'text-gray-800'}
                    hover:text-pink-600
                  `}
                >
                  {name}
                  <span 
                    className={`
                      absolute bottom-[-4px] left-0 w-0 h-0.5 bg-pink-600 
                      transition-all duration-300 group-hover:w-full
                      ${isActive(path) ? 'w-full' : ''}
                    `}
                  />
                </Link>
              ))}
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-6">
              <button 
                className="text-gray-800 hover:text-pink-600 transition"
              >
                {isSearchOpen ? 
                  <div ref={searchRef}>
                    <SearchBar />
                  </div> : 
                  <FaSearch className="w-5 h-5" onClick={toggleSearch} />
                }
              </button>

              <Link 
                to="/cart" 
                className="relative text-gray-800 hover:text-pink-600 transition flex items-center"
              >
                <FaShoppingCart className="w-5 h-5" />
                <span className="ml-2 hidden md:block">Cart</span>
                {cartItemCount ? (
                  <span className="absolute top-[-8px] right-[-8px] bg-pink-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                ) : null}
              </Link>

              <button className="text-gray-800 hover:text-pink-600 transition hidden md:block">
                <FaHeart className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center text-gray-800 hover:text-pink-600 transition"
                >
                  <FaUser className="w-5 h-5" />
                  <span className="ml-2 hidden md:block">
                    {userId ? `Hi, ${userName}` : 'Profile'}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
                    {userId ? (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-pink-50 transition"
                      >
                        Logout
                      </button>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 hover:bg-pink-50 transition"
                        >
                          Login
                        </Link>
                        <Link
                          to="/Signup"
                          className="block px-4 py-2 hover:bg-pink-50 transition"
                        >
                          Sign Up
                        </Link>
                        <Link
                          to="/adminLogin"
                          className="block px-4 py-2 hover:bg-pink-50 transition"
                        >
                          Seller
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={toggleMenu}
          />
          <div 
            className="fixed inset-y-0 left-0 max-w-xs w-full bg-white 
            shadow-xl z-50 overflow-y-auto transform transition-transform"
          >
            {/* Mobile Menu Content */}
            <div className="p-6">
              <button 
                onClick={toggleMenu} 
                className="absolute top-5 right-5 text-gray-600 hover:text-pink-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
              
              <div className="mt-12 space-y-4">
                {userId ? (
                  <Link
                    to="/logout"
                    onClick={handleLogout}
                    className="py-2.5 text-lg font-medium text-gray-800 hover:text-pink-600 transition flex items-center"
                  >
                    <FaUser className="mr-3 text-pink-600" />
                    Logout
                  </Link>

                  

                ) : (
                  <>
                    {[
                      { path: "/login", name: "Login", icon: FaUser },
                      { path: "/Signup", name: "Sign Up", icon: FaUser },
                      { path: "/admin", name: "Seller Dashboard", icon: FaStore }
                    ].map(({ path, name, icon: Icon }) => (
                      <Link
                        key={path}
                        to={path}
                        onClick={toggleMenu}
                        className="py-2.5 text-lg font-medium text-gray-800 hover:text-pink-600 transition flex items-center"
                      >
                        <Icon className="mr-3 text-pink-600" />
                        {name}
                      </Link>
                    ))}
                  </>
                )}

                {[
                  { path: "/HomePage", name: "Home", icon: FaHome },
                  { path: "/shop", name: "Shop", icon: FaStore },
                  { path: "/OccasionsPage", name: "Occasions", icon: FaGift },
                  { path: "/contact", name: "Contact", icon: FaEnvelope },
                  { path: "/about", name: "About", icon: FaUser }
                ].map(({ path, name, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={toggleMenu}
                    className="py-2.5 text-lg font-medium text-gray-800 hover:text-pink-600 transition flex items-center"
                  >
                    <Icon className="mr-3 text-pink-600" />
                    {name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ProfessionalNavbar;