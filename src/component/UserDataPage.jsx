import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Card, Table, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function UserDataPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

 useEffect(() => {
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:2021/api/users');

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();

      // Ensure response is always an array
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);


  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #450a0a 0%, #dc2626 100%)', color: 'white' }}>
      {/* You can import AdminNavbar here */}
      <Container fluid className="py-5">
        <Row className="mb-4">
          <Col className="d-flex align-items-center gap-3">
            <Button variant="outline-light" onClick={() => navigate('/admindashboard')}>
              <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
            </Button>
            <h2 className="mb-0"><i className="bi bi-people-fill me-2"></i>All Registered Users</h2>
          </Col>
        </Row>

        {loading && <div className="text-center py-5"><Spinner animation="border" variant="light" /><p className="mt-3">Loading users...</p></div>}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <Card className="bg-dark bg-opacity-75 border-0 shadow-lg">
            <Card.Body>
              <Table hover responsive variant="dark" className="mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">No users found</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id || user._id}>
                        <td>{user.id || user._id}</td>
                        <td>{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge bg-${user.role === 'admin' ? 'danger' : 'primary'}`}>
                            {user.role?.toUpperCase() || 'USER'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${user.active ? 'success' : 'secondary'}`}>
                            {user.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
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

export default UserDataPage;