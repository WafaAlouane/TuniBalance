import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLock, FiArrowLeft } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column - Information */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 flex flex-col justify-between">
            <div>
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Back
              </button>
              <h2 className="text-3xl font-bold text-white mb-4">Password Reset</h2>
              <p className="text-blue-100">
                Update your password to enhance your account security. Choose a strong, unique password.
              </p>
            </div>
            <div className="mt-8">
              <div className="flex items-center">
                <div className="h-1 w-8 bg-blue-400 rounded-full mr-2"></div>
                <div className="h-1 w-8 bg-blue-400/50 rounded-full mr-2"></div>
                <div className="h-1 w-8 bg-blue-400/30 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-700 p-3 rounded-full">
                <FiLock className="text-indigo-400 text-2xl" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-white mb-6">
              Change Your Password
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 rounded-lg text-red-400 text-sm border border-red-800">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-900/30 rounded-lg text-green-400 text-sm border border-green-800">
                {success}
              </div>
            )}

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-500" />
                  </div>
                  <input
                    type="password"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400"
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-500" />
                  </div>
                  <input
                    type="password"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleChangePassword}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}