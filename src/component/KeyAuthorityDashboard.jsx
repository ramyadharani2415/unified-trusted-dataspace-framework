import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  Container, Row, Col, Card, Button, Table, Badge,
  Spinner, Alert, Form, InputGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function KeyAuthorityDashboard() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 🔹 FETCH ALL REQUESTS
  useEffect(() => {
    fetch('http://localhost:2021/api/request/key-authority/all')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        console.log("Requests Loaded:", data); // DEBUG
        setRequests(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load requests');
        setLoading(false);
      });
  }, []);

  // 🔹 FILTER SEARCH
  const filtered = requests.filter(r =>
    r.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.providerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.datasetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.accessKey || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ KEY AUTHORITY APPROVE
  const approveRequest = async (request) => {
    try {
      setProcessingId(request.id);

      console.log("Approving Request:", request);

      // ✅ SUPPORT BOTH dataId OR datasetId
      const dataId = request.dataId || request.datasetId;

      if (!dataId) {
        throw new Error("Data ID missing in request (dataId/datasetId)");
      }

      // 1️⃣ APPROVE REQUEST
      const approveRes = await fetch(
        `http://localhost:2021/api/request/key-authority-approve/${request.id}`,
        { method: 'PUT' }
      );

      if (!approveRes.ok) throw new Error('Approval failed');

      // 2️⃣ FETCH REAL ACCESS KEY
      const keyRes = await fetch(
        `http://localhost:2021/api/data/access-key/${dataId}`
      );

      if (!keyRes.ok) throw new Error('Failed to fetch access key');

      const realKey = await keyRes.text();

      // 3️⃣ UPDATE UI
      setRequests(prev =>
        prev.map(r =>
          r.id === request.id
            ? {
                ...r,
                status: 'KEY_AUTH_APPROVED',
                accessKey: realKey
              }
            : r
        )
      );

    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    alert('Access key copied');
  };

  const stats = {
    pending: requests.filter(r => r.status === 'PROVIDER_APPROVED').length,
    approved: requests.filter(r => r.status === 'KEY_AUTH_APPROVED').length,
    total: requests.length
  };

  return (
    <div className="min-vh-100 bg-dark text-white">
      <nav className="navbar navbar-dark bg-black px-4">
        <span className="navbar-brand fw-bold">Key Authority Dashboard</span>
        <Button variant="outline-light" onClick={() => navigate('/')}>
          Logout
        </Button>
      </nav>

      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold">Access Approval Requests</h2>
            <p className="text-white-50">Final approval by Key Authority</p>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner />
          </div>
        ) : (
          <>
            {/* STATS */}
            <Row className="mb-4">
              <Col md={4}>
                <Card bg="warning" text="dark" className="text-center">
                  <Card.Body>Pending: <b>{stats.pending}</b></Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card bg="success" className="text-center">
                  <Card.Body>Approved: <b>{stats.approved}</b></Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card bg="info" className="text-center">
                  <Card.Body>Total: <b>{stats.total}</b></Card.Body>
                </Card>
              </Col>
            </Row>

            {/* SEARCH */}
            <InputGroup className="mb-3">
              <InputGroup.Text>🔍</InputGroup.Text>
              <Form.Control
                placeholder="Search requests"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            {/* TABLE */}
            <Card>
              <Table hover variant="dark" className="mb-0">
                <thead>
                  <tr>
                    <th>Access Key</th>
                    <th>User</th>
                    <th>Provider</th>
                    <th>Dataset</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td>
                        <code>{r.accessKey || 'N/A'}</code>
                        {r.accessKey && (
                          <Button
                            size="sm"
                            variant="link"
                            onClick={() => copyKey(r.accessKey)}
                          >
                            📋
                          </Button>
                        )}
                      </td>
                      <td>{r.userEmail}</td>
                      <td>{r.providerEmail}</td>
                      <td>{r.datasetName}</td>
                      <td>
                        <Badge bg={
                          r.status === 'KEY_AUTH_APPROVED' ? 'success' :
                          r.status === 'PROVIDER_APPROVED' ? 'warning' :
                          'secondary'
                        }>
                          {r.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="text-center">
                        {r.status === 'PROVIDER_APPROVED' && (
                          <Button
                            variant="success"
                            disabled={processingId === r.id}
                            onClick={() => approveRequest(r)}
                          >
                            {processingId === r.id ? (
                              <Spinner size="sm" />
                            ) : (
                              'Approve'
                            )}
                          </Button>
                        )}

                        {r.status === 'KEY_AUTH_APPROVED' && (
                          <Badge bg="success">Approved</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </>
        )}
      </Container>
    </div>
  );
}

export default KeyAuthorityDashboard;
