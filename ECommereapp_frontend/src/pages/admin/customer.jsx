import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/sidebar';
import { Search, ArrowUpDown } from 'lucide-react';
import { Helmet } from "react-helmet";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('https://ecommerse-assingment-backend.onrender.com/get-user');
      const data = await response.json();
      if (data.success) {
        // Map the user data and set default values if fields are missing
        const mappedUsers = data.users.map(user => ({
          userId: user.userId || '',
          name: user.name || '',
          email: user.email || '',
          accountStatus: user.accountStatus || 'open'
        }));
        setCustomers(mappedUsers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const response = await fetch('https://ecommerse-assingment-backend.onrender.com/update-account-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          accountStatus: newStatus
        })
      });

      if (response.ok) {
        setCustomers(prevCustomers => 
          prevCustomers.map(customer => 
            customer.userId === userId 
              ? {...customer, accountStatus: newStatus}
              : customer
          )
        );
      }
    } catch (error) {
      console.error('Error updating account status:', error);
    }
  };

  const sortedCustomers = React.useMemo(() => {
    if (!Array.isArray(customers)) return [];
    
    let sortableCustomers = [...customers];
    if (sortConfig.key !== null) {
      sortableCustomers.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';

        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();

        if (aString < bString) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aString > bString) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCustomers;
  }, [customers, sortConfig]);

  const filteredCustomers = React.useMemo(() => {
    return sortedCustomers.filter(customer => {
      const searchLower = searchQuery.toLowerCase();
      const userId = customer.userId?.toString().toLowerCase() || '';
      const customerName = customer.name?.toLowerCase() || '';
      const customerEmail = customer.email?.toLowerCase() || '';
      
      return userId.includes(searchLower) || 
             customerName.includes(searchLower) || 
             customerEmail.includes(searchLower);
    });
  }, [sortedCustomers, searchQuery]);

  return (
    <div className="flex">
    <Helmet>
      <title>Customers | Admin | Mera Bestie</title>
    </Helmet>
      <Sidebar />
      <div className="flex-1 p-8 ml-[5rem] lg:ml-64 bg-pink-50 min-h-screen">
        <div className="mb-6 flex justify-center">
          <div className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by user ID, name or email..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-pink-100">
              <tr>
                <th onClick={() => handleSort('userId')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    User ID
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th onClick={() => handleSort('email')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Email
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th onClick={() => handleSort('accountStatus')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Account Status
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((user) => (
                <tr key={user.userId || Math.random()}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.userId || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={user.accountStatus || 'open'}
                      onChange={(e) => handleStatusChange(user.userId, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="open">Open</option>
                      <option value="suspended">Suspended</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
