import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  Container, Row, Col, Card, Form, Button, InputGroup,
  Alert, Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserLogin() {
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
      const response = await axios.post('http://localhost:2021/api/users/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      console.log('User Login Response:', response.data);

      const data = response.data;
      const isSuccess = 
        data.success === true ||
        data.message?.toLowerCase().includes('success') ||
        data.token ||
        response.status === 200;

      if (isSuccess) {
        // Store user data in sessionStorage (clears on tab close)
        if (data.token) {
          sessionStorage.setItem('userToken', data.token);
        }
        sessionStorage.setItem('userEmail', formData.email.trim().toLowerCase());
        sessionStorage.setItem('isUserLoggedIn', 'true');

        // Optional: Save additional user info
        if (data.userId) sessionStorage.setItem('userId', data.userId);
        if (data.name) sessionStorage.setItem('userName', data.name);

        // Redirect to user dashboard
        setTimeout(() => {
          navigate('/userdashboard'); // Change to your actual user dashboard route
        }, 800);
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('User login error:', err);

      let errorMessage = 'Invalid email or password. Please try again.';

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Invalid credentials. Check your email and password.';
        } else if (err.response.status === 403) {
          errorMessage = 'Account not activated. Check your email for verification.';
        } else if (err.response.status === 404) {
          errorMessage = 'User not found. Please register first.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Is your backend running?';
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
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #6366f1 100%)',
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
                    className="bg-gradient-indigo rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-lg"
                    style={{
                      width: '90px',
                      height: '90px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    }}
                  >
                    <i className="bi bi-person-fill text-white fs-1"></i>
                  </div>
                  <h3 className="fw-bold text-white mb-2">User Login</h3>
                  <p className="text-white-50 fs-6">
                    Access your personal TTDS data space
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
                      Email Address
                    </Form.Label>
                    <InputGroup size="lg">
                      <InputGroup.Text className="bg-transparent border-indigo text-indigo">
                        <i className="bi bi-envelope-at"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="user@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-dark border-indigo text-white shadow-sm"
                        required
                        disabled={loading}
                        autoFocus
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-5">
                    <Form.Label className="text-white fw-semibold">
                      Password
                    </Form.Label>
                    <InputGroup size="lg">
                      <InputGroup.Text className="bg-transparent border-indigo text-indigo">
                        <i className="bi bi-lock-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-dark border-indigo text-white shadow-sm"
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
                        : 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
                      border: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login as User
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <small className="text-white-50">
                    Not registered yet?{' '}
                    <a href="/userregister" className="text-indigo fw-semibold text-decoration-underline">
                      Create an account
                    </a>
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

export default UserLogin;