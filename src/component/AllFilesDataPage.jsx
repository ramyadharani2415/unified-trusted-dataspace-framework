import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Alert,
  Spinner,
  Button
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AllFilesDataPage() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const response = await fetch('http://localhost:2021/api/data/all');
      if (!response.ok) {
        throw new Error('Failed to fetch uploaded data');
      }
      const data = await response.json();
      setDatasets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #450a0a 0%, #dc2626 100%)',
        color: 'white'
      }}
    >
      <Container fluid className="py-5">
        {/* HEADER */}
        <Row className="mb-4">
          <Col className="d-flex align-items-center gap-3">
            <Button
              variant="outline-light"
              onClick={() => navigate('/admindashboard')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </Button>
            <h3 className="mb-0">
              <i className="bi bi-folder-fill me-2"></i>
              All Uploaded Datasets / Files
            </h3>
          </Col>
        </Row>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="light" />
            <p className="mt-3">Loading files...</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {/* DATA TABLE */}
        {!loading && !error && (
          <Card className="bg-dark bg-opacity-75 border-0 shadow-lg">
            <Card.Body>
              <Table responsive hover variant="dark">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Data Name</th>
                    <th>Uploader Email</th>
                    <th>Category</th>
                    <th>Format</th>
                    <th>Uploaded Date</th>
                  </tr>
                </thead>
                <tbody>
                  {datasets.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No files uploaded yet
                      </td>
                    </tr>
                  ) : (
                    datasets.map((data) => (
                      <tr key={data.id}>
                        <td>{data.id}</td>
                        <td>{data.dataName}</td>
                        <td>{data.uploaderEmail}</td>
                        <td>{data.dataCategory}</td>
                        <td>{data.dataFormat}</td>
                        <td>
                          {data.createdAt
                            ? new Date(data.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
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

export default AllFilesDataPage;
