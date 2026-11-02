import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Button, Table, Badge, Form, Spinner, Alert 
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaDatabase, FaEye, FaDownload, FaChartLine, FaShieldAlt, 
  FaEdit, FaTrash, FaPlus, FaSearch, FaArrowLeft, FaGlobe, 
  FaKey, FaLink, FaUser, FaFileAlt 
} from 'react-icons/fa';

function ViewUploadedData() {
  const navigate = useNavigate();

  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploaderEmail, setUploaderEmail] = useState('');

  // Load logged-in user's email from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUploaderEmail(parsed.email || '');
      } catch (e) {
        setError('Session error. Please log in again.');
        setIsLoading(false);
      }
    } else {
      setError('Not logged in. Redirecting...');
      setTimeout(() => navigate('/dataprovider'), 2000);
    }
  }, [navigate]);

  // Fetch datasets by uploader email
  useEffect(() => {
    if (!uploaderEmail) return;

    const fetchDatasets = async () => {
      setIsLoading(true);
      setError('');

      try {
        const url = `http://localhost:2021/api/data/by-email?uploaderEmail=${encodeURIComponent(uploaderEmail)}`;
        console.log('Fetching datasets from:', url);

        const response = await fetch(url);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text.substring(0, 200)}`);
        }

        const data = await response.json();

        // Handle different response formats
        const list = Array.isArray(data) ? data : 
                     data.datasets ? data.datasets : 
                     data.content ? data.content : [];

        setDatasets(list);

      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Failed to load datasets: ${err.message}`);
        setDatasets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatasets();
  }, [uploaderEmail]);

  // Filter datasets by search term
  const filteredDatasets = datasets.filter(dataset =>
    (dataset.dataName || dataset.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dataset.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dataset.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const stats = {
    total: datasets.length,
    published: datasets.filter(d => 
      ['Public', 'Published'].includes(d.accessLevel || d.status)
    ).length,
    totalViews: datasets.reduce((sum, d) => sum + (d.accessCount || 0), 0),
    totalDownloads: datasets.reduce((sum, d) => sum + (d.downloadCount || 0), 0)
  };

  const getStatusBadge = (accessLevel) => {
    const level = (accessLevel || '').toLowerCase();
    const map = {
      public: { variant: 'success', text: 'Public', icon: FaGlobe },
      restricted: { variant: 'warning', text: 'Restricted', icon: FaShieldAlt },
      private: { variant: 'dark', text: 'Private', icon: FaKey }
    };
    const config = map[level] || { variant: 'secondary', text: 'Unknown', icon: FaDatabase };
    const Icon = config.icon;
    return (
      <Badge bg={config.variant} className="px-3 py-2 fw-bold">
        <Icon className="me-2" style={{ fontSize: '0.9em' }} />
        {config.text}
      </Badge>
    );
  };

  return (
    <div 
      className="min-vh-100 py-5"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: 'white'
      }}
    >
      <div className="container">

        {/* Header */}
        <Row className="mb-5 align-items-center">
          <Col>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-4">
              <div className="d-flex align-items-center gap-4">
                <Button
                  variant="outline-light"
                  size="lg"
                  onClick={() => navigate('/dataprovider')}
                  className="shadow-sm px-4"
                >
                  <FaArrowLeft className="me-2" /> Back to Dashboard
                </Button>
                <div>
                  <h1 className="display-5 fw-bold mb-1">
                    <FaDatabase className="text-info me-3" />
                    My Uploaded Datasets
                  </h1>
                  <p className="text-white-50 mb-0">
                    Logged in as: <strong>{uploaderEmail || 'Loading...'}</strong>
                  </p>
                </div>
              </div>
              <Button 
                variant="success" 
                size="lg" 
                className="shadow-lg px-5 fw-bold"
                onClick={() => navigate('/publishdata')}
              >
                <FaPlus className="me-2" /> Publish New Dataset
              </Button>
            </div>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-4 text-center">
            <strong>Error:</strong> {error}
          </Alert>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="text-white mt-3 fs-5">Loading your datasets...</p>
          </div>
        )}

        {/* Main Content - Only show when loaded and no error */}
        {!isLoading && !error && (
          <>
            {/* Stats Cards */}
            <Row className="mb-5 g-4">
              <Col md={3}>
                <Card className="h-100 border-0 shadow" style={{ background: 'rgba(59, 130, 246, 0.2)', backdropFilter: 'blur(10px)' }}>
                  <Card.Body className="text-center">
                    <FaDatabase className="fs-1 text-primary mb-3" />
                    <h3 className="fw-bold">{stats.total}</h3>
                    <p>Total Datasets</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="h-100 border-0 shadow" style={{ background: 'rgba(34, 197, 94, 0.2)', backdropFilter: 'blur(10px)' }}>
                  <Card.Body className="text-center">
                    <FaEye className="fs-1 text-success mb-3" />
                    <h3 className="fw-bold">{stats.totalViews}</h3>
                    <p>Total Views</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="h-100 border-0 shadow" style={{ background: 'rgba(168, 85, 247, 0.2)', backdropFilter: 'blur(10px)' }}>
                  <Card.Body className="text-center">
                    <FaDownload className="fs-1 text-purple mb-3" />
                    <h3 className="fw-bold">{stats.totalDownloads}</h3>
                    <p>Total Downloads</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="h-100 border-0 shadow" style={{ background: 'rgba(251, 146, 60, 0.2)', backdropFilter: 'blur(10px)' }}>
                  <Card.Body className="text-center">
                    <FaGlobe className="fs-1 text-warning mb-3" />
                    <h3 className="fw-bold">{stats.published}</h3>
                    <p>Public Datasets</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Search Bar */}
            <Card className="mb-4 border-0 shadow" style={{ background: 'rgba(15, 25, 45, 0.8)' }}>
              <Card.Body>
                <div className="position-relative">
                  <FaSearch className="position-absolute top-50 start-3 translate-middle-y text-white-50" />
                  <Form.Control
                    type="text"
                    placeholder="Search by name, description, or category..."
                    className="ps-5 bg-dark border-0 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <small className="text-white-50 mt-2 d-block">
                  Showing {filteredDatasets.length} of {datasets.length} datasets
                </small>
              </Card.Body>
            </Card>

            {/* Datasets Table */}
            <Card className="border-0 shadow overflow-hidden" style={{ background: 'rgba(20, 30, 50, 0.9)' }}>
              <Card.Header className="bg-gradient text-white py-4" style={{ background: 'linear-gradient(90deg, #1e40af, #06b6d4)' }}>
                <h4 className="mb-0 fw-bold">Dataset Details</h4>
              </Card.Header>
              <Card.Body className="p-0">
                {filteredDatasets.length === 0 ? (
                  <div className="text-center py-5">
                    <FaDatabase className="display-1 text-white-50 mb-4" />
                    <h5 className="text-white-50">
                      {searchTerm ? 'No datasets match your search' : 'No datasets uploaded yet'}
                    </h5>
                    {!searchTerm && (
                      <Button variant="primary" onClick={() => navigate('/publishdata')}>
                        Upload Your First Dataset
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table hover variant="dark" className="mb-0">
                    <thead>
                      <tr className="text-uppercase small text-white-50">
                        <th className="ps-4">Dataset</th>
                        <th>Location</th>
                        <th>Category</th>
                        <th>Access</th>
                        <th>File URL</th>
                        <th>S3 Key</th>
                        <th>Secret Key</th>
                        <th>Uploader</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDatasets.map((dataset) => (
                        <tr key={dataset.id} className="align-middle">
                          <td className="ps-4 py-3">
                            <div>
                              <div className="fw-bold text-white">
                                {dataset.dataName || dataset.name || 'Untitled'}
                              </div>
                              <small className="text-white-50">
                                {dataset.description || 'No description'}
                              </small>
                              <div className="mt-1">
                                <Badge bg="info" className="me-2">
                                  ID: {dataset.id}
                                </Badge>
                                <Badge bg="secondary">
                                  {dataset.dataFormat || 'Unknown'}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-info">
                              <FaGlobe className="me-2" />
                              {dataset.location || 'Not specified'}
                            </div>
                          </td>
                          <td>
                            <Badge bg="primary" className="px-3">
                              {dataset.category || 'Uncategorized'}
                            </Badge>
                          </td>
                          <td>
                            {getStatusBadge(dataset.accessLevel)}
                          </td>
                          <td>
                            {dataset.fileUrl ? (
                              <a 
                                href={dataset.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-success text-decoration-none"
                              >
                                <FaLink className="me-2" />
                                View File
                              </a>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td>
                            <code className="text-white-50 small">
                              {dataset.s3Key || '—'}
                            </code>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaKey className="text-warning me-2" />
                              <code className="text-white-50 small">
                                {dataset.secretKey || '—'}
                              </code>
                            </div>
                          </td>
                          <td>
                            <div className="text-info">
                              <FaUser className="me-2" />
                              {dataset.uploaderEmail}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default ViewUploadedData;