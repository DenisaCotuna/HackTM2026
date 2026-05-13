import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import './OSearch.css';

const areaZones = [
  'City Center',
  'Student Complex',
  'Iulius Town',
  'Mehala',
  'Buziasului',
  'Ghiroda',
  'Lipovei',
  'Calea Aradului',
  'Other'
];

const nationalities = [
  'Romanian',
  'Hungarian',
  'German',
  'Italian',
  'French',
  'Spanish',
  'Polish',
  'Other'
];

const durations = [
  '1-3 months',
  '3-6 months',
  '6-12 months',
  '12+ months'
];

const roomPreferences = [
  'Room in shared flat',
  'Studio',
  'Full apartment'
];

const sampleStudents = [
  {
    id: 1,
    name: 'John Doe',
    university: 'West University of Timisoara',
    minBudget: 400,
    maxBudget: 600,
    area: 'City Center',
    nationality: 'Romanian',
    moveInDate: '2026-06-01',
    duration: '12+ months',
    roomPreference: 'Room in shared flat',
    hasRoommates: true,
    createdAt: '2026-05-10'
  },
  {
    id: 2,
    name: 'Alice Brown',
    university: 'Politehnica University of Timisoara',
    minBudget: 350,
    maxBudget: 550,
    area: 'Student Complex',
    nationality: 'Hungarian',
    moveInDate: '2026-05-20',
    duration: '12+ months',
    roomPreference: 'Room in shared flat',
    hasRoommates: true,
    createdAt: '2026-05-12'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    university: 'Victor Babes University',
    minBudget: 500,
    maxBudget: 800,
    area: 'Iulius Town',
    nationality: 'German',
    moveInDate: '2026-06-10',
    duration: '12+ months',
    roomPreference: 'Studio',
    hasRoommates: false,
    createdAt: '2026-05-05'
  },
  {
    id: 4,
    name: 'Charlie Wilson',
    university: 'University of Life Sciences',
    minBudget: 300,
    maxBudget: 500,
    area: 'Mehala',
    nationality: 'Italian',
    moveInDate: '2026-05-25',
    duration: '6-12 months',
    roomPreference: 'Room in shared flat',
    hasRoommates: true,
    createdAt: '2026-05-08'
  },
  {
    id: 5,
    name: 'Diana Prince',
    university: 'West University of Timisoara',
    minBudget: 600,
    maxBudget: 900,
    area: 'Buziasului',
    nationality: 'French',
    moveInDate: '2026-06-05',
    duration: '12+ months',
    roomPreference: 'Full apartment',
    hasRoommates: false,
    createdAt: '2026-05-11'
  },
  {
    id: 6,
    name: 'Eva Martinez',
    university: 'Politehnica University of Timisoara',
    minBudget: 450,
    maxBudget: 650,
    area: 'City Center',
    nationality: 'Spanish',
    moveInDate: '2026-05-30',
    duration: '12+ months',
    roomPreference: 'Studio',
    hasRoommates: false,
    createdAt: '2026-05-07'
  }
];

function OSearch() {
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [areaZone, setAreaZone] = useState('');
  const [nationality, setNationality] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [duration, setDuration] = useState('');
  const [roomPreference, setRoomPreference] = useState('');
  const [hasRoommates, setHasRoommates] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState(sampleStudents);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 4;

  const handleSearch = () => {
    const minValue = minBudget ? Number(minBudget) : 0;
    const maxValue = maxBudget ? Number(maxBudget) : Infinity;

    const results = sampleStudents.filter((student) => {
      const matchesBudget = 
        (student.minBudget <= maxValue || maxValue === Infinity) &&
        (student.maxBudget >= minValue || minValue === 0);
      const matchesArea = areaZone ? student.area === areaZone : true;
      const matchesNationality = nationality ? student.nationality === nationality : true;
      const matchesDate = moveInDate ? new Date(student.moveInDate) >= new Date(moveInDate) : true;
      const matchesDuration = duration ? student.duration === duration : true;
      const matchesRoom = roomPreference ? student.roomPreference === roomPreference : true;
      const matchesRoommates = hasRoommates ? student.hasRoommates === true : true;
      
      return matchesBudget && matchesArea && matchesNationality && matchesDate && 
             matchesDuration && matchesRoom && matchesRoommates;
    });

    setFilteredStudents(results);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setMinBudget('');
    setMaxBudget('');
    setAreaZone('');
    setNationality('');
    setMoveInDate('');
    setDuration('');
    setRoomPreference('');
    setHasRoommates(false);
    setFilteredStudents(sampleStudents);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / studentsPerPage));
  const pageItems = filteredStudents.slice((currentPage - 1) * studentsPerPage, currentPage * studentsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'prev') {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    } else {
      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    }
  };

  const handleViewProfile = (studentId) => {
    console.log('View profile for student', studentId);
  };

  return (
    <Container className="o-search-page py-5">
      <Row>
        <Col xs={12} className="mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h2>Search Student Requests</h2>
              <p className="text-muted mb-0">Find student requests that match your property.</p>
            </div>
            <Link to="/Odashboard">
              <Button variant="outline-secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </Col>
      </Row>
      <Row className="g-4">
        <Col lg={4}>
          <Card className="filter-panel shadow-sm">
            <Card.Body>
              <Card.Title>Filter Students</Card.Title>
              <Form>
                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3" controlId="minBudget">
                      <Form.Label>Min budget (€)</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                        placeholder="Min"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3" controlId="maxBudget">
                      <Form.Label>Max budget (€)</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        placeholder="Max"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="areaZone">
                  <Form.Label>Preferred area</Form.Label>
                  <Form.Select value={areaZone} onChange={(e) => setAreaZone(e.target.value)}>
                    <option value="">Any area</option>
                    {areaZones.map((zone) => (
                      <option key={zone} value={zone}>{zone}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="nationality">
                  <Form.Label>Nationality</Form.Label>
                  <Form.Select value={nationality} onChange={(e) => setNationality(e.target.value)}>
                    <option value="">Any nationality</option>
                    {nationalities.map((nat) => (
                      <option key={nat} value={nat}>{nat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="moveInDate">
                  <Form.Label>Move-in date</Form.Label>
                  <Form.Control
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="duration">
                  <Form.Label>Duration</Form.Label>
                  <Form.Select value={duration} onChange={(e) => setDuration(e.target.value)}>
                    <option value="">Any duration</option>
                    {durations.map((dur) => (
                      <option key={dur} value={dur}>{dur}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="roomPreference">
                  <Form.Label>Room preference</Form.Label>
                  <Form.Select value={roomPreference} onChange={(e) => setRoomPreference(e.target.value)}>
                    <option value="">Any type</option>
                    {roomPreferences.map((pref) => (
                      <option key={pref} value={pref}>{pref}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="hasRoommates">
                  <Form.Check
                    type="checkbox"
                    label="Ok with roommates"
                    checked={hasRoommates}
                    onChange={(e) => setHasRoommates(e.target.checked)}
                  />
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button variant="primary" onClick={handleSearch} className="flex-grow-1">
                    Search
                  </Button>
                  <Button variant="secondary" onClick={handleReset} className="flex-grow-1">
                    Reset
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <div className="results-header d-flex justify-content-between align-items-center mb-4 gap-2 flex-wrap">
            <h4 className="mb-0">Found {filteredStudents.length} student(s)</h4>
          </div>
          <Row className="g-4">
            {pageItems.map((student) => (
              <Col xs={12} key={student.id} className="mb-3">
                <Card className="student-card h-100">
                  <Card.Body>
                    <Card.Title className="mb-2">{student.name}</Card.Title>
                    <Card.Text className="text-muted mb-3">
                      <strong>University:</strong> {student.university}<br />
                      <strong>Budget:</strong> €{student.minBudget} - €{student.maxBudget}/month<br />
                      <strong>Preferred Area:</strong> {student.area}<br />
                      <strong>Move-in Date:</strong> {new Date(student.moveInDate).toLocaleDateString()}<br />
                      <strong>Duration:</strong> {student.duration}<br />
                      <strong>Room Preference:</strong> {student.roomPreference}<br />
                      {student.hasRoommates && <Badge bg="info" className="me-2">Ok with roommates</Badge>}
                    </Card.Text>
                    <Button variant="primary" onClick={() => handleViewProfile(student.id)}>
                      View Profile
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {filteredStudents.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted">No students found matching your filters.</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="pagination-controls d-flex justify-content-center gap-2 mt-4">
              <Button
                variant="outline-secondary"
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
              >
                ← Previous
              </Button>
              <span className="align-self-center">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline-secondary"
                onClick={() => handlePageChange('next')}
                disabled={currentPage === totalPages}
              >
                Next →
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default OSearch;
