import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';

const InfoProfile = () => {
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3001/profile', {
          headers: { Authorization: `Bearer ${token}` },
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

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-indigo-400 text-xl">Chargement...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 rounded-lg text-red-400 text-sm border border-red-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Information Card */}
          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <h2 className="text-2xl font-bold text-white">Informations Personnelles</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="border-b border-gray-700 pb-4">
                <p className="text-sm font-medium text-gray-400">Nom</p>
                <p className="text-lg text-white">{profileData.userInfo?.name || 'Non spécifié'}</p>
              </div>
              
              <div className="border-b border-gray-700 pb-4">
                <p className="text-sm font-medium text-gray-400">Email</p>
                <p className="text-lg text-white">{profileData.userInfo?.email || 'Non spécifié'}</p>
              </div>
              
              <div className="border-b border-gray-700 pb-4">
                <p className="text-sm font-medium text-gray-400">Téléphone</p>
                <p className="text-lg text-white">{profileData.userInfo?.phoneNumber || 'Non spécifié'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-400">Rôle</p>
                <p className="text-lg text-white capitalize">{profileData.userInfo?.role || 'Non spécifié'}</p>
              </div>
            </div>
          </div>

          {/* Business Information Card */}
          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <h2 className="text-2xl font-bold text-white">Informations de l'Entreprise</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="border-b border-gray-700 pb-4">
                <p className="text-sm font-medium text-gray-400">Nom de l'entreprise</p>
                <p className="text-lg text-white">{profileData.businessInfo?.companyName || 'Non spécifié'}</p>
              </div>
              
              <div className="border-b border-gray-700 pb-4">
                <p className="text-sm font-medium text-gray-400">Bio</p>
                <p className="text-lg text-white">{profileData.businessInfo?.bio || 'Non spécifié'}</p>
              </div>
              
              <div className="border-b border-gray-700 pb-4">
                <p className="text-sm font-medium text-gray-400">Adresse</p>
                <p className="text-lg text-white">{profileData.businessInfo?.address || 'Non spécifié'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-400">Date de création</p>
                <p className="text-lg text-white">
                  {profileData.businessInfo?.companyCreationDate
                    ? new Date(profileData.businessInfo?.companyCreationDate).toLocaleDateString()
                    : 'Non renseignée'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4 max-w-2xl mx-auto">
          <Button
            href="profile/edit"
            className="w-full py-3 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-none rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Modifier Profil
          </Button>
          
          <Button
            href="/BusinessOwner/change-password"
            className="w-full py-3 text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 border-none rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Changer le mot de passe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoProfile;