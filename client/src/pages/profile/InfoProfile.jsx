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

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="row w-75 shadow-lg rounded p-4 bg-white">
        {/* Informations Utilisateur */}
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Row className="w-100 gx-5">
          <Col md={8} lg={6} className="mb-5">
            <Card className="shadow-sm">
              <Card.Header as="h5" className="bg-primary text-white rounded-top p-4">
                Informations Personnelles
              </Card.Header>
              <Card.Body className="p-5">
                <Card.Text>
                  <strong>Nom:</strong> {profileData.userInfo?.name}
                </Card.Text>
                <Card.Text>
                  <strong>Email:</strong> {profileData.userInfo?.email}
                </Card.Text>
                <Card.Text>
                  <strong>Téléphone:</strong> {profileData.userInfo?.phoneNumber}
                </Card.Text>
                <Card.Text>
                  <strong>Rôle:</strong> {profileData.userInfo?.role}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Informations Entreprise */}
          <Col md={8} lg={6} className="mb-5">
            <Card className="shadow-sm">
              <Card.Header as="h5" className="bg-primary text-white rounded-top p-4">
                Informations de l'Entreprise
              </Card.Header>
              <Card.Body className="p-5">
                <Card.Text>
                  <strong>Nom de l'entreprise:</strong> {profileData.businessInfo?.companyName}
                </Card.Text>
                <Card.Text>
                  <strong>Bio:</strong> {profileData.businessInfo?.bio}
                </Card.Text>
                <Card.Text>
                  <strong>Adresse:</strong> {profileData.businessInfo?.address}
                </Card.Text>
                <Card.Text>
                  <strong>Date de création:</strong> {profileData.businessInfo?.companyCreationDate
                    ? new Date(profileData.businessInfo?.companyCreationDate).toLocaleDateString()
                    : 'Non renseignée'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Button variant="primary" href="profile/edit" className="w-100 py-3 fw-bold">
          Modifier Profil
        </Button>
        <Button variant="danger" href="/BusinessOwner/change-password" className="w-100  py-3 fw-bold mt-1 ">
  Changer le mot de passe
</Button>

      </div>
    </div>
  );
};

export default InfoProfile;
