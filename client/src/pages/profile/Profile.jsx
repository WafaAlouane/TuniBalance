import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiInfo, FiMapPin, FiCalendar, FiHome, FiSave, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';

const Profile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        userInfo: {},
        businessInfo: {
            companyName: '',
            bio: '',
            address: '',
            companyCreationDate: null,
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token, user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3001/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfileData(response.data);
            } catch (err) {
                setError('Erreur de chargement du profil');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const updatedProfileData = {
                ...profileData.businessInfo,
                companyCreationDate: profileData.businessInfo.companyCreationDate
                    ? profileData.businessInfo.companyCreationDate.toISOString()
                    : null
            };

            await axios.put('http://localhost:3001/profile', updatedProfileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Profile updated successfully!');
            window.scrollTo(0, 0);
        } catch (err) {
            setError('Error updating profile. Please try again.');
            window.scrollTo(0, 0);
        }
    };

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
                    {/* Page header */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-blue-600 opacity-5 rounded-xl"></div>
                        <div className="relative z-10 flex justify-between items-center p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
                            <div>
                                <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
                                <p className="text-gray-400 mt-1">Update your personal and business information</p>
                            </div>
                        </div>
                    </div>

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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: User Info */}
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
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Business Info */}
                        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                            <div className="border-b border-gray-700 p-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <FiHome className="mr-2 text-blue-400" />
                                    Business Information
                                </h2>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Company Name
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiHome className="text-gray-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                                                    value={profileData.businessInfo?.companyName || ''}
                                                    onChange={(e) => setProfileData({
                                                        ...profileData,
                                                        businessInfo: {
                                                            ...profileData.businessInfo,
                                                            companyName: e.target.value
                                                        }
                                                    })}
                                                    placeholder="Enter company name"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Bio
                                            </label>
                                            <div className="relative">
                                                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                                    <FiInfo className="text-gray-500" />
                                                </div>
                                                <textarea
                                                    rows={3}
                                                    className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                                                    value={profileData.businessInfo?.bio || ''}
                                                    onChange={(e) => setProfileData({
                                                        ...profileData,
                                                        businessInfo: {
                                                            ...profileData.businessInfo,
                                                            bio: e.target.value
                                                        }
                                                    })}
                                                    placeholder="Enter company bio"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiMapPin className="text-gray-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                                                    value={profileData.businessInfo?.address || ''}
                                                    onChange={(e) => setProfileData({
                                                        ...profileData,
                                                        businessInfo: {
                                                            ...profileData.businessInfo,
                                                            address: e.target.value
                                                        }
                                                    })}
                                                    placeholder="Enter company address"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Establishment Date
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiCalendar className="text-gray-500" />
                                                </div>
                                                <DatePicker
                                                    selected={profileData.businessInfo?.companyCreationDate ?
                                                        new Date(profileData.businessInfo.companyCreationDate) : null}
                                                    onChange={(date) => setProfileData({
                                                        ...profileData,
                                                        businessInfo: {
                                                            ...profileData.businessInfo,
                                                            companyCreationDate: date
                                                        }
                                                    })}
                                                    className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                                                    dateFormat="MM/dd/yyyy"
                                                    placeholderText="Select date"
                                                />
                                            </div>
                                        </div>
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
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors flex items-center"
                                            >
                                                <FiSave className="mr-2" />
                                                Save Changes
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

export default Profile;