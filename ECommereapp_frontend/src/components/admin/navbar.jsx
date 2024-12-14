import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
    return (
        <div className="bg-pink-100 flex items-center justify-end p-4">
            <div className="flex items-center space-x-2 md:space-x-4">
                <button className="text-blue-500 p-2 hover:bg-pink-200 rounded-full">
                    <i className="fas fa-comments text-sm md:text-base"></i>
                </button>
                <button className="text-blue-500 p-2 hover:bg-pink-200 rounded-full">
                    <i className="fas fa-camera text-sm md:text-base"></i>
                </button>
                <button className="text-blue-500 p-2 hover:bg-pink-200 rounded-full">
                    <i className="fas fa-trash text-sm md:text-base"></i>
                </button>
                <button className="text-blue-500 p-2 hover:bg-pink-200 rounded-full">
                    <i className="fas fa-bell text-sm md:text-base"></i>
                </button>
                <span className="text-gray-700 text-sm md:text-base hidden sm:inline">Hello, Admin</span>
            </div>
        </div>
    );
};

export default Navbar;
