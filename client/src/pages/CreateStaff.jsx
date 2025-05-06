import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStaff } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiBriefcase, FiUserPlus } from 'react-icons/fi';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';

const CreateStaff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'financier',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const normalizedData = {
        ...formData,
        phoneNumber: formData.phoneNumber.startsWith('+216')
          ? formData.phoneNumber
          : `+216${formData.phoneNumber}`
      };

      await dispatch(createStaff(normalizedData));
      setSuccess("Staff member created successfully!");

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'financier',
      });

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/BusinessOwner');
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to create staff member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col">
        <Header user={user} />

        <main className="flex-1 p-8 pb-16 overflow-y-auto bg-gray-800">
          {/* Page header */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-600 opacity-5 rounded-xl"></div>
            <div className="relative z-10 flex justify-between items-center p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
              <div>
                <h1 className="text-2xl font-bold text-white">Create Staff Member</h1>
                <p className="text-gray-400 mt-1">Add a new staff member to your organization</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-full">
                <FiUserPlus className="text-blue-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="border-b border-gray-700 p-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FiUser className="mr-2 text-blue-400" />
                  Staff Information
                </h2>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-900/30 rounded-lg text-red-400 text-sm border border-red-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-900/30 rounded-lg text-green-400 text-sm border border-green-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-500" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter full name"
                        className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-500" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter email address"
                        className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-500" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter secure password"
                        className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">Password should be at least 8 characters</p>
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                    <div className="relative flex rounded-lg shadow-sm">
                      <div className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-600 bg-gray-700 text-gray-300 text-sm">
                        <FiPhone className="text-gray-500 mr-1" />
                        +216
                      </div>
                      <input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={formData.phoneNumber.replace('+216', '')}
                        onChange={handleChange}
                        required
                        placeholder="Enter phone number"
                        className="flex-1 block w-full px-3 py-2 rounded-r-lg border border-gray-600 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiBriefcase className="text-gray-500" />
                      </div>
                      <select
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 appearance-none"
                      >
                        <option value="financier" className="bg-gray-700">Financial Manager</option>
                        <option value="accountant" className="bg-gray-700">Accountant</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => navigate('/BusinessOwner')}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                          </>
                        ) : (
                          <>
                            <FiUserPlus className="mr-2" />
                            Create Staff Account
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateStaff;
