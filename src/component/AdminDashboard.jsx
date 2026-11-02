import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Card, Button, Alert, Navbar, Nav, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const navigate = useNavigate();
  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #450a0a 0%, #dc2626 100%)', color: 'white' }}>
      <Navbar bg="dark" variant="dark" className="shadow-lg py-3 border-bottom border-danger">
        <Container fluid>
          <Navbar.Brand className="fw-bold fs-4 text-danger">
            <i className="bi bi-shield-fill-exclamation me-2"></i> ADMIN CONTROL CENTER
          </Navbar.Brand>
          <Nav className="mx-auto gap-2">
            <Button
              variant="outline-danger"
              className="px-4 fw-bold"
              onClick={() => navigate('/adminusers')}
            >
              <i className="bi bi-people-fill me-2"></i>
              User Data
            </Button>

            <Button
              variant="outline-danger"
              className="px-4 fw-bold"
              onClick={() => navigate('/adminproviders')}
            >
              <i className="bi bi-person-badge-fill me-2"></i>
              Data Providers
            </Button>

            <Button
              variant="outline-danger"
              className="px-4 fw-bold"
              onClick={() => navigate('/adminrequests')}
            >
              <i className="bi bi-check2-all me-2"></i>
              Approve Requests
            </Button>

            <Button
              variant="outline-danger"
              className="px-4 fw-bold"
              onClick={() => navigate('/adminfiles')}
            >
              <i className="bi bi-folder-fill me-2"></i>
              File Data
            </Button>
          </Nav>
          <Nav className="ms-auto">
          
            <Button variant="outline-light" onClick={()=>navigate('/')}> Logout</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="py-5">
        <Alert variant="danger" className="border-0 shadow">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Administrator Session Active</strong> — All actions are logged.
        </Alert>

        <Row className="mb-5">
          <Col>
            <h1 className="display-4 fw-bold">System Governance Dashboard</h1>
            <p className="lead text-white-50">Global oversight of TTDS infrastructure</p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={3}>
            <Card className="bg-danger bg-opacity-20 border-danger shadow-lg text-center p-4">
              <i className="bi bi-cpu-fill fs-1 mb-3 text-danger"></i>
              <h4>98.7%</h4>
              <p>System Health</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="bg-warning bg-opacity-20 border-warning shadow-lg text-center p-4">
              <i className="bi bi-activity fs-1 mb-3 text-warning"></i>
              <h4>4,821</h4>
              <p>Active Transfers</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="bg-info bg-opacity-20 border-info shadow-lg text-center p-4">
              <i className="bi bi-people-fill fs-1 mb-3 text-info"></i>
              <h4>312</h4>
              <p>Registered Entities</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="bg-success bg-opacity-20 border-success shadow-lg text-center p-4">
              <i className="bi bi-shield-check fs-1 mb-3 text-success"></i>
              <h4>Zero</h4>
              <p>Security Incidents</p>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={6}>
            <Card className="shadow-lg border-0 bg-dark bg-opacity-50">
              <Card.Header className="bg-danger text-white">
                <h5><i className="bi bi-tools me-2"></i> Admin Tools</h5>
              </Card.Header>
              <Card.Body className="d-grid gap-3">
                <Button variant="danger" size="lg">View Full Audit Trail</Button>
                <Button variant="warning" size="lg">Manage Participants</Button>
                <Button variant="secondary" size="lg">Compliance Reports</Button>
                <Button variant="dark" size="lg">System Configuration</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-lg border-0 bg-dark bg-opacity-50">
              <Card.Header className="bg-danger text-white">
                <h5><i className="bi bi-bell-fill me-2"></i> Recent Alerts</h5>
              </Card.Header>
              <Card.Body>
                <p className="text-success"><strong>No critical alerts</strong> at this time.</p>
                <small className="text-white-50">Last compliance scan: 2 minutes ago</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboard;