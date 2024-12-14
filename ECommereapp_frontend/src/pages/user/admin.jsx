import React, { useState } from 'react';
import Dashboard from '../../components/admin/dashboard';
import Sidebar from '../../components/admin/sidebar';
import { Helmet } from "react-helmet";
import { Menu, X } from 'lucide-react'; // Assuming you're using lucide-react for icons

const Admin = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Helmet>
                <title>Admin | Mera Bestie</title>
            </Helmet>
            <div 
                className={`fixed inset-0 z-40 lg:hidden bg-black/50 transition-opacity duration-300 
                    ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={toggleSidebar}
            ></div>
            <div className={`
                fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
                lg:relative lg:translate-x-0 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <button 
                    className="lg:hidden absolute top-4 right-4 z-60"
                    onClick={toggleSidebar}
                >
                    <X className="h-6 w-6 text-gray-600" />
                </button>
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col relative">
                <header className="lg:hidden p-4 border-b flex items-center">
                    <button onClick={toggleSidebar} className="mr-4">
                        <Menu className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                </header>
                <div className="flex-1 overflow-auto p-4">
                    <Dashboard />
                </div>
            </div>
        </div>
    );
};

export default Admin;