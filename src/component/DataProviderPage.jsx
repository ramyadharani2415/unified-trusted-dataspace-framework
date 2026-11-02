import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function DataProviderPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

 useEffect(() => {
  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:2021/api/dataprovider/all');

      if (!response.ok) {
        throw new Error('Failed to fetch data providers');
      }

      const data = await response.json();

      // Ensure response is always an array
      setProviders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProviders();
}, []);


  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #450a0a 0%, #dc2626 100%)', color: 'white' }}>
      <Container fluid className="py-5">
        <Row className="mb-4">
          <Col className="d-flex align-items-center gap-3">
            <Button variant="outline-light" onClick={() => navigate('/admindashboard')}>
              <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
            </Button>
            <h2 className="mb-0"><i className="bi bi-person-badge-fill me-2"></i>All Data Providers</h2>
          </Col>
        </Row>

        {loading && <div className="text-center py-5"><Spinner animation="border" variant="light" /><p>Loading providers...</p></div>}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <Card className="bg-dark bg-opacity-75 border-0 shadow-lg">
            <Card.Body>
              <Table hover responsive variant="dark">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Organization</th>
                    <th>Email</th>
                    <th>Contact Person</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-5">No data providers found</td></tr>
                  ) : (
                    providers.map((provider) => (
                      <tr key={provider._id || provider.id}>
                        <td>{provider._id || provider.id}</td>
                        <td>{provider.organizationName || provider.name || 'N/A'}</td>
                        <td>{provider.email}</td>
                        <td>{provider.contactPerson || 'N/A'}</td>
                        <td>
                          <span className={`badge bg-${provider.verified ? 'success' : 'warning'}`}>
                            {provider.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td>{provider.createdAt ? new Date(provider.createdAt).toLocaleDateString() : 'N/A'}</td>
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

export default DataProviderPage;