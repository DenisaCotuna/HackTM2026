import React from 'react';
import { Button, Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './appointment.css';

const appointmentDetails = {
  date: '2026-05-22',
  time: '14:00',
  propertyAddress: '123 Main St, City Center',
  studentName: 'John Doe',
  ownerName: 'Anna Popescu'
};

function Appointment() {
  const navigate = useNavigate();

  const handleAddToCalendar = () => {
    // Create a calendar event (Google Calendar, Outlook, etc.)
    const startDate = new Date(appointmentDetails.date + 'T' + appointmentDetails.time);
    const endDate = new Date(startDate.getTime() + 60 * 60000); // 1 hour duration
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Property%20Visit%20Appointment&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Property:%20${appointmentDetails.propertyAddress}&location=${appointmentDetails.propertyAddress}`;
    
    window.open(calendarUrl, '_blank');
  };

  const handleGoToChat = () => {
    navigate('/chat');
  };

  const handleBackToDashboard = () => {
    navigate('/SDashboard');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="appointment-screen py-5">
      <Container>
        <div className="confirmation-banner text-center mb-5 px-4 py-3 rounded-4 shadow">
          <h1 className="confirmation-title mb-2">
            Appointment Confirmed ✅
          </h1>
          <p className="confirmation-subtitle text-muted">
            Your visit has been successfully scheduled
          </p>
        </div>

        <Row className="mb-4 justify-content-center">
          <Col lg={8}>
            <Card className="appointment-details-card shadow-sm p-4 rounded-4 mb-4">
              <Card.Body>
                <h3 className="h5 mb-4">Appointment Details</h3>

                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Date</span>
                    <strong className="detail-value">{formatDate(appointmentDetails.date)}</strong>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Time</span>
                    <strong className="detail-value">{formatTime(appointmentDetails.time)}</strong>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Property Address</span>
                    <strong className="detail-value">{appointmentDetails.propertyAddress}</strong>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Student Name</span>
                    <strong className="detail-value">{appointmentDetails.studentName}</strong>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Owner Name</span>
                    <strong className="detail-value">{appointmentDetails.ownerName}</strong>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <div className="d-grid gap-3">
              <Button
                variant="success"
                size="lg"
                onClick={handleAddToCalendar}
                className="rounded-3"
              >
                📅 Add to calendar
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleGoToChat}
                className="rounded-3"
              >
                💬 Go to Chat
              </Button>
              <Button
                variant="outline-secondary"
                size="lg"
                onClick={handleBackToDashboard}
                className="rounded-3"
              >
                Back to Dashboard
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Appointment;
