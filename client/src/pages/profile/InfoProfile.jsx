import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiMapPin, FiCalendar, FiFileText, FiEdit, FiKey } from 'react-icons/fi';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';

const InfoProfile = () => {
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3001/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
      } catch (err) {
        setError('Error loading profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
            <div className="text-blue-400 text-lg">Loading profile information...</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col">
        <Header user={user} />

        <main className="flex-1 p-8 overflow-y-auto bg-gray-800">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Profile Information</h1>
                  <p className="text-gray-400 mt-1">View and manage your personal and business information</p>
                </div>
                <div className="flex space-x-3">
                  <Link
                    to="profile/edit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors flex items-center"
                  >
                    <FiEdit className="mr-2" />
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 rounded-lg text-red-400 text-sm border border-red-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Information Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="border-b border-gray-700 p-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FiUser className="mr-2 text-blue-400" />
                  Personal Information
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                      <FiUser className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Full Name</p>
                      <p className="text-lg text-white">{profileData.userInfo?.name || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                      <FiMail className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Email Address</p>
                      <p className="text-lg text-white">{profileData.userInfo?.email || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                      <FiPhone className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Phone Number</p>
                      <p className="text-lg text-white">{profileData.userInfo?.phoneNumber || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                      <FiBriefcase className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Role</p>
                      <p className="text-lg text-white capitalize">{profileData.userInfo?.role || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden lg:col-span-2">
              <div className="border-b border-gray-700 p-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FiBriefcase className="mr-2 text-blue-400" />
                  Business Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                      <FiBriefcase className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Company Name</p>
                      <p className="text-lg text-white">{profileData.businessInfo?.companyName || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                      <FiCalendar className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Established Date</p>
                      <p className="text-lg text-white">
                        {profileData.businessInfo?.companyCreationDate
                          ? new Date(profileData.businessInfo?.companyCreationDate).toLocaleDateString()
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                      <FiMapPin className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Address</p>
                      <p className="text-lg text-white">{profileData.businessInfo?.address || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                      <FiFileText className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Bio</p>
                      <p className="text-lg text-white">{profileData.businessInfo?.bio || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="profile/edit"
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors flex items-center justify-center"
            >
              <FiEdit className="mr-2" />
              Edit Profile Information
            </Link>

            <Link
              to="/BusinessOwner/change-password"
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow transition-colors flex items-center justify-center"
            >
              <FiKey className="mr-2" />
              Change Password
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InfoProfile;