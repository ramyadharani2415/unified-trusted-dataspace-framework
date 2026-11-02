import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  Badge,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === '12345') {
      navigate('/admindashboard');
    } else {
      alert('❌ Invalid Admin Credentials');
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background:
          'linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #dc2626 100%)',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card
              className="border-0 shadow-lg position-relative"
              style={{
                background: 'rgba(15, 20, 35, 0.9)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* 🔙 Back Button */}
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => navigate(-1)}
                className="position-absolute"
                style={{ top: '20px', left: '20px' }}
              >
                <i className="bi bi-arrow-left me-1"></i> Back
              </Button>

              <Card.Body className="p-5">
                <div className="text-center mb-5">
                  <div
                    className="bg-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-4 position-relative"
                    style={{ width: '90px', height: '90px' }}
                  >
                    <i className="bi bi-shield-fill-exclamation text-white fs-1"></i>
                    <Badge
                      bg="light"
                      text="danger"
                      className="position-absolute end-0 bottom-0 rounded-pill"
                    >
                      ADMIN
                    </Badge>
                  </div>
                  <h3 className="fw-bold text-white">
                    Administrator Login
                  </h3>
                  <p className="text-white-50">
                    System governance and monitoring
                  </p>
                </div>

                <Form onSubmit={handleLogin}>
                  {/* Username */}
                  <Form.Group className="mb-4">
                    <Form.Label className="text-white">
                      Admin Username
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-transparent border-danger text-white">
                        <i className="bi bi-person-badge-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin"
                        className="bg-dark border-danger text-white"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-4">
                    <Form.Label className="text-white">
                      Master Password
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-transparent border-danger text-white">
                        <i className="bi bi-pass-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="12345"
                        className="bg-dark border-danger text-white"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="danger"
                    size="lg"
                    className="w-100 rounded-pill py-3 shadow fw-bold"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Admin Access Login
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <small className="text-danger fw-bold">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Restricted Access Only
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

export default AdminLogin;
