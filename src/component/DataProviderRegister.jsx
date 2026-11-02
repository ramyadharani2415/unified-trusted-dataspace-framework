import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  Container, Row, Col, Card, Form, Button, InputGroup,
  Alert, Spinner, FormCheck
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DataProviderRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    provider_id: '',
    provider_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    country: ''
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.provider_id.trim()) newErrors.provider_id = 'Provider ID is required';
    if (!formData.provider_name.trim()) newErrors.provider_name = 'Organization name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.mobile.trim()) newErrors.mobile = 'Contact number is required';
    if (!formData.country || formData.country === 'Select Country') newErrors.country = 'Please select a country';

    if (!acceptTerms) newErrors.terms = 'You must accept the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setServerError('');
    setSuccess('');

    // IMPORTANT: Use camelCase keys to match Java entity fields
    const payload = {
      providerId: formData.provider_id.trim(),        // ← matches @JsonProperty or field name
      providerName: formData.provider_name.trim(),    // ← matches providerName in Java
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      mobile: formData.mobile.trim(),
      country: formData.country
    };

    console.log('Sending payload:', payload); // Debug: check in browser console

    try {
      const response = await axios.post(
        'http://localhost:2021/api/dataprovider/register',
        payload,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

  if (response.status === 200) {
  setSuccess('Registration successful! Your account is under review. Redirecting to login...');
  setTimeout(() => navigate('/dataproviderlogin'), 3000);
} else {
  setServerError('Registration failed. Please try again.');
}

    } catch (err) {
      console.error('Registration error:', err);

      let message = 'Server error. Please try again later.';

      if (err.response?.status === 500) {
        message = 'Internal server error. Check if Provider ID is unique.';
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.code === 'ERR_NETWORK') {
        message = 'Cannot connect to server. Is your backend running?';
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
        background: 'linear-gradient(135deg, #0f172a 0%, #164e63 50%, #0891b2 100%)',
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
                onClick={() => navigate('/dataproviderlogin')}
                className="position-absolute rounded-pill"
                style={{ top: '20px', left: '20px', zIndex: 10 }}
              >
                <i className="bi bi-arrow-left me-1"></i> Back to Login
              </Button>

              <Card.Body className="p-5">
                <div className="text-center mb-5">
                  <div
                    className="bg-gradient-info rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-lg"
                    style={{
                      width: '90px',
                      height: '90px',
                      background: 'linear-gradient(135deg, #0891b2, #06b6d4)'
                    }}
                  >
                    <i className="bi bi-cloud-plus-fill text-white fs-1"></i>
                  </div>
                  <h3 className="fw-bold text-white mb-2">Register as Data Provider</h3>
                  <p className="text-white-50 fs-6">
                    Join our secure healthcare data marketplace
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
                        <Form.Label className="text-white fw-semibold">Provider ID *</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-transparent border-cyan text-cyan">
                            <i className="bi bi-hash"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="provider_id"
                            placeholder="healthcorp2025"
                            value={formData.provider_id}
                            onChange={handleChange}
                            className={`bg-dark border-cyan text-white ${errors.provider_id ? 'border-danger' : ''}`}
                            disabled={loading}
                          />
                        </InputGroup>
                        {errors.provider_id && <small className="text-danger">{errors.provider_id}</small>}
                        <Form.Text className="text-white-50">Unique ID (letters, numbers, underscores only)</Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-white fw-semibold">Organization Name *</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-transparent border-cyan text-cyan">
                            <i className="bi bi-building"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="provider_name"
                            placeholder="HealthCorp Research"
                            value={formData.provider_name}
                            onChange={handleChange}
                            className={`bg-dark border-cyan text-white ${errors.provider_name ? 'border-danger' : ''}`}
                            disabled={loading}
                          />
                        </InputGroup>
                        {errors.provider_name && <small className="text-danger">{errors.provider_name}</small>}
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Rest of form fields remain the same */}
                  <Form.Group className="mt-3">
                    <Form.Label className="text-white fw-semibold">Official Email *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-transparent border-cyan text-cyan">
                        <i className="bi bi-envelope-at"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="admin@healthcorp.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`bg-dark border-cyan text-white ${errors.email ? 'border-danger' : ''}`}
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
                          <InputGroup.Text className="bg-transparent border-cyan text-cyan">
                            <i className="bi bi-lock-fill"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="password"
                            name="password"
                            placeholder="Minimum 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                            className={`bg-dark border-cyan text-white ${errors.password ? 'border-danger' : ''}`}
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
                          <InputGroup.Text className="bg-transparent border-cyan text-cyan">
                            <i className="bi bi-shield-check"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`bg-dark border-cyan text-white ${errors.confirmPassword ? 'border-danger' : ''}`}
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
                        <Form.Label className="text-white fw-semibold">Contact Number *</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-transparent border-cyan text-cyan">
                            <i className="bi bi-telephone-fill"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="tel"
                            name="mobile"
                            placeholder="+1 (555) 000-0000"
                            value={formData.mobile}
                            onChange={handleChange}
                            className={`bg-dark border-cyan text-white ${errors.mobile ? 'border-danger' : ''}`}
                            disabled={loading}
                          />
                        </InputGroup>
                        {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-white fw-semibold">Country *</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-transparent border-cyan text-cyan">
                            <i className="bi bi-globe"></i>
                          </InputGroup.Text>
                          <Form.Select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`bg-dark border-cyan text-white ${errors.country ? 'border-danger' : ''}`}
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

                  <Form.Group className="mt-4">
                    <FormCheck
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      label={
                        <span className="text-white-50">
                          I agree to the <a href="#" className="text-info text-decoration-underline">Terms of Service</a> and <a href="#" className="text-info text-decoration-underline">Privacy Policy</a>
                        </span>
                      }
                    />
                    {errors.terms && <small className="text-danger d-block mt-1">{errors.terms}</small>}
                  </Form.Group>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-100 rounded-pill py-3 mt-4 fw-bold shadow-lg"
                    disabled={loading}
                    style={{
                      background: loading ? '#495057' : 'linear-gradient(90deg, #0891b2, #06b6d4, #0ea5e9)',
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
                        Register as Data Provider
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <small className="text-white-50">
                    Already registered?{' '}
                    <Button
                      variant="link"
                      className="text-info p-0 fw-semibold text-decoration-underline"
                      onClick={() => navigate('/dataproviderlogin')}
                    >
                      Login here
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

export default DataProviderRegister;