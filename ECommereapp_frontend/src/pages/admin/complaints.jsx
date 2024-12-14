import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/sidebar';
import { Search, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Helmet } from "react-helmet";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('https://ecommerse-assingment-backend.onrender.com/get-complaints');
      const data = await response.json();
      setComplaints(data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const response = await fetch('https://ecommerse-assingment-backend.onrender.com/update-complaint-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          complaintId,
          status: newStatus
        })
      });

      if (response.ok) {
        fetchComplaints();
      }
      setActiveDropdown(null);
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedComplaints = React.useMemo(() => {
    if (!Array.isArray(complaints)) return [];
    
    let sortableComplaints = [...complaints];
    if (sortConfig.key !== null) {
      sortableComplaints.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableComplaints;
  }, [complaints, sortConfig]);

  const filteredComplaints = sortedComplaints.filter(complaint => 
    complaint.complaintNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-pink-50 min-h-screen">
      <Helmet>
        <title>Complaints | Admin | Mera Bestie</title>
      </Helmet>
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8 ml-[5rem] lg:ml-64">
        <div className="container mx-auto">
          {/* Search Section */}
          <div className="mb-6 flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-pink-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by complaint ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white shadow-sm transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-pink-100 border-b border-pink-200">
                  <tr>
                    {[
                      { key: 'complaintNumber', label: 'Complaint ID' },
                      { key: 'name', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: null, label: 'Message' },
                      { key: 'userType', label: 'User Type' },
                      { key: 'status', label: 'Status' },
                      { key: 'createdAt', label: 'Created At' },
                      { key: null, label: 'Actions' }
                    ].map(({ key, label }) => (
                      <th 
                        key={label} 
                        onClick={() => key && handleSort(key)}
                        className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${key ? 'cursor-pointer hover:bg-pink-200 transition-colors' : ''}`}
                      >
                        <div className="flex items-center">
                          {label}
                          {key && <ArrowUpDown size={14} className="ml-2 text-pink-400" />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr 
                      key={complaint.complaintNumber} 
                      className="hover:bg-pink-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {complaint.complaintNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {complaint.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {complaint.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {complaint.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {complaint.userType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${complaint.status === 'Resolved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'}`}>
                          {complaint.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm relative dropdown-container">
                        <div className="relative">
                          <button 
                            onClick={() => setActiveDropdown(
                              activeDropdown === complaint.complaintNumber 
                                ? null 
                                : complaint.complaintNumber
                            )}
                            className="flex items-center px-3 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
                          >
                            Update Status <ChevronDown size={16} className="ml-2" />
                          </button>
                          
                          {activeDropdown === complaint.complaintNumber && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-pink-200 rounded-lg shadow-lg z-10">
                              <ul className="py-1">
                                <li 
                                  onClick={() => handleStatusChange(complaint.complaintNumber, 'Pending')}
                                  className="px-4 py-2 hover:bg-pink-50 cursor-pointer text-sm text-gray-700 hover:text-pink-600"
                                >
                                  Pending
                                </li>
                                <li 
                                  onClick={() => handleStatusChange(complaint.complaintNumber, 'Resolved')}
                                  className="px-4 py-2 hover:bg-pink-50 cursor-pointer text-sm text-gray-700 hover:text-pink-600"
                                >
                                  Resolved
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;