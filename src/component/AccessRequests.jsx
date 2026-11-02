import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, Button, Table, Badge,
  Spinner, Alert, InputGroup, Form
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaClock, FaCheckCircle,
  FaUserCheck, FaSearch, FaCopy
} from 'react-icons/fa';

function AccessRequests() {
  const navigate = useNavigate();

  const [providerEmail, setProviderEmail] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [approvingId, setApprovingId] = useState(null);

  // 🔐 READ PROVIDER EMAIL (CORRECT KEY)
  useEffect(() => {
    const userStr = sessionStorage.getItem('user');

    console.log('🧪 sessionStorage.user:', userStr);

    if (!userStr) {
      setError('Session expired. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userStr);

      if (!user.email) {
        throw new Error('Email missing in user object');
      }

      console.log('✅ Provider email resolved:', user.email);
      setProviderEmail(user.email);
    } catch (e) {
      console.error('❌ Invalid user object', e);
      setError('Session expired. Please login again.');
      setLoading(false);
    }
  }, []);

  // 🔹 FETCH REQUESTS
  useEffect(() => {
    if (!providerEmail) return;

    setLoading(true);
    setError('');

    fetch(`http://localhost:2021/api/request/provider/${encodeURIComponent(providerEmail)}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setRequests(data);
        setFiltered(data);
      })
      .catch(() => {
        setError('Failed to load access requests');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [providerEmail]);

  // 🔹 SEARCH FILTER
  useEffect(() => {
    const f = requests.filter(r =>
      r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.datasetName.toLowerCase().includes(search.toLowerCase()) ||
      (r.accessKey || '').toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, requests]);

  // 🔹 APPROVE REQUEST
  const approveRequest = async (id) => {
    try {
      setApprovingId(id);
      const res = await fetch(
        `http://localhost:2021/api/request/provider-approve/${id}`,
        { method: 'PUT' }
      );
      if (!res.ok) throw new Error();

      setRequests(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status: 'PROVIDER_APPROVED' } : r
        )
      );
    } catch {
      alert('Approval failed');
    } finally {
      setApprovingId(null);
    }
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    alert('Access key copied');
  };

  const pending = filtered.filter(r => r.status === 'USER_REQUESTED').length;
  const approved = filtered.filter(r => r.status === 'PROVIDER_APPROVED').length;

  return (
    <div className="min-vh-100 py-5 bg-dark text-white">
      <div className="container">

        <Row className="mb-4">
          <Col className="d-flex align-items-center gap-3">
            <Button variant="outline-light" onClick={() => navigate('/dataprovider')}>
              <FaArrowLeft /> Back
            </Button>
            <div>
              <h2 className="fw-bold mb-0">
                <FaUserCheck className="me-2" /> Access Requests
              </h2>
              <small className="text-white-50">
                Provider: {providerEmail}
              </small>
            </div>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner />
          </div>
        ) : (
          <>
            <Row className="mb-4">
              <Col md={6}>
                <Card bg="warning" text="dark" className="text-center">
                  <Card.Body>
                    <FaClock /> Pending: <strong>{pending}</strong>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card bg="success" className="text-center">
                  <Card.Body>
                    <FaCheckCircle /> Approved: <strong>{approved}</strong>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <InputGroup className="mb-3">
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                placeholder="Search requests"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </InputGroup>

            <Card>
              <Card.Body className="p-0">
                <Table variant="dark" hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Access Key</th>
                      <th>User</th>
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
                            <Button size="sm" variant="link" onClick={() => copyKey(r.accessKey)}>
                              <FaCopy />
                            </Button>
                          )}
                        </td>
                        <td>{r.userEmail}</td>
                        <td>{r.datasetName}</td>
                        <td>
                          <Badge bg={
                            r.status === 'USER_REQUESTED' ? 'warning' :
                            r.status === 'PROVIDER_APPROVED' ? 'success' :
                            'info'
                          }>
                            {r.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="text-center">
                          {r.status === 'USER_REQUESTED' && (
                            <Button
                              variant="success"
                              disabled={approvingId === r.id}
                              onClick={() => approveRequest(r.id)}
                            >
                              {approvingId === r.id ? <Spinner size="sm" /> : 'Approve'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default AccessRequests;
