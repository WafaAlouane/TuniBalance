import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FiInfo, FiMapPin, FiCalendar, FiLink, FiHome } from 'react-icons/fi';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Profile = () => {
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
    const { token } = useSelector((state) => state.auth);

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
            alert('Profil mis à jour avec succès!');
        } catch (err) {
            setError('Erreur de mise à jour du profil');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-indigo-400 text-xl">Chargement...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: User Info */}
                    <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
                        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Votre Profil
                        </h2>
                        
                        {error && (
                            <div className="mb-6 p-4 bg-red-900/30 rounded-lg text-red-400 text-sm border border-red-800">
                                {error}
                            </div>
                        )}

                        <div className="mb-8 border-b border-gray-700 pb-6">
                            <h5 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                                Informations Personnelles
                            </h5>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
                                    <div className="mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200">
                                        {profileData.userInfo?.name || 'Non spécifié'}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                    <div className="mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200">
                                        {profileData.userInfo?.email || 'Non spécifié'}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Téléphone</label>
                                    <div className="mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200">
                                        {profileData.userInfo?.phoneNumber || 'Non spécifié'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Business Info */}
                    <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
                        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Édition du Profil
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="border-b border-gray-700 pb-6">
                                <h5 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                                    Informations de l'Entreprise
                                </h5>

                                <div className="space-y-4">
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                                            <FiHome className="mr-2" />
                                            Nom de l'entreprise
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 placeholder-gray-400 transition duration-200"
                                            value={profileData.businessInfo?.companyName || ''}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                businessInfo: { 
                                                    ...profileData.businessInfo, 
                                                    companyName: e.target.value 
                                                }
                                            })}
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                                            <FiInfo className="mr-2" />
                                            Bio
                                        </label>
                                        <textarea
                                            rows={3}
                                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 placeholder-gray-400 transition duration-200"
                                            value={profileData.businessInfo?.bio || ''}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                businessInfo: { 
                                                    ...profileData.businessInfo, 
                                                    bio: e.target.value 
                                                }
                                            })}
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                                            <FiMapPin className="mr-2" />
                                            Adresse
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 placeholder-gray-400 transition duration-200"
                                            value={profileData.businessInfo?.address || ''}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                businessInfo: { 
                                                    ...profileData.businessInfo, 
                                                    address: e.target.value 
                                                }
                                            })}
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                                            <FiCalendar className="mr-2" />
                                            Date de création
                                        </label>
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
                                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 placeholder-gray-400 transition duration-200"
                                            dateFormat="dd/MM/yyyy"
                                            wrapperClassName="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
                            >
                                Mettre à jour
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;