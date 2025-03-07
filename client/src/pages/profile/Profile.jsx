    import React, { useEffect, useState } from 'react';
    import { useSelector } from 'react-redux';
    import axios from 'axios';
    import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
    import DatePicker from 'react-datepicker';
    import 'react-datepicker/dist/react-datepicker.css';

    const Profile = () => {
        const [profileData, setProfileData] = useState({});
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
            await axios.put('http://localhost:3001/profile', profileData.businessInfo, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profil mis à jour avec succès!');
            } catch (err) {
            setError('Erreur de mise à jour du profil');
            }
        };
        
        if (loading) return <div>Chargement...</div>;
        
        return (
            <Container className="my-5">
            <h2 className="mb-4">Profil de l'Entreprise</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
        
            <Form onSubmit={handleSubmit}>
                <Row>
                {/* Informations de base */}
                <Col md={6}>
                    <h4>Informations Utilisateur</h4>
                    <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control plaintext readOnly value={profileData.userInfo?.name} />
                    </Form.Group>
        
                    <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control plaintext readOnly value={profileData.userInfo?.email} />
                    </Form.Group>
        
                    <Form.Group className="mb-3">
                    <Form.Label>Téléphone</Form.Label>
                    <Form.Control plaintext readOnly value={profileData.userInfo?.phoneNumber} />
                    </Form.Group>
                </Col>
        
                {/* Informations de l'entreprise */}
                <Col md={6}>
                    <h4>Informations de l'Entreprise</h4>
                    
                    <Form.Group className="mb-3">
                    <Form.Label>Nom de l'entreprise</Form.Label>
                    <Form.Control 
                        value={profileData.businessInfo?.companyName || ''}
                        onChange={(e) => setProfileData({
                        ...profileData,
                        businessInfo: { ...profileData.businessInfo, companyName: e.target.value }
                        })}
                    />
                    </Form.Group>
        
                    <Form.Group className="mb-3">
                    <Form.Label>Date de création</Form.Label>
                    <DatePicker
    selected={profileData.businessInfo?.companyCreationDate ? new Date(profileData.businessInfo?.companyCreationDate) : null}
    onChange={(date) => setProfileData({
        ...profileData,
        businessInfo: { ...profileData.businessInfo, companyCreationDate: date }
    })}
    className="form-control"
    />
                    </Form.Group>
        
                    <Form.Group className="mb-3">
                    <Form.Label>Adresse</Form.Label>
                    <Form.Control
                        value={profileData.businessInfo?.address || ''}
                        onChange={(e) => setProfileData({
                        ...profileData,
                        businessInfo: { ...profileData.businessInfo, address: e.target.value }
                        })}
                    />
                    </Form.Group>
        
                    <Button variant="primary" type="submit">
                    Mettre à jour
                    </Button>
                </Col>
                </Row>
            </Form>
            </Container>
        );
        };
        export default Profile; 