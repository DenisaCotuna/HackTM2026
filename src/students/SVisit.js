import React, { useState } from 'react';
import { Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './SVisit.css';

const propertyData = {
  address: '123 Main St, City Center',
  ownerName: 'Anna Popescu'
};

function SVisit() {
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState([]);
  const [note, setNote] = useState('');

  const handleDateChange = (date) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter(d => d !== date));
    } else {
      if (selectedDates.length < 5) {
        setSelectedDates([...selectedDates, date]);
      }
    }
  };

  const handleSendRequest = () => {
    if (selectedDates.length === 0) {
      alert('Please select at least one date');
      return;
    }
    console.log('Visit request sent:', { dates: selectedDates, note });
    alert('Visit request sent successfully!');
    navigate('/SSearch');
  };

  // Generate next 14 days for date picker
  const generateDateOptions = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  return (
    <div className="svisit-screen py-5">
      <Container>
        <h1 className="mb-4">Request a property visit</h1>

        <Row className="mb-4">
          <Col lg={8}>
            <Card className="property-summary-card shadow-sm p-4 rounded-4 mb-4">
              <Card.Body>
                <h3 className="h5 mb-3">Property Summary</h3>
                <div className="summary-field mb-3">
                  <span className="label">Address</span>
                  <strong>{propertyData.address}</strong>
                </div>
                <div className="summary-field">
                  <span className="label">Owner Name</span>
                  <strong>{propertyData.ownerName}</strong>
                </div>
              </Card.Body>
            </Card>

            <Card className="date-picker-card shadow-sm p-4 rounded-4 mb-4">
              <Card.Body>
                <h3 className="h5 mb-4">I am available on these days</h3>
                <p className="text-muted mb-3">Select up to 5 dates</p>
                <div className="date-grid">
                  {dateOptions.map((date, index) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const isSelected = selectedDates.includes(dateStr);
                    return (
                      <div key={index} className="date-option mb-2">
                        <Form.Check
                          type="checkbox"
                          id={`date-${index}`}
                          label={date.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                          checked={isSelected}
                          onChange={() => handleDateChange(dateStr)}
                          disabled={!isSelected && selectedDates.length >= 5}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 p-3 bg-light rounded-3">
                  <strong>{selectedDates.length}/5</strong> dates selected
                </div>
              </Card.Body>
            </Card>

            <Card className="note-card shadow-sm p-4 rounded-4 mb-4">
              <Card.Body>
                <h3 className="h5 mb-3">Optional note to owner</h3>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Add any message for the owner..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSendRequest}
                className="rounded-3"
              >
                Send Visit Request
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SVisit;
