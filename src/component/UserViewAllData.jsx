import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  Container, Row, Col, Card, Alert, Spinner, Badge, Button, Form, InputGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function UserViewAllData() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [requestingId, setRequestingId] = useState(null);

  const navigate = useNavigate();
  const userEmail = sessionStorage.getItem('userEmail');

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await fetch('http://localhost:2021/api/data/all');
        if (!response.ok) throw new Error('Failed to load datasets');

        const data = await response.json();
        setDatasets(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Unable to fetch datasets');
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  // 🔍 Search filter
  const filteredDatasets = datasets.filter(d =>
    `${d.dataName} ${d.description} ${d.dataCategory} ${d.location} ${d.dataFormat}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 🎨 Access badge
  const getAccessBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'public':
        return <Badge bg="success">Public</Badge>;
      case 'restricted':
        return <Badge bg="warning" text="dark">Restricted</Badge>;
      case 'private':
        return <Badge bg="danger">Private</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  // 📩 Request access
  const handleRequestAccess = async (dataset) => {
    if (!userEmail) {
      alert('Please login first');
      return;
    }

    try {
      setRequestingId(dataset.id);

      const response = await fetch(
        'http://localhost:2021/api/request/create',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataId: dataset.id,
            userEmail,
            providerEmail: dataset.uploaderEmail,
            datasetName: dataset.dataName
          })
        }
      );

      if (!response.ok) throw new Error('Failed to send request');

      alert(`✅ Request sent successfully!\nDataset: ${dataset.dataName}`);
    } catch (err) {
      alert(err.message || 'Request failed');
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b, #6366f1)',
        color: 'white'
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col lg={11}>
            <Card className="border-0 shadow-lg bg-dark text-white">
              {/* Header */}
              <Card.Header className="text-center py-4 bg-primary position-relative">
                <Button
                  variant="outline-light"
                  className="position-absolute start-0 top-50 translate-middle-y ms-3"
                  onClick={() => navigate(-1)}
                >
                  <i className="bi bi-arrow-left"></i>
                </Button>

                <h2 className="fw-bold">
                  <i className="bi bi-database-fill me-2"></i>
                  Explore Available Datasets
                </h2>

                <p className="text-white-50 mb-0">
                  Logged in as: {userEmail || 'Guest'}
                </p>
              </Card.Header>

              {/* Body */}
              <Card.Body className="p-4">
                <Row className="mb-4 justify-content-center">
                  <Col lg={8}>
                    <InputGroup>
                      <InputGroup.Text className="bg-black text-white">
                        <i className="bi bi-search"></i>
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Search datasets or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white text-black"
                      />
                    </InputGroup>
                  </Col>
                </Row>

                {loading && (
                  <div className="text-center py-5">
                    <Spinner animation="border" />
                  </div>
                )}

                {error && <Alert variant="danger">{error}</Alert>}

                {!loading && !error && (
                  <Row className="g-4">
                    {filteredDatasets.map((d) => (
                      <Col md={6} key={d.id}>
                        <Card className="h-100 bg-black text-white shadow">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h5 className="text-info">{d.dataName}</h5>
                              {getAccessBadge(d.accessLevel)}
                            </div>

                            <p className="text-white-50 mb-3">
                              {d.description}
                            </p>

                            {/* ✅ NEW FIELDS */}
                            <p className="mb-1">
                              <i className="bi bi-geo-alt-fill me-2 text-warning"></i>
                              <strong>Location:</strong> {d.location || 'N/A'}
                            </p>

                            <p className="mb-1">
                              <i className="bi bi-file-earmark-code-fill me-2 text-success"></i>
                              <strong>Data Format:</strong> {d.dataFormat || 'N/A'}
                            </p>

                            <p className="mb-3">
                              <i className="bi bi-tags-fill me-2 text-primary"></i>
                              <strong>Category:</strong> {d.dataCategory || 'N/A'}
                            </p>

                            <Button
                              className="w-100 fw-bold"
                              onClick={() => handleRequestAccess(d)}
                              disabled={requestingId === d.id}
                            >
                              {requestingId === d.id ? 'Sending...' : 'Request Access'}
                            </Button>
                          </Card.Body>

                          <Card.Footer className="text-white-50 small">
                            Provider: {d.uploaderEmail}
                          </Card.Footer>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UserViewAllData;
