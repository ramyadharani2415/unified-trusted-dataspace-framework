import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Card, Alert, Spinner, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function UserRequestsView() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Get logged-in user email (set during login)
  const userEmail = sessionStorage.getItem('userEmail'); // e.g. "shan@gmail.com"

  const navigate = useNavigate();

  useEffect(() => {
    if (!userEmail) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://localhost:2021/api/request/user/${encodeURIComponent(userEmail)}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }

        const data = await response.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Could not load your requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userEmail]);

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'KEY_AUTH_APPROVED':
        return <Badge bg="success" className="fs-6">Approved</Badge>;
      case 'PROVIDER_APPROVED':
        return <Badge bg="info" className="fs-6">Provider Approved</Badge>;
      case 'USER_REQUESTED':
        return <Badge bg="warning" text="dark" className="fs-6">Pending</Badge>;
      case 'REJECTED':
        return <Badge bg="danger" className="fs-6">Rejected</Badge>;
      default:
        return <Badge bg="secondary" className="fs-6">Unknown</Badge>;
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 70%, #6366f1 100%)',
      color: 'white'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} md={11}>
            <Card className="border-0 shadow-2xl overflow-hidden" style={{
              background: 'rgba(15, 20, 35, 0.9)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px'
            }}>
              <Card.Header className="text-center py-5 border-0 position-relative" style={{
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
              }}>
                <Button
                  variant="outline-light"
                  className="position-absolute start-0 top-50 translate-middle-y ms-4"
                  onClick={() => navigate(-1)}
                >
                  <i className="bi bi-arrow-left fs-4"></i>
                </Button>

                <h1 className="display-5 fw-bold mb-3">
                  <i className="bi bi-list-check me-3"></i>
                  My Data Access Requests
                </h1>
                <p className="lead mb-0 opacity-90">
                  View status of all your dataset access requests
                </p>
                <p className="mt-3 text-white-50">
                  <i className="bi bi-person-fill me-2"></i>
                  {userEmail}
                </p>
              </Card.Header>

              <Card.Body className="p-5">
                {loading && (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading your requests...</p>
                  </div>
                )}

                {error && (
                  <Alert variant="danger" className="text-center shadow">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Error:</strong> {error}
                  </Alert>
                )}

                {!loading && !error && requests.length === 0 && (
                  <Alert variant="info" className="text-center shadow-lg border-0">
                    <i className="bi bi-info-circle-fill fs-1 d-block mb-3"></i>
                    <h4>No Requests Found</h4>
                    <p className="mb-0">You haven't submitted any data access requests yet.</p>
                  </Alert>
                )}

                {!loading && !error && requests.length > 0 && (
                  <Row className="g-4">
                    {requests.map((req) => (
                      <Col md={6} key={req.id}>
                        <Card className="bg-dark border-0 shadow h-100 text-white">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h5 className="text-primary">
                                <i className="bi bi-database-fill me-2"></i>
                                {req.datasetName || 'Unknown Dataset'}
                              </h5>
                              {getStatusBadge(req.status)}
                            </div>

                            <hr className="border-secondary" />

                            <p><strong>Request ID:</strong> <code className="text-warning">{req.id}</code></p>
                            <p><strong>Provider:</strong> {req.providerEmail}</p>

                            {req.accessKey && req.status === 'KEY_AUTH_APPROVED' && (
                              <div className="mt-3">
                                <strong>Access Key:</strong>
                                <code className="d-block p-2 bg-black rounded text-success mt-1">
                                  {req.accessKey}
                                </code>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>

              <Card.Footer className="bg-dark text-center py-4 border-0">
                <small className="text-white-50">
                  <i className="bi bi-shield-lock me-2"></i>
                  All requests are securely logged • TTDS Platform
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UserRequestsView;
