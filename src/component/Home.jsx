import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Navbar, Nav, Button, Row, Col, Card, ProgressBar, Badge, Alert, Form } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



function Home() {
  const [activeTransfers, setActiveTransfers] = useState(1248);
  const [complianceRate, setComplianceRate] = useState(99.9);
  const [liveData, setLiveData] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();


  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTransfers(prev => prev + Math.floor(Math.random() * 10));
      setLiveData(prev => [
        ...prev.slice(0, 4),
        {
          id: Date.now(),
          from: ['EU', 'US', 'APAC', 'MEA'][Math.floor(Math.random() * 4)],
          to: ['EU', 'US', 'APAC', 'MEA'][Math.floor(Math.random() * 4)],
          status: ['Completed', 'In Progress', 'Verified'][Math.floor(Math.random() * 3)],
          size: `${Math.floor(Math.random() * 1000)} GB`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Compliance status indicator
  const getComplianceStatus = () => {
    if (complianceRate >= 99) return { variant: 'success', text: 'Excellent' };
    if (complianceRate >= 95) return { variant: 'warning', text: 'Good' };
    return { variant: 'danger', text: 'Needs Attention' };
  };

  return (
    <>
      {/* Enhanced Navbar */}
      <Navbar variant="dark" expand="lg" sticky="top" className="py-3 shadow-lg" style={{ backgroundColor: '#000000ff' }}>
        <Container>
          <Navbar.Brand href="/" className="fw-bold fs-3 d-flex align-items-center">
            <div className="bg-primary rounded-circle p-2 me-2">
              <i className="bi bi-shield-check text-white"></i>
            </div>
            TTDS Platform
          </Navbar.Brand>

          {/* Live Status Badge */}
          <div className="d-none d-lg-block">
            <Badge bg="success" pill className="px-3 py-2">
              <i className="bi bi-circle-fill me-2"></i>
              LIVE • {activeTransfers} Active Transfers
            </Badge>
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link href="#home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} className="mx-3 fw-medium">
                <i className="bi bi-house-door me-1"></i> Home
              </Nav.Link>
              <Nav.Link href="#features" active={activeTab === 'features'} onClick={() => setActiveTab('features')} className="mx-3 fw-medium">
                <i className="bi bi-stack me-1"></i> Features
              </Nav.Link>
              <Nav.Link href="#about" active={activeTab === 'about'} onClick={() => setActiveTab('about')} className="mx-3 fw-medium">
                <i className="bi bi-info-circle me-1"></i> About
              </Nav.Link>
              <Nav.Link href="#contact" active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} className="mx-3 fw-medium">
                <i className="bi bi-envelope me-1"></i> Contact
              </Nav.Link>
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-light"
                  className="mx-3 px-4"
                  id="dropdown-login"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0"
                  style={{
                    minWidth: '260px',
                    marginTop: '10px',
                    backgroundColor: '#1e2125',
                  }}
                >
                  <div className="px-3 py-2 border-bottom border-secondary">
                    <small className="text-white fw-semibold">Select Login Type</small>
                  </div>

                  {/* User */}
                  <Dropdown.Item
                    onClick={() => navigate('/userlogin')}
                    className="text-light py-3 px-4 d-flex align-items-center"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="bi bi-person text-primary fs-5"></i>
                    </div>
                    <div>
                      <div className="fw-bold">User</div>
                      <small className="text-white-50">Access data and services</small>
                    </div>
                    <i className="bi bi-chevron-right text-white-50 ms-auto"></i>
                  </Dropdown.Item>

                  {/* Data Provider */}
                  <Dropdown.Item
                    onClick={() => navigate('/dataproviderlogin')}
                    className="text-light py-3 px-4 d-flex align-items-center"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="bi bi-database text-success fs-5"></i>
                    </div>
                    <div>
                      <div className="fw-bold">Data Provider</div>
                      <small className="text-white-50">Manage and share datasets</small>
                    </div>
                    <i className="bi bi-chevron-right text-white-50 ms-auto"></i>
                  </Dropdown.Item>

                  {/* Key Authority */}
                  <Dropdown.Item
                    onClick={() => navigate('/keyauthoritylogin')}
                    className="text-light py-3 px-4 d-flex align-items-center"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="bi bi-key text-warning fs-5"></i>
                    </div>
                    <div>
                      <div className="fw-bold">Key Authority</div>
                      <small className="text-white-50">Manage encryption keys</small>
                    </div>
                    <i className="bi bi-chevron-right text-white-50 ms-auto"></i>
                  </Dropdown.Item>

                  {/* Admin */}
                  <Dropdown.Item
                    onClick={() => navigate('/adminlogin')}
                    className="text-light py-3 px-4 d-flex align-items-center"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="bi bi-shield-check text-danger fs-5"></i>
                    </div>
                    <div>
                      <div className="fw-bold">Administrator</div>
                      <small className="text-white-50">System management</small>
                    </div>
                    <i className="bi bi-chevron-right text-white-50 ms-auto"></i>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section with Live Dashboard */}
      <section id="home" className="position-relative overflow-hidden text-white" 
  style={{ 
    minHeight: '95vh', 
    background: 'linear-gradient(135deg, #061E29 0%, #4D2B8C 50%, #0F2854 100%)',
    display: 'flex',
    alignItems: 'center'
  }}>
  
  {/* Optional subtle animated background overlay */}
  <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
    <div className="position-absolute top-0 end-0 w-50 h-50 bg-primary rounded-circle filter blur-3xl animate-pulse"></div>
    <div className="position-absolute bottom-0 start-0 w-75 h-75 bg-purple rounded-circle filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
  </div>

  <Container className="position-relative z-2 py-5">
    <Row className="align-items-center gy-5">
      {/* Left Content */}
      <Col lg={7}>
        <div className="animate__animated animate__fadeInUp">
          <Badge 
            bg="primary" 
            className="mb-4 px-4 py-3 rounded-pill shadow-lg border border-primary border-opacity-50"
            style={{ background: 'rgba(99, 102, 241, 0.3)', backdropFilter: 'blur(10px)' }}
          >
            <i className="bi bi-broadcast-pin me-2 fs-5"></i>
            <strong>LIVE • REAL-TIME PLATFORM</strong>
          </Badge>

          <h1 className="display-3 fw-bold mb-4 lh-1">
            Transaction-Border<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
              Trusted Data Spaces
            </span>
          </h1>

          <p className="lead mb-5 text-white-50" style={{ maxWidth: '620px', fontSize: '1.15rem' }}>
            A next-generation framework enabling secure, traceable, and fully compliant international data circulation 
            using zero-trust architecture, IPv6 monitoring, smart contracts, and AI-powered multi-jurisdictional compliance.
          </p>

          {/* Live Metrics Cards */}
          <Row className="g-4 mb-5">
            <Col md={4}>
              <div className="text-center p-4 rounded-4 shadow-lg border border-primary border-opacity-30"
                style={{ background: 'rgba(59, 130, 246, 0.15)', backdropFilter: 'blur(12px)' }}>
                <h3 className="fw-bold text-cyan-400 mb-1" style={{ fontSize: '2.5rem' }}>
                  {activeTransfers.toLocaleString()}
                  <span className="text-success ms-2 fs-4">+</span>
                </h3>
                <p className="text-white-50 mb-0">Active Transfers</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center p-4 rounded-4 shadow-lg border border-success border-opacity-30"
                style={{ background: 'rgba(34, 197, 94, 0.15)', backdropFilter: 'blur(12px)' }}>
                <h3 className="fw-bold text-green-400 mb-1" style={{ fontSize: '2.5rem' }}>
                  {complianceRate}%
                </h3>
                <p className="text-white-50 mb-0">Compliance Rate</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center p-4 rounded-4 shadow-lg border border-info border-opacity-30"
                style={{ background: 'rgba(14, 165, 233, 0.15)', backdropFilter: 'blur(12px)' }}>
                <h3 className="fw-bold text-sky-400 mb-1" style={{ fontSize: '2.5rem' }}>
                  24/7
                </h3>
                <p className="text-white-50 mb-0">Live Monitoring</p>
              </div>
            </Col>
          </Row>

          {/* CTA Buttons */}
          <div>
            <Button 
              variant="primary" 
              size="lg" 
              className="me-4 px-5 py-3 shadow-lg rounded-pill border-0"
              style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', fontWeight: '600' }}
            >
              <i className="bi bi-play-circle-fill me-2"></i>
              Watch Live Demo
            </Button>
            <Button 
              variant="outline-light" 
              size="lg" 
              className="px-5 py-3 rounded-pill shadow"
              style={{ borderColor: '#6366f1' }}
            >
              <i className="bi bi-file-earmark-text me-2"></i>
              View Documentation
            </Button>
          </div>
        </div>
      </Col>

      {/* Right Side: Live Data Monitor */}
      <Col lg={5}>
        <Card 
          className="border-0 shadow-2xl h-100 overflow-hidden"
          style={{ 
            background: 'rgba(15, 20, 35, 0.7)', 
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}
        >
          <Card.Header 
            className="text-white border-0 py-4 text-center"
            style={{ 
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
            }}
          >
            <h5 className="mb-0 fw-bold fs-4">
              <i className="bi bi-activity me-3 fs-3"></i>
              Live Data Flow Monitor
            </h5>
            <small className="d-block mt-1 opacity-75">
              <span className="text-success fw-bold">● ONLINE</span> • Real-time Global Transfers
            </small>
          </Card.Header>

          <Card.Body className="p-4">
            {/* Compliance Progress */}
            <div className="mb-4 p-3 rounded-3" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-medium">Global Compliance Score</span>
                <Badge bg="success" className="fs-6 px-3 py-2 shadow-sm">
                  {getComplianceStatus().text}
                </Badge>
              </div>
              <ProgressBar 
                now={complianceRate} 
                variant="success" 
                animated 
                striped 
                className="h-4 rounded-pill overflow-visible"
                style={{ backgroundColor: '#13432a' }}
              />
            </div>

            {/* Recent Transactions */}
            <h6 className="text-cyan-300 mb-3 fw-semibold">
              <i className="bi bi-arrow-left-right me-2"></i>
              Recent Cross-Border Transfers
            </h6>
            <div 
              className="rounded-3 p-3" 
              style={{ 
                maxHeight: '320px', 
                overflowY: 'auto',
                background: 'rgba(0, 0, 0, 0.3)'
              }}
            >
              {liveData.length === 0 ? (
                <p className="text-center text-white-50 py-5 mb-0">
                  <i className="bi bi-hourglass-split fs-3 d-block mb-3"></i>
                  Waiting for new transfers...
                </p>
              ) : (
                liveData.map((item, index) => (
                  <div 
                    key={item.id || index} 
                    className="d-flex justify-content-between align-items-center py-3 border-bottom border-secondary border-opacity-30"
                  >
                    <div>
                      <div className="fw-semibold text-white">
                        {item.from} <i className="bi bi-arrow-right mx-2 text-primary"></i> {item.to}
                      </div>
                      <small className="text-white-50">
                        {item.size} • {item.timestamp}
                      </small>
                    </div>
                    <Badge 
                      bg={
                        item.status === 'Completed' ? 'success' :
                        item.status === 'In Progress' ? 'warning' : 'info'
                      } 
                      pill 
                      className="shadow-sm px-3"
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
</section>

      {/* Features Section - Enhanced */}
      <section id="features" className="py-5 bg-gradient">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Core Capabilities</h2>
            <p className="lead text-muted">Built for trust in global data ecosystems</p>
          </div>

          <Row className="g-4">
            {/* Feature 1 */}
            <Col lg={4} md={6}>
              <Card className="h-100 border-0 shadow-lg hover-shadow transition-all">
                <Card.Body className="p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '70px', height: '70px' }}>
                    <i className="bi bi-shield-lock fs-2 text-primary"></i>
                  </div>
                  <Card.Title className="h4 mb-3">Zero-Trust Identity</Card.Title>
                  <Card.Text className="text-muted">
                    Secure participant verification using AWS IAM and IDS standards for trusted cross-border access.
                  </Card.Text>
                  <ul className="list-unstyled mt-3">
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Multi-factor Authentication</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Dynamic Access Policies</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Real-time Threat Detection</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            {/* Feature 2 */}
            <Col lg={4} md={6}>
              <Card className="h-100 border-0 shadow-lg hover-shadow transition-all">
                <Card.Body className="p-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '70px', height: '70px' }}>
                    <i className="bi bi-graph-up-arrow fs-2 text-success"></i>
                  </div>
                  <Card.Title className="h4 mb-3">Full Traceability</Card.Title>
                  <Card.Text className="text-muted">
                    IPv6-based monitoring with real-time logs and audit trails for complete data provenance.
                  </Card.Text>
                  <ul className="list-unstyled mt-3">
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>End-to-End Audit Trail</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Real-time Monitoring</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Compliance Reporting</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            {/* Feature 3 */}
            <Col lg={4} md={6}>
              <Card className="h-100 border-0 shadow-lg hover-shadow transition-all">
                <Card.Body className="p-4">
                  <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '70px', height: '70px' }}>
                    <i className="bi bi-file-check fs-2 text-warning"></i>
                  </div>
                  <Card.Title className="h4 mb-3">Smart Compliance</Card.Title>
                  <Card.Text className="text-muted">
                    NLP-powered rule engine and smart contracts ensure automatic multi-jurisdictional compliance.
                  </Card.Text>
                  <ul className="list-unstyled mt-3">
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>GDPR & CCPA Ready</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Automated Compliance Checks</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Smart Contract Enforcement</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h2 className="display-5 fw-bold mb-4">About TTDS Platform</h2>
              <p className="lead text-muted mb-4">
                The Trans-Border Trusted Data Spaces (TTDS) platform revolutionizes international data exchange through cutting-edge security and compliance technologies.
              </p>
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Our Mission</h5>
                <p>
                  To enable seamless, secure, and compliant cross-border data circulation while maintaining sovereignty and trust between international entities.
                </p>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary rounded-circle p-2 me-3">
                  <i className="bi bi-check-lg text-white fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Enterprise Grade Security</h6>
                  <p className="text-muted mb-0">Military-grade encryption and zero-trust architecture</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-success rounded-circle p-2 me-3">
                  <i className="bi bi-check-lg text-white fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Global Compliance</h6>
                  <p className="text-muted mb-0">Automated compliance with 50+ international regulations</p>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Technology Stack</h5>
                  <Row className="g-3">
                    {['AWS Cloud', 'Blockchain', 'Smart Contracts', 'IPv6', 'NLP Engine', 'Zero Trust'].map((tech, index) => (
                      <Col md={6} key={index}>
                        <div className="d-flex align-items-center bg-white border rounded-3 p-3">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-cpu text-primary"></i>
                          </div>
                          <span className="fw-medium">{tech}</span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-dark text-white">
        <Container>
          <Row className="mb-5">
            <Col md={8} className="mx-auto text-center">
              <h2 className="display-5 fw-bold mb-3">Contact Us</h2>
              <p className="lead text-light mb-4">
                Ready to transform your cross-border data exchange? Get in touch with our experts.
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={4} className="mb-5 mb-lg-0">
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary rounded-circle p-2 me-3">
                    <i className="bi bi-envelope text-white"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Email</h6>
                    <p className="text-muted mb-0">contact@ttds-platform.com</p>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary rounded-circle p-2 me-3">
                    <i className="bi bi-telephone text-white"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Phone</h6>
                    <p className="text-muted mb-0">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary rounded-circle p-2 me-3">
                    <i className="bi bi-clock text-white"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Support Hours</h6>
                    <p className="text-muted mb-0">24/7 Global Support</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={8}>
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-4">
                  <Form>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group controlId="formName">
                          <Form.Label>Name</Form.Label>
                          <Form.Control type="text" placeholder="Enter your name" />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="formEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control type="email" placeholder="Enter your email" />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="formCompany">
                          <Form.Label>Company</Form.Label>
                          <Form.Control type="text" placeholder="Your organization" />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="formCountry">
                          <Form.Label>Country</Form.Label>
                          <Form.Control type="text" placeholder="Your country" />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group controlId="formMessage">
                          <Form.Label>Message</Form.Label>
                          <Form.Control as="textarea" rows={4} placeholder="Tell us about your data exchange needs..." />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Button variant="primary" size="lg" className="w-100">
                          <i className="bi bi-send me-2"></i>Send Message
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-darker text-white py-5">
        <Container>
          <Row className="mb-5">
            <Col md={4} className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary rounded-circle p-2 me-2">
                  <i className="bi bi-shield-check text-white"></i>
                </div>
                <h5 className="fw-bold mb-0">TTDS Platform</h5>
              </div>
              <p className="text-white mb-4">
                Enabling secure and trustworthy international data circulation for the global digital economy.
              </p>
              <div className="d-flex">
                {['twitter', 'linkedin', 'github', 'slack'].map((social, index) => (
                  <Button key={index} variant="outline-light" size="sm" className="rounded-circle me-2">
                    <i className={`bi bi-${social}`}></i>
                  </Button>
                ))}
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <h5 className="fw-bold mb-4">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#home" className="text-white text-decoration-none hover-text-white">
                    <i className="bi bi-chevron-right me-2"></i>Home
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#features" className="text-white text-decoration-none hover-text-white">
                    <i className="bi bi-chevron-right me-2"></i>Features
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#about" className="text-white text-decoration-none hover-text-white">
                    <i className="bi bi-chevron-right me-2"></i>About
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#contact" className="text-white text-decoration-none hover-text-white">
                    <i className="bi bi-chevron-right me-2"></i>Contact
                  </a>
                </li>
              </ul>
            </Col>
            <Col md={4}>
              <h5 className="fw-bold mb-4">Powered By</h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {['AWS', 'IDS', 'IPv6', 'Blockchain', 'NLP', 'AI'].map((tech, index) => (
                  <Badge key={index} bg="secondary" className="px-3 py-2">
                    {tech}
                  </Badge>
                ))}
              </div>
              <Alert variant="dark" className="border-secondary">
                <small className="text-muted">
                  <i className="bi bi-shield-exclamation me-2"></i>
                  ISO 27001 Certified • GDPR Compliant • SOC 2 Type II
                </small>
              </Alert>
            </Col>
          </Row>
          <hr className="border-secondary" />
          <Row className="mt-4">
            <Col md={6}>
              <p className="text-white small mb-0">
                © 2026 Trans-Border Trusted Data Spaces. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <p className="text-white small mb-0">
                <a href="#" className="text-white text-decoration-none me-3">Privacy Policy</a>
                <a href="#" className="text-white text-decoration-none">Terms of Service</a>
              </p>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Add custom styles */}
      <style>{`
          @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.1); }
    }
    .filter.blur-3xl {
      filter: blur(100px);
    }
    .animate-pulse {
      animation: pulse 8s infinite ease-in-out;
    }
    .bg-gradient-to-r {
      background-clip: text;
      -webkit-background-clip: text;
    }
    .text-transparent {
      color: transparent;
    }
    .shadow-2xl {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }
        .hover-shadow:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .bg-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .bg-gradient .card {
          background: rgba(255, 255, 255, 0.95);
        }
        .bg-gradient .text-muted {
          color: #29689eff !important;
        }
        .hover-text-white:hover {
          color: white !important;
        }
        .bg-darker {
          background-color: #0d1117 !important;
        }
           .hover-item:hover {
    background-color: #2c3036 !important;
    transform: translateX(5px);
    transition: all 0.2s ease;
  }
  
  .dropdown-item:focus {
    background-color: transparent !important;
  }
  
  .dropdown-menu {
    backdrop-filter: blur(10px);
  }
      `}</style>
    </>
  );
}

export default Home;