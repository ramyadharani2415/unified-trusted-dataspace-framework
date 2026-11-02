import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  Container, Row, Col, Card, Form, Button, InputGroup,
  Alert, Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DataProviderLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:2021/api/dataprovider/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      console.log('Login Response:', response.data);

      const data = response.data;

      // Flexible success check
      if (response.status === 200 && (data.success || data.token || data.providerName)) {

        // === STORE USER DATA IN sessionStorage ===
        const userData = {
          email: formData.email.trim().toLowerCase(),
          name: data.providerName || data.name || 'Data Provider',
          organization: data.organization || data.providerOrganization || 'EuroHealth Organization',
          providerId: data.providerId || null,
          token: data.token || null
        };

        sessionStorage.setItem('user', JSON.stringify(userData));

        // Optional: also save token separately if needed elsewhere
        if (data.token) {
          localStorage.setItem('providerToken', data.token);
        }

        // Success redirect
        setTimeout(() => {
          navigate('/dataprovider');
        }, 800);

      } else {
        setError(data.message || 'Login failed. Please try again.');
      }

    } catch (err) {
      console.error('Login error:', err.response?.data || err);

      let errorMessage = 'Invalid email or password.';

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Invalid credentials. Please check your email and password.';
        } else if (err.response.status === 403) {
          errorMessage = 'Account not approved yet. Contact administrator.';
        } else if (err.response.status === 404) {
          errorMessage = 'User not found.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Is the backend running on port 2021?';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center py-5"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #164e63 50%, #0891b2 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card
              className="border-0 shadow-2xl overflow-hidden position-relative"
              style={{
                background: 'rgba(15, 25, 45, 0.92)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px'
              }}
            >
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => navigate('/')}
                className="position-absolute rounded-pill"
                style={{ top: '20px', left: '20px', zIndex: 10 }}
              >
                <i className="bi bi-arrow-left me-1"></i> Back
              </Button>

              <Card.Body className="p-5 pt-5">
                <div className="text-center mb-5">
                  <div
                    className="bg-gradient-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-lg"
                    style={{
                      width: '90px',
                      height: '90px',
                      background: 'linear-gradient(135deg, #0891b2, #06b6d4)'
                    }}
                  >
                    <i className="bi bi-cloud-upload-fill text-white fs-1"></i>
                  </div>
                  <h3 className="fw-bold text-white mb-2">Data Provider Portal</h3>
                  <p className="text-white-50 fs-6">
                    Secure access to publish and manage healthcare datasets
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-white fw-semibold">
                      Organization Email
                    </Form.Label>
                    <InputGroup size="lg">
                      <InputGroup.Text className="bg-transparent border-cyan text-cyan">
                        <i className="bi bi-envelope-at"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="provider@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-dark border-cyan text-white shadow-sm"
                        required
                        disabled={loading}
                        autoFocus
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-5">
                    <Form.Label className="text-white fw-semibold">
                      Provider Key (Password)
                    </Form.Label>
                    <InputGroup size="lg">
                      <InputGroup.Text className="bg-transparent border-cyan text-cyan">
                        <i className="bi bi-key-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-dark border-cyan text-white shadow-sm"
                        required
                        disabled={loading}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-100 rounded-pill py-3 fw-bold shadow-lg"
                    disabled={loading}
                    style={{
                      background: loading
                        ? '#495057'
                        : 'linear-gradient(90deg, #0891b2, #06b6d4, #0ea5e9)',
                      border: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login as Data Provider
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <small className="text-white-50">
                    New provider?{' '}
                    <a href="/providerregister" className="text-info fw-semibold text-decoration-underline">
                      Register your organization
                    </a>
                  </small>
                </div>

                <div className="text-center mt-3">
                  <small className="text-white-50">
                    Test: <code className="text-info">provider1@gmail.com</code> |{' '}
                    <code className="text-info">provider@123</code>
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DataProviderLogin;