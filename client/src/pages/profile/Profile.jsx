import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FiInfo, FiMapPin, FiCalendar, FiLink, FiHome } from 'react-icons/fi';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Profile = () => {
<<<<<<< HEAD
    const [profileData, setProfileData] = useState({});
=======
    const [profileData, setProfileData] = useState({
        userInfo: {},
        businessInfo: {
            companyName: '',
            bio: '',
            address: '',
            companyCreationDate: null,
        }
    });
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
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
<<<<<<< HEAD
            await axios.put('http://localhost:3001/profile', profileData.businessInfo, {
=======
            // Assurez-vous que la date est correctement formatée en ISO pour le backend
            const updatedProfileData = {
                ...profileData.businessInfo,
                companyCreationDate: profileData.businessInfo.companyCreationDate
                    ? profileData.businessInfo.companyCreationDate.toISOString()
                    : null
            };

            await axios.put('http://localhost:3001/profile', updatedProfileData, {
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profil mis à jour avec succès!');
        } catch (err) {
            setError('Erreur de mise à jour du profil');
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
<<<<<<< HEAD
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="row w-75 shadow-lg rounded p-4 bg-white">
                {/* Colonne gauche : Informations */}
                <div className="col-md-6 d-flex flex-column justify-content-center p-4 text-white bg-success rounded">
=======
        <div className="container vh-100 d-flex justify-content-center align-items-center ">
            <div className="row w-75 shadow-lg rounded p-4 bg-white">
                {/* Colonne gauche : Informations */}
                <div className="col-md-6 d-flex flex-column justify-content-center p-4 text-white bg-info rounded">
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
                    <h2 className="mb-3">Votre Profil</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Form onSubmit={handleSubmit}>
                        {/* Section Utilisateur */}
                        <div className="mb-4 border-bottom pb-3">
                            <h5 className="text-muted mb-3">Informations Personnelles</h5>
                            <Form.Group className="mb-3">
<<<<<<< HEAD
                                <Form.Label className="fw-bold">Nom</Form.Label>
=======
                                <Form.Label className="fw-bold text-white">Nom</Form.Label>
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
                                <Form.Control plaintext readOnly value={profileData.userInfo?.name} />
                            </Form.Group>

                            <Form.Group className="mb-3">
<<<<<<< HEAD
                                <Form.Label className="fw-bold">Email</Form.Label>
=======
                                <Form.Label className="fw-bold text-white">Email</Form.Label>
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
                                <Form.Control plaintext readOnly value={profileData.userInfo?.email} />
                            </Form.Group>

                            <Form.Group className="mb-3">
<<<<<<< HEAD
                                <Form.Label className="fw-bold">Téléphone</Form.Label>
=======
                                <Form.Label className="fw-bold text-white">Téléphone</Form.Label>
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
                                <Form.Control plaintext readOnly value={profileData.userInfo?.phoneNumber} />
                            </Form.Group>
                        </div>
                    </Form>
                </div>

                {/* Colonne droite : Informations de l'entreprise */}
                <div className="col-md-6 p-4">
<<<<<<< HEAD
                    <h2 className="text-center text-success mb-4">Édition du Profil</h2>
=======
                    <h2 className="text-center text-primary mb-4">Édition du Profil</h2>
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Form onSubmit={handleSubmit}>
                        {/* Section Entreprise */}
                        <div className="mt-4">
                            <h5 className="text-muted mb-3">Informations de l'Entreprise</h5>
                            <Form.Group className="mb-3">
<<<<<<< HEAD
                                <Form.Label className="fw-bold">
=======
                                <Form.Label className="fw-bold text-primary">
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
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
<<<<<<< HEAD
                                <Form.Label className="fw-bold">
=======
                                <Form.Label className="fw-bold text-primary">
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
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
<<<<<<< HEAD
                                <Form.Label className="fw-bold">
=======
                                <Form.Label className="fw-bold text-primary">
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
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
<<<<<<< HEAD
                                <Form.Label className="fw-bold">
=======
                                <Form.Label className="fw-bold text-primary">
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
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
<<<<<<< HEAD
                                variant="success" 
=======
                                variant="primary" 
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
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

<<<<<<< HEAD
export default Profile;
=======
export default Profile;
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
