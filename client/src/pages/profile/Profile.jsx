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
            // Assurez-vous que la date est correctement formatée en ISO pour le backend
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

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center ">
            <div className="row w-75 shadow-lg rounded p-4 bg-white">
                {/* Colonne gauche : Informations */}
                <div className="col-md-6 d-flex flex-column justify-content-center p-4 text-white bg-info rounded">
                    <h2 className="mb-3">Votre Profil</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Form onSubmit={handleSubmit}>
                        {/* Section Utilisateur */}
                        <div className="mb-4 border-bottom pb-3">
                            <h5 className="text-muted mb-3">Informations Personnelles</h5>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold text-white">Nom</Form.Label>
                                <Form.Control plaintext readOnly value={profileData.userInfo?.name} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold text-white">Email</Form.Label>
                                <Form.Control plaintext readOnly value={profileData.userInfo?.email} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold text-white">Téléphone</Form.Label>
                                <Form.Control plaintext readOnly value={profileData.userInfo?.phoneNumber} />
                            </Form.Group>
                        </div>
                    </Form>
                </div>

                {/* Colonne droite : Informations de l'entreprise */}
                <div className="col-md-6 p-4">
                    <h2 className="text-center text-primary mb-4">Édition du Profil</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Form onSubmit={handleSubmit}>
                        {/* Section Entreprise */}
                        <div className="mt-4">
                            <h5 className="text-muted mb-3">Informations de l'Entreprise</h5>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold text-primary">
                                    <FiHome className="me-2" />
                                    Nom de l'entreprise
                                </Form.Label>
                                <Form.Control 
                                    value={profileData.businessInfo?.companyName || ''}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        businessInfo: { 
                                            ...profileData.businessInfo, 
                                            companyName: e.target.value 
                                        }
                                    })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold text-primary">
                                    <FiInfo className="me-2" />
                                    Bio
                                </Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    rows={2}
                                    value={profileData.businessInfo?.bio || ''}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        businessInfo: { 
                                            ...profileData.businessInfo, 
                                            bio: e.target.value 
                                        }
                                    })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold text-primary">
                                    <FiMapPin className="me-2" />
                                    Adresse
                                </Form.Label>
                                <Form.Control 
                                    value={profileData.businessInfo?.address || ''}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        businessInfo: { 
                                            ...profileData.businessInfo, 
                                            address: e.target.value 
                                        }
                                    })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold text-primary">
                                    <FiCalendar className="me-2" />
                                    Date de création
                                </Form.Label>
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
                                    className="form-control"
                                    dateFormat="dd/MM/yyyy"
                                />
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-100 py-2 fw-bold mt-3"
                            >
                                Mettre à jour
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Profile;