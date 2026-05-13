import React, { useState } from 'react';
import { Button, Container, Row, Col, Card, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './OVisit.css';

const studentData = {
  name: 'John Doe',
  university: 'West University of Timisoara',
  budget: '€450-700',
  area: 'City Center'
};

const visitRequest = {
  studentName: 'John Doe',
  proposedDates: [
    '2026-05-20',
    '2026-05-22',
    '2026-05-25'
  ],
  note: 'Hi! I am very interested in this property. I have flexibility with these dates and would like to schedule a viewing.'
};

function OVisit() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  const handleConfirmDate = () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    console.log('Appointment booked for:', selectedDate);
    alert('Visit confirmed for ' + new Date(selectedDate).toLocaleDateString());
    navigate('/ODashboard');
  };

  const handleDiscussInChat = () => {
    navigate('/chat');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="ovisit-screen py-5">
      <Container>
        <h1 className="mb-4">Visit request from <strong>{visitRequest.studentName}</strong></h1>

        <Row className="mb-4">
          <Col lg={8}>
            <Card className="student-summary-card shadow-sm p-4 rounded-4 mb-4">
              <Card.Body>
                <h3 className="h5 mb-3">Student Summary</h3>
                <div className="summary-field mb-3">
                  <span className="label">Name</span>
                  <strong>{studentData.name}</strong>
                </div>
                <div className="summary-field mb-3">
                  <span className="label">University</span>
                  <strong>{studentData.university}</strong>
                </div>
                <div className="summary-field mb-3">
                  <span className="label">Budget</span>
                  <strong>{studentData.budget}</strong>
                </div>
                <div className="summary-field">
                  <span className="label">Preferred Area</span>
                  <strong>{studentData.area}</strong>
                </div>
              </Card.Body>
            </Card>

            {visitRequest.note && (
              <Card className="note-card shadow-sm p-4 rounded-4 mb-4">
                <Card.Body>
                  <h3 className="h5 mb-3">Student's Message</h3>
                  <p className="text-muted">{visitRequest.note}</p>
                </Card.Body>
              </Card>
            )}

            <Card className="date-selection-card shadow-sm p-4 rounded-4 mb-4">
              <Card.Body>
                <h3 className="h5 mb-4">Proposed dates</h3>
                <div className="date-list">
                  {visitRequest.proposedDates.map((date, index) => (
                    <div key={index} className="date-option mb-3 p-3 border rounded-3">
                      <Form.Check
                        type="radio"
                        id={`date-${index}`}
                        name="dateSelection"
                        label={
                          <span className="ms-2">
                            {formatDate(date)}
                            {selectedDate === date && (
                              <Badge bg="success" className="ms-2">Selected</Badge>
                            )}
                          </span>
                        }
                        value={date}
                        checked={selectedDate === date}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            <div className="d-grid gap-3">
              <Button
                variant="success"
                size="lg"
                onClick={handleConfirmDate}
                disabled={!selectedDate}
                className="rounded-3"
              >
                Confirm this date
              </Button>
              <Button
                variant="outline-secondary"
                size="lg"
                onClick={handleDiscussInChat}
                className="rounded-3"
              >
                None of these work — discuss in chat
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OVisit;
