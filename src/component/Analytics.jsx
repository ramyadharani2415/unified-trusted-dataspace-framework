import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Analytics() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-5">
      <div className="mb-4">
        <i className="bi bi-graph-up-arrow fs-1 text-info mb-3"></i>
        <h1 className="display-5 fw-bold">Analytics Dashboard</h1>
        <p className="lead text-white-50">Advanced analytics and reporting for your data assets</p>
      </div>
      
      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <Card className="shadow-lg border-0" style={{ background: 'rgba(20, 30, 50, 0.7)' }}>
            <Card.Body className="p-5">
              <div className="coming-soon-placeholder mb-4">
                <div className="d-flex justify-content-center mb-4">
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
                <h4 className="text-info mb-3">Advanced Analytics Coming Soon</h4>
                <p className="text-white-50 mb-4">
                  We're working on powerful analytics features including:
                </p>
                <ul className="text-start text-white-50 mb-4">
                  <li>Dataset usage trends and patterns</li>
                  <li>Consumer behavior analysis</li>
                  <li>Revenue and monetization insights</li>
                  <li>Data access heatmaps</li>
                  <li>Real-time performance metrics</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Button variant="primary" size="lg" className="me-3" onClick={() => navigate('/provider/dashboard')}>
        <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
      </Button>
      <Button variant="outline-light" size="lg">
        <i className="bi bi-bell me-2"></i> Notify Me When Ready
      </Button>
    </div>
  );
}

export default Analytics;