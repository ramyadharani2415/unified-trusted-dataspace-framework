import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  Container, Row, Col, Card, Form, Button, InputGroup,
  Alert, Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: '',
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    country: ''
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_id.trim()) newErrors.user_id = 'User ID is required';
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.country || formData.country === 'Select Country') {
      newErrors.country = 'Please select a country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setServerError('');
    setSuccess('');

    // EXACT SAME PAYLOAD AS YOUR WORKING POSTMAN REQUEST
    const payload = {
      userId: formData.user_id.trim(),
      fullName: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      mobile: formData.mobile.trim() || null,
      country: formData.country
    };

    console.log('Sending payload (matches Postman):', payload);

    try {
      const response = await axios.post(
        'http://localhost:2021/api/users/register',
        payload,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log('Success response:', response.data);

      // Your backend returns plain text "User registered successfully"
      if (response.status === 200) {
        setSuccess('User registered successfully! Redirecting to login...');

        setTimeout(() => {
          navigate('/userlogin');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);

      let message = 'Registration failed. Please try again.';

      if (err.response) {
        if (err.response.status === 500) {
          message = 'Server error. Check if User ID or Email already exists.';
        } else if (err.response.data) {
          message = typeof err.response.data === 'string' 
            ? err.response.data 
            : err.response.data.message || message;
        }
      } else if (err.code === 'ERR_NETWORK') {
        message = 'Cannot connect to server. Is backend running?';
      }

      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    'Select Country',
    'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Japan', 'China', 'India', 'Brazil',
    'Singapore', 'South Korea', 'Netherlands', 'Switzerland',
    'Sweden', 'Norway', 'Denmark', 'Finland', 'United Arab Emirates'
  ];

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
          <Col md={9} lg={7} xl={6}>
            <Card
              className="border-0 shadow-2xl overflow-hidden position-relative"
              style={{
                background: 'rgba(15, 25, 45, 0.94)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px'
              }}
            >
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => navigate('/userlogin')}
                className="position-absolute rounded-pill"
                style={{ top: '20px', left: '20px', zIndex: 10 }}
              >
                <i className="bi bi-arrow-left me-1"></i> Back to Login
              </Button>

              <Card.Body className="p-5">
                <div className="text-center mb-5">
                  <div
                    className="bg-gradient-indigo rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-lg"
                    style={{
                      width: '90px',
                      height: '90px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    }}
                  >
                    <i className="bi bi-person-plus-fill text-white fs-1"></i>
                  </div>
                  <h3 className="fw-bold text-white mb-2">Create Your Account</h3>
                  <p className="text-white-50 fs-6">
                    Join TTDS and access healthcare datasets
                  </p>
                </div>

                {success && (
                  <Alert variant="success" className="mb-4 text-center">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {success}
                  </Alert>
                )}

                {serverError && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Error:</strong> {serverError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-white fw-semibold">User ID *</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-transparent border-indigo text-indigo">
                            <i className="bi bi-person-badge"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="user_id"
                            placeholder="USER001"
                            value={formData.user_id}
                            onChange={handleChange}
                            className={`bg-dark border-indigo text-white ${errors.user_id ? 'border-danger' : ''}`}
                            disabled={loading}
                          />
                        </InputGroup>
                        {errors.user_id && <small className="text-danger">{errors.user_id}</small>}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-white fw-semibold">Full Name *</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-transparent border-indigo text-indigo">
                            <i className="bi bi-person"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="full_name"
                            placeholder="Rahul Sharma"
                            value={formData.full_name}
                            onChange={handleChange}
                            className={`bg-dark border-indigo text-white ${errors.full_name ? 'border-danger' : ''}`}
                            disabled={loading}
                          />
                        </InputGroup>
                        {errors.full_name && <small className="text-danger">{errors.full_name}</small>}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mt-3">
                    <Form.Label className="text-white fw-semibold">Email Address *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-transparent border-indigo text-indigo">
                        <i className="bi bi-envelope-at"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="rahul@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`bg-dark border-indigo text-white ${errors.email ? 'border-danger' : ''}`}
                        disabled={loading}
                      />
                    </InputGroup>
                    {errors.email && <small className="text-danger">{errors.email}</small>}
                  </Form.Group>

                  <Row className="g-3 mt-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-white fw-semibold">Password *</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-transparent border-indigo text-indigo">
                            <i className="bi bi-lock-fill"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="password"
                            name="password"
                            placeholder="rahul@123"
                            value={formData.password}
                            onChange={handleChange}
                            className={`bg-dark border-indigo text-white ${errors.password ? 'border-danger' : ''}`}
                            disabled={loading}
                          />
                        </InputGroup>
                        {errors.password && <small className="text-danger">{errors.password}</small>}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-white fw-semibold">Confirm Password *</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-transparent border-indigo text-indigo">
                            <i className="bi bi-shield-check"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`bg-dark border-indigo text-white ${errors.confirmPassword ? 'border-danger' : ''}`}
                            disabled={loading}
                          />
                        </InputGroup>
                        {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="g-3 mt-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-white fw-semibold">Mobile Number</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-transparent border-indigo text-indigo">
                            <i className="bi bi-phone"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="tel"
                            name="mobile"
                            placeholder="9876543210"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="bg-dark border-indigo text-white"
                            disabled={loading}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-white fw-semibold">Country *</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-transparent border-indigo text-indigo">
                            <i className="bi bi-globe"></i>
                          </InputGroup.Text>
                          <Form.Select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`bg-dark border-indigo text-white ${errors.country ? 'border-danger' : ''}`}
                            disabled={loading}
                          >
                            {countries.map((country, i) => (
                              <option key={i} value={country === 'Select Country' ? '' : country}>
                                {country}
                              </option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                        {errors.country && <small className="text-danger">{errors.country}</small>}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-100 rounded-pill py-3 mt-4 fw-bold shadow-lg"
                    disabled={loading}
                    style={{
                      background: loading ? '#495057' : 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
                      border: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus-fill me-2"></i>
                        Create Account
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <small className="text-white-50">
                    Already have an account?{' '}
                    <Button
                      variant="link"
                      className="text-indigo p-0 fw-semibold text-decoration-underline"
                      onClick={() => navigate('/userlogin')}
                    >
                      Sign In Here
                    </Button>
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

export default UserRegister;