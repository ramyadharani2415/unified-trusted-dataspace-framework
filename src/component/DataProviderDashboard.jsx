import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Navbar,
  Nav,
  Dropdown,
  ProgressBar
} from 'react-bootstrap';
import { useNavigate, Outlet } from 'react-router-dom';

function DataProviderDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: 'Data Provider',
    email: 'user@domain.com',
    organization: 'EuroHealth Organization'
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.name || parsedUser.providerName || 'Data Provider',
          email: parsedUser.email || 'user@domain.com',
          organization:
            parsedUser.organization ||
            parsedUser.providerOrganization ||
            'EuroHealth Organization'
        });
      } catch (error) {
        console.error('Session parse error:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/');
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #134e4a 0%, #0891b2 100%)',
        color: 'white'
      }}
    >
      {/* TOP NAVBAR */}
      <Navbar bg="dark" variant="dark" className="shadow-lg py-3">
        <Container fluid>
          <Navbar.Brand className="fw-bold fs-4">
            <i className="bi bi-cloud-upload-fill me-2 text-info"></i>
            Data Provider Portal
          </Navbar.Brand>

          <Nav className="ms-auto align-items-center">
            <Nav.Item className="me-4">
              <Badge bg="info" pill className="px-3 py-2 fs-6">
                <i className="bi bi-building me-2"></i>
                {user.organization}
              </Badge>
            </Nav.Item>

            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-light">
                <i className="bi bi-person-circle me-2"></i>
                {user.name}
              </Dropdown.Toggle>

              <Dropdown.Menu className="bg-dark border-secondary">
                <Dropdown.Header className="text-info">
                  {user.email}
                </Dropdown.Header>
             
                <Dropdown.Item
                  onClick={handleLogout}
                  className="text-danger fw-bold"
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>

      {/* MAIN LAYOUT */}
      <Container fluid>
        <Row>
          {/* SIDEBAR */}
          <Col md={3} lg={2} className="d-none d-md-block">
            <Card
              className="border-0 h-100"
              style={{
                background: 'rgba(20, 30, 50, 0.85)',
                minHeight: 'calc(100vh - 80px)'
              }}
            >
              <Card.Body className="p-4">
                <div className="text-center mb-5">
                  <i className="bi bi-cloud-upload-fill fs-1 text-info"></i>
                  <h6 className="mt-3">Provider Dashboard</h6>
                  <small className="text-white-50">v2.1.4</small>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-info"
                    onClick={() => navigate('/publishdata')}
                  >
                    <i className="bi bi-cloud-upload-fill me-2"></i>
                    Publish Data
                  </button>

                  <button
                    className="btn btn-outline-info"
                    onClick={() => navigate('/uploaddata')}
                  >
                    <i className="bi bi-database-fill me-2"></i>
                    Uploaded Data
                  </button>

                  <button
                    className="btn btn-outline-info"
                    onClick={() => navigate('/accessrequests')}
                  >
                    <i className="bi bi-inboxes-fill me-2"></i>
                    Access Requests
                    <Badge bg="warning" pill className="ms-2">
                      3
                    </Badge>
                  </button>
                </div>

                <div className="mt-5">
                  <small className="text-white-50">Storage Usage</small>
                  <ProgressBar now={68} variant="info" className="mt-2" />
                  <small className="text-white-50 d-block mt-1">
                    8.2 TB / 12 TB
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* MAIN CONTENT */}
          <Col md={9} lg={10} className="py-5 px-md-5">

            {/* HERO SECTION */}
            <Card
              className="border-0 shadow-lg text-white mb-5"
              style={{
                background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                borderRadius: '20px'
              }}
            >
              <Card.Body className="p-5">
                <Row className="align-items-center">
                  <Col md={8}>
                    <h2 className="fw-bold mb-3">
                      Welcome, {user.name} 👋
                    </h2>
                    <p className="fs-5">
                      Publish, manage, and monitor secure datasets for global
                      collaboration.
                    </p>
                    <p className="opacity-75">
                      Organization: <strong>{user.organization}</strong>
                    </p>
                  </Col>
                  <Col md={4} className="text-center">
                    <i className="bi bi-cloud-check-fill display-1 opacity-75"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* QUICK STATS */}
            <Row className="g-4 mb-5">
              <Col md={4}>
                <Card className="bg-dark text-white shadow border-0">
                  <Card.Body className="text-center">
                    <i className="bi bi-database-fill fs-1 text-info"></i>
                    <h4 className="mt-3">24</h4>
                    <small className="text-white-50">Uploaded Datasets</small>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="bg-dark text-white shadow border-0">
                  <Card.Body className="text-center">
                    <i className="bi bi-inboxes-fill fs-1 text-warning"></i>
                    <h4 className="mt-3">3</h4>
                    <small className="text-white-50">Pending Requests</small>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="bg-dark text-white shadow border-0">
                  <Card.Body className="text-center">
                    <i className="bi bi-hdd-network-fill fs-1 text-success"></i>
                    <h4 className="mt-3">68%</h4>
                    <small className="text-white-50">Storage Used</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* CHILD ROUTES */}
            <Outlet />
          </Col>
        </Row>
      </Container>

      {/* FOOTER */}
      <div className="bg-dark text-white-50 py-3 text-center">
        <small>
          TTDS Data Provider Portal v2.1.4 © 2026 {user.organization}
        </small>
      </div>
    </div>
  );
}

export default DataProviderDashboard;
