import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner, InputGroup
} from 'react-bootstrap';
// Remove the line below if you're not using React Router
import { useNavigate } from 'react-router-dom';

function UserDataDownload() {
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // For React Router navigation
  const navigate = useNavigate();

  // Alternative if NOT using React Router (uncomment if needed):
  // const goBack = () => window.history.back();

  const handleValidateKey = async (e) => {
    e.preventDefault();

    const key = accessKey.trim();
    if (!key) {
      setError('Please enter your Access Key');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessData(null);

    try {
      const response = await fetch(
        `http://localhost:2021/api/data/validate-key/${key}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error('Invalid or expired Access Key');
      }

      const isValid = await response.json();

      if (!isValid) {
        throw new Error('Invalid or expired Access Key');
      }

      setSuccessData({
        datasetName: 'Approved Dataset',
        provider: 'Registered Data Provider',
        userEmail: 'authorized-user@example.com',
        accessKey: key,
        size: 'Encrypted',
        format: 'Secure File',
        expiresOn: '30 days from approval',
        approvedOn: new Date().toLocaleDateString(),
      });

    } catch (err) {
      setError(err.message || 'Validation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!successData) return;

    setDownloading(true);

    window.location.href =
      `http://localhost:2021/api/data/download/${successData.accessKey}`;

    setTimeout(() => setDownloading(false), 1000);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(accessKey);
    alert('Access Key copied!');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 70%, #6366f1 100%)',
      color: 'white'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <Card className="border-0 shadow-2xl overflow-hidden" style={{
              background: 'rgba(15, 20, 35, 0.9)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px'
            }}>
              <Card.Header className="text-center py-5 border-0 position-relative" style={{
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
              }}>
                {/* ← Back Button */}
                <Button
                  variant="outline-light"
                  className="position-absolute start-0 top-50 translate-middle-y ms-4"
                  style={{ zIndex: 10 }}
                  onClick={() => navigate(-1)} // ← React Router
                  // onClick={goBack} // ← Uncomment if not using React Router
                >
                  <i className="bi bi-arrow-left fs-4"></i>
                </Button>

                <h1 className="display-5 fw-bold mb-3">
                  <i className="bi bi-cloud-download-fill me-3"></i>
                  Secure Data Download
                </h1>
                <p className="lead mb-0 opacity-90">
                  Enter your Access Key to access approved dataset
                </p>
              </Card.Header>

              <Card.Body className="p-5">
                <Form onSubmit={handleValidateKey}>
                  <Row className="justify-content-center">
                    <Col lg={10}>
                      <InputGroup className="mb-4" size="lg">
                        <InputGroup.Text className="bg-dark text-white border-primary">
                          <i className="bi bi-key-fill"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Enter your Access Key"
                          value={accessKey}
                          onChange={(e) => setAccessKey(e.target.value)}
                          className="bg-dark text-white border-primary"
                          style={{ fontFamily: 'monospace' }}
                          required
                        />
                        {accessKey && (
                          <Button variant="outline-light" onClick={copyKey}>
                            <i className="bi bi-clipboard"></i>
                          </Button>
                        )}
                        <Button variant="primary" type="submit" disabled={loading}>
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Validating...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-shield-lock me-2"></i>
                              Validate Key
                            </>
                          )}
                        </Button>
                      </InputGroup>
                    </Col>
                  </Row>
                </Form>

                {error && (
                  <Alert variant="danger" className="text-center shadow mt-4">
                    <strong>Error:</strong> {error}
                  </Alert>
                )}

                {successData && (
                  <div className="mt-5 text-center">
                    <Alert variant="success">
                      <h4>Access Key Validated!</h4>
                      <p>You are authorized to download the dataset</p>
                    </Alert>

                    <Button
                      variant="success"
                      size="lg"
                      className="px-5 py-3 fw-bold"
                      onClick={handleDownload}
                      disabled={downloading}
                    >
                      {downloading ? 'Downloading...' : 'Download Dataset'}
                    </Button>
                  </div>
                )}
              </Card.Body>

              <Card.Footer className="bg-dark text-center py-4 border-0">
                <small className="text-white-50">
                  Secure TTDS Data Platform
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UserDataDownload;