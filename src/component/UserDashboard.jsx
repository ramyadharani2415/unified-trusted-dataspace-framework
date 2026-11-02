import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { 
  Container, Row, Col, Card, Button, Table, Badge, ProgressBar, 
  Navbar, Nav, Tab, Tabs, Modal, Form, Alert 
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const navigate = useNavigate();

  // State for user email from sessionStorage
  const [userEmail, setUserEmail] = useState('');

  // Load user email from sessionStorage on mount
  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    } else {
      // Optional: redirect to login if no session
      // navigate('/');
    }
  }, []);

  // Sample data (same as before)
  const [availableDatasets] = useState([
    { id: 101, name: "Global Climate Data 2025", provider: "World Climate Org", size: "850 GB", type: "Environmental" },
    { id: 102, name: "EU Public Health Statistics", provider: "EuroHealth Org", size: "320 GB", type: "Healthcare" },
    { id: 103, name: "APAC Economic Indicators", provider: "AsiaDev Bank", size: "180 GB", type: "Finance" },
    { id: 104, name: "Smart City Traffic Data", provider: "UrbanTech Consortium", size: "1.2 TB", type: "IoT" },
  ]);

  const [requests] = useState([
    { id: 1, dataset: "EU Health Records 2025", provider: "EuroHealth Org", status: "Approved", progress: 100, downloadable: true },
    { id: 2, dataset: "Climate Sensor Data APAC", provider: "AsiaClimate Net", status: "Pending", progress: 60, downloadable: false },
    { id: 3, dataset: "Financial Transactions US", provider: "FedBank USA", status: "Approved", progress: 100, downloadable: true },
  ]);

  const [history] = useState([
    { id: 1001, dataset: "EU Health Records Q3", accessedOn: "2025-12-15", provider: "EuroHealth Org", size: "420 GB" },
    { id: 1002, dataset: "Global Temperature Archive", accessedOn: "2025-11-28", provider: "World Climate Org", size: "980 GB" },
  ]);

  // Modal state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [requestPurpose, setRequestPurpose] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  const handleRequestAccess = (dataset) => {
    setSelectedDataset(dataset);
    setShowRequestModal(true);
    setRequestSuccess(false);
  };

  const submitRequest = () => {
    setRequestSuccess(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setRequestPurpose('');
      setRequestSuccess(false);
    }, 2000);
  };

  const handleDownload = (datasetName) => {
    alert(`Secure download initiated for "${datasetName}"\n(This would trigger encrypted transfer in production)`);
  };

  // Logout handler - clears session and redirects
  const handleLogout = () => {
    sessionStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
      {/* Enhanced Navbar with Dynamic User Email */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-lg py-3">
        <Container fluid>
          <Navbar.Brand className="fw-bold fs-4">
            <i className="bi bi-person-circle me-2 text-primary"></i> TTDS User Portal
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="user-dashboard-nav" />
          <Navbar.Collapse id="user-dashboard-nav">
            <Nav className="mx-auto fw-medium">
              <Nav.Link active>
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/userviewalldata")}>
                <i className="bi bi-search me-1"></i> Browse Data
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/userdataDownload")}>
                <i className="bi bi-cloud-download me-1"></i> Downloads
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/userrequestsview")}>
                <i className="bi bi-clock-history me-1"></i> Access History
              </Nav.Link>
            </Nav>
            <Nav className="align-items-center">
              <Nav.Link className="text-white-50 me-3">
                <i className="bi bi-person-fill me-2"></i>
                {userEmail || 'User'}
              </Nav.Link>
              <Button variant="outline-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="py-5 px-4">
        <Row className="mb-5">
          <Col>
            <h1 className="display-5 fw-bold mb-3">
              Welcome back, {userEmail ? userEmail.split('@')[0] : 'User'}!
            </h1>
            <p className="lead text-white-50">Securely access trusted cross-border datasets</p>
          </Col>
        </Row>

        {/* Stats Overview */}
        <Row className="g-4 mb-5">
          <Col md={3}>
            <Card className="bg-primary bg-opacity-10 border-primary shadow h-100">
              <Card.Body className="text-center">
                <i className="bi bi-file-earmark-text fs-1 text-primary mb-3"></i>
                <h4 className="text-primary">12</h4>
                <p>Active Requests</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="bg-success bg-opacity-10 border-success shadow h-100">
              <Card.Body className="text-center">
                <i className="bi bi-check-circle fs-1 text-success mb-3"></i>
                <h4 className="text-success">48</h4>
                <p>Datasets Accessed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="bg-info bg-opacity-10 border-info shadow h-100">
              <Card.Body className="text-center">
                <i className="bi bi-shield-check fs-1 text-info mb-3"></i>
                <h4 className="text-info">99.9%</h4>
                <p>Compliance Score</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="bg-warning bg-opacity-10 border-warning shadow h-100">
              <Card.Body className="text-center">
                <i className="bi bi-hourglass-split fs-1 text-warning mb-3"></i>
                <h4 className="text-warning">3</h4>
                <p>Pending Approvals</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabs Section */}
        <Tabs defaultActiveKey="requests" className="mb-5 nav-tabs-custom" id="user-tabs">
          <Tab eventKey="requests" title={<><i className="bi bi-list-check me-2"></i>My Requests</>}>
            <Card className="mt-4 shadow-lg border-0" style={{ background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(12px)' }}>
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">My Data Access Requests</h5>
              </Card.Header>
              <Card.Body>
                <Table hover variant="dark" className="table-borderless">
                  <thead>
                    <tr>
                      <th>Dataset</th>
                      <th>Provider</th>
                      <th>Status</th>
                      <th>Progress</th>
                    
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(req => (
                      <tr key={req.id}>
                        <td className="fw-medium">{req.dataset}</td>
                        <td>{req.provider}</td>
                        <td>
                          <Badge bg={
                            req.status === 'Approved' ? 'success' :
                            req.status === 'Pending' ? 'warning' : 'info'
                          } pill>
                            {req.status}
                          </Badge>
                        </td>
                        <td>
                          <ProgressBar now={req.progress} variant="success" style={{ height: '10px' }} />
                        </td>
                       
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="browse" title={<><i className="bi bi-search me-2"></i>Browse Available Data</>}>
            <Card className="mt-4 shadow-lg border-0" style={{ background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(12px)' }}>
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Available Datasets in TTDS</h5>
              </Card.Header>
              <Card.Body>
                <Table hover variant="dark">
                  <thead>
                    <tr>
                      <th>Dataset Name</th>
                      <th>Provider</th>
                      <th>Size</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableDatasets.map(ds => (
                      <tr key={ds.id}>
                        <td className="fw-medium">{ds.name}</td>
                        <td>{ds.provider}</td>
                        <td>{ds.size}</td>
                        <td><Badge bg="secondary">{ds.type}</Badge></td>
                        <td>
                          <Button size="sm" variant="primary" onClick={() => handleRequestAccess(ds)}>
                            <i className="bi bi-key me-1"></i> Request Access
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="history" title={<><i className="bi bi-clock-history me-2"></i>Access History</>}>
            <Card className="mt-4 shadow-lg border-0" style={{ background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(12px)' }}>
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Your Data Access History</h5>
              </Card.Header>
              <Card.Body>
                <Table hover variant="dark">
                  <thead>
                    <tr>
                      <th>Dataset</th>
                      <th>Provider</th>
                      <th>Accessed On</th>
                      <th>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(item => (
                      <tr key={item.id}>
                        <td>{item.dataset}</td>
                        <td>{item.provider}</td>
                        <td>{item.accessedOn}</td>
                        <td>{item.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        <Row className="mt-5">
          <Col className="text-center">
            <Button size="lg" variant="primary" className="px-5 shadow-lg">
              <i className="bi bi-search me-2"></i> Explore Full Data Catalog
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Request Access Modal */}
      <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="bg-dark text-white border-0">
          <Modal.Title><i className="bi bi-key me-2"></i>Request Dataset Access</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {selectedDataset && (
            <>
              <h5 className="mb-3">{selectedDataset.name}</h5>
              <p className="text-white-50 mb-4">
                Provider: <strong>{selectedDataset.provider}</strong><br />
                Size: <strong>{selectedDataset.size}</strong> • Type: <Badge bg="secondary">{selectedDataset.type}</Badge>
              </p>
              {requestSuccess ? (
                <Alert variant="success" className="text-center py-4">
                  <i className="bi bi-check-circle-fill fs-1 d-block mb-3"></i>
                  <strong>Request Submitted Successfully!</strong>
                  <p className="mb-0 mt-2">You will be notified once approved.</p>
                </Alert>
              ) : (
                <Form>
                  <Form.Group>
                    <Form.Label>Purpose of Data Usage</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={requestPurpose}
                      onChange={(e) => setRequestPurpose(e.target.value)}
                      placeholder="Please describe your intended use (e.g., academic research, policy analysis, AI model training...)"
                      className="bg-secondary text-white border-0"
                    />
                    <Form.Text className="text-white-50">
                      This helps providers evaluate your request.
                    </Form.Text>
                  </Form.Group>
                </Form>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-0">
          {!requestSuccess && (
            <>
              <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={submitRequest} 
                disabled={!requestPurpose.trim()}
              >
                <i className="bi bi-send me-2"></i>Submit Request
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserDashboard;