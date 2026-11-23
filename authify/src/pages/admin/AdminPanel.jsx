// src/pages/admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import axiosClient from '../../api/axiosClient';
import { FiLock, FiUnlock, FiUser, FiShield, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import Loader from '../../components/common/Loader';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async (pageNumber = 0) => {
    setLoading(true);
    try {
      // Backend call to get users (page, size)
      const response = await axiosClient.get(`/admin?page=${pageNumber}&size=10`);
      if (response.data.success) {
        setUsers(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
        setPage(response.data.data.number);
      }
    } catch (error) {
      setErrorMsg('Failed to fetch users. Are you an Admin?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, []);

  const handleLockToggle = async (userId, currentStatus) => {
    try {
      if (currentStatus === 'LOCKED') {
        await axiosClient.post(`/admin/users/${userId}/unlock`);
      } else {
        await axiosClient.post(`/admin/users/${userId}/lock`);
      }
      // Refresh list
      fetchUsers(page);
    } catch (error) {
      alert('Action failed. Please try again.');
    }
  };

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200">
      <Navbar />

      <div className="flex flex-grow max-w-[1600px] mx-auto w-full">
        <Sidebar />

        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-10 overflow-y-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                <FiShield className="text-indigo-500" /> Admin Control Panel
              </h1>
              <p className="text-slate-400 mt-1">Manage users, roles, and account statuses.</p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <FiSearch className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1e293b]/60 border border-slate-700/50 rounded-xl focus:outline-none focus:border-indigo-500 text-white transition-all"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              {errorMsg}
            </div>
          )}

          {/* Data Table */}
          <div className="bg-[#1e293b]/60 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0f172a]/80 border-b border-slate-700/50 text-slate-400 text-sm">
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Roles</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center">
                        <Loader size="sm" text="Loading Users..." />
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500">No users found.</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                              {user.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.fullName}</p>
                              <p className="text-xs text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full font-semibold text-xs ${user.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1 flex-wrap">
                            {user.roles.map(role => (
                              <span key={role} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">
                                {role.replace('ROLE_', '')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleLockToggle(user.id, user.status)}
                            className={`p-2 rounded-lg transition-all ${user.status === 'LOCKED' ? 'text-green-400 hover:bg-green-500/10' : 'text-red-400 hover:bg-red-500/10'}`}
                            title={user.status === 'LOCKED' ? 'Unlock User' : 'Lock User'}
                          >
                            {user.status === 'LOCKED' ? <FiUnlock size={18} /> : <FiLock size={18} />}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="p-4 border-t border-slate-700/50 flex justify-between items-center bg-[#0f172a]/40">
                <button
                  onClick={() => fetchUsers(page - 1)}
                  disabled={page === 0}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <FiChevronLeft /> Previous
                </button>
                <span className="text-sm text-slate-400">Page {page + 1} of {totalPages}</span>
                <button
                  onClick={() => fetchUsers(page + 1)}
                  disabled={page === totalPages - 1}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            )}
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPanel;