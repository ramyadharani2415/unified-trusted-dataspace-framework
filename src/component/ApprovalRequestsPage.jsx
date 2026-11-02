import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Spinner, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ApprovalRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

useEffect(() => {
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:2021/api/request/all');

      if (!response.ok) {
        throw new Error('Failed to fetch data access requests');
      }

      const data = await response.json();

      // Ensure data is always an array
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  fetchRequests();
}, []);


  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('approved')) return <Badge bg="success">Approved</Badge>;
    if (s.includes('pending')) return <Badge bg="warning" text="dark">Pending</Badge>;
    if (s.includes('rejected')) return <Badge bg="danger">Rejected</Badge>;
    return <Badge bg="secondary">Unknown</Badge>;
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #450a0a 0%, #dc2626 100%)', color: 'white' }}>
      <Container fluid className="py-5">
        <Row className="mb-4">
          <Col className="d-flex align-items-center gap-3">
            <Button variant="outline-light" onClick={() => navigate('/admindashboard')}>
              <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
            </Button>
            <h2 className="mb-0"><i className="bi bi-check2-all me-2"></i>All Access Requests</h2>
          </Col>
        </Row>

        {loading && <div className="text-center py-5"><Spinner animation="border" variant="light" /><p>Loading requests...</p></div>}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <Card className="bg-dark bg-opacity-75 border-0 shadow-lg">
            <Card.Body>
              <Table hover responsive variant="dark">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>User</th>
                    <th>Dataset</th>
                    <th>Status</th>
                    <th>Requested On</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-5">No requests found</td></tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req._id || req.id}>
                        <td>{req._id || req.id}</td>
                        <td>{req.userEmail || req.userId || 'N/A'}</td>
                        <td>{req.datasetName || req.datasetId || 'N/A'}</td>
                        <td>{getStatusBadge(req.status)}</td>
                        <td>{req.requestedAt || req.createdAt ? new Date(req.requestedAt || req.createdAt).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default ApprovalRequestsPage;