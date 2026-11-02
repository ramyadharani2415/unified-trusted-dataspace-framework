import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function KeyAuthorityLogin() {
  const navigate = useNavigate();

  const [authorityId, setAuthorityId] = useState('');
  const [masterKey, setMasterKey] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (authorityId === 'key123' && masterKey === '12345') {
      navigate('/keyauthority');
    } else {
      alert('❌ Invalid Key Authority Credentials');
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background:
          'linear-gradient(135deg, #7c2d12 0%, #9c4221 50%, #ea580c 100%)',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card
              className="border-0 shadow-lg position-relative"
              style={{
                background: 'rgba(15, 20, 35, 0.8)',
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
                    className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-shield-lock-fill text-white fs-1"></i>
                  </div>
                  <h3 className="fw-bold text-white">
                    Key Authority Login
                  </h3>
                  <p className="text-white-50">
                    Manage digital identities & certificates
                  </p>
                </div>

                <Form onSubmit={handleLogin}>
                  {/* Authority ID */}
                  <Form.Group className="mb-4">
                    <Form.Label className="text-white">
                      Authority ID
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-transparent border-warning text-white">
                        <i className="bi bi-patch-check-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={authorityId}
                        onChange={(e) => setAuthorityId(e.target.value)}
                        placeholder="key123"
                        className="bg-dark border-warning text-white"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  {/* Master Key */}
                  <Form.Group className="mb-4">
                    <Form.Label className="text-white">
                      Master Key
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-transparent border-warning text-white">
                        <i className="bi bi-fingerprint"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        value={masterKey}
                        onChange={(e) => setMasterKey(e.target.value)}
                        placeholder="12345"
                        className="bg-dark border-warning text-white"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="warning"
                    size="lg"
                    className="w-100 rounded-pill py-3 shadow text-dark fw-bold"
                  >
                    <i className="bi bi-shield-fill-check me-2"></i>
                    Authenticate Authority
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default KeyAuthorityLogin;
