import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLock, FiArrowLeft, FiKey, FiSave } from "react-icons/fi";
import { useSelector } from "react-redux";
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  const handleChangePassword = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3001/auth/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Password changed successfully!");
      setError("");
      setOldPassword("");
      setNewPassword("");

      setTimeout(() => navigate("/BusinessOwner"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Error changing password!");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col">
        <Header user={user} />

        <main className="flex-1 p-8 overflow-y-auto bg-gray-800">
          {/* Page header */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-600 opacity-5 rounded-xl"></div>
            <div className="relative z-10 flex justify-between items-center p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
              <div>
                <h1 className="text-2xl font-bold text-white">Security Settings</h1>
                <p className="text-gray-400 mt-1">Update your password to enhance your account security</p>
              </div>
              <button
                onClick={() => navigate('/BusinessOwner/profile')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow transition-colors flex items-center"
              >
                <FiArrowLeft className="mr-2" />
                Back to Profile
              </button>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="border-b border-gray-700 p-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FiKey className="mr-2 text-blue-400" />
                  Change Password
                </h2>
              </div>

              <div className="p-6">
                {/* Notifications */}
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

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-500" />
                      </div>
                      <input
                        type="password"
                        className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                        placeholder="Enter your current password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiKey className="text-gray-500" />
                      </div>
                      <input
                        type="password"
                        className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                      Password should be at least 8 characters and include numbers and special characters
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => navigate('/BusinessOwner/profile')}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors flex items-center"
                      >
                        <FiSave className="mr-2" />
                        Update Password
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
}