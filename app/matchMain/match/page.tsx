'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Container, Row, Col, Card, Badge } from 'react-bootstrap';
import './match.css';

const studentProfile = {
  name: 'John Doe',
  university: 'West University of Timisoara',
  budget: '€450-700',
  area: 'City Center',
  moveInDate: '2026-06-01',
};

const propertyListing = {
  photo: 'https://cdn.prod.website-files.com/65c18a9a4d6c9699ac22d7bd/678ef8cb0b40ffc5fed6efaa_julias-apartment-11.webp',
  address: '123 Main St, City Center',
  price: '€650/month',
  type: 'Room in shared flat',
  availability: '2026-06-01',
};

const comparisonRows = [
  { field: 'Budget', student: '€450-700', listing: '€650/month', match: true },
  { field: 'Preferred area', student: 'City Center', listing: 'City Center', match: true },
  { field: 'Move-in date', student: '2026-06-01', listing: '2026-06-01', match: true },
  { field: 'Room type', student: 'Room in shared flat', listing: 'Room in shared flat', match: true },
  { field: 'Availability', student: '2026-06-01', listing: '2026-06-01', match: true },
];

export default function Match() {
  const [studentConfirmed, setStudentConfirmed] = useState(false);
  const [ownerConfirmed, setOwnerConfirmed] = useState(false);

  const statusLabel = studentConfirmed && ownerConfirmed
    ? 'Both sides confirmed! Chat is now open 💬'
    : 'Waiting for the other side to confirm...';

  return (
    <div className="match-page py-5">
      <Container>
        <div className="match-header text-center mb-4">
          <h1 className="mb-2">Match Detail</h1>
          <Badge bg={studentConfirmed && ownerConfirmed ? 'success' : 'warning'} className="px-4 py-2 status-badge">
            {studentConfirmed && ownerConfirmed ? 'Both sides confirmed!' : 'Waiting for the other side to confirm...'}
          </Badge>
          <p className="mt-3 text-muted">{statusLabel}</p>
        </div>

        <Row className="match-panels gy-4">
          <Col lg={4}>
            <Card className="profile-card h-100 shadow-sm">
              <Card.Body>
                <h2 className="h5 mb-3">Student Profile</h2>
                <div className="profile-field mb-3">
                  <span className="label">Name</span>
                  <strong>{studentProfile.name}</strong>
                </div>
                <div className="profile-field mb-3">
                  <span className="label">University</span>
                  <strong>{studentProfile.university}</strong>
                </div>
                <div className="profile-field mb-3">
                  <span className="label">Budget</span>
                  <strong>{studentProfile.budget}</strong>
                </div>
                <div className="profile-field mb-3">
                  <span className="label">Preferred area</span>
                  <strong>{studentProfile.area}</strong>
                </div>
                <div className="profile-field">
                  <span className="label">Move-in date</span>
                  <strong>{studentProfile.moveInDate}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} className="text-center">
            <div className="match-badge-panel h-100 d-flex flex-column justify-content-center align-items-center px-4 py-5 shadow-sm rounded-4">
              <Badge bg="danger" className="match-score-badge mb-3">Perfect Match 🔥</Badge>
              <p className="match-score-copy text-muted">This connection has a high compatibility score based on budget, location, and timing.</p>
            </div>
          </Col>

          <Col lg={4}>
            <Card className="property-card h-100 shadow-sm">
              <Card.Img variant="top" src={propertyListing.photo} className="property-photo" />
              <Card.Body>
                <h2 className="h5 mb-3">Property Listing</h2>
                <div className="property-field mb-3">
                  <span className="label">Address</span>
                  <strong>{propertyListing.address}</strong>
                </div>
                <div className="property-field mb-3">
                  <span className="label">Price</span>
                  <strong>{propertyListing.price}</strong>
                </div>
                <div className="property-field mb-3">
                  <span className="label">Type</span>
                  <strong>{propertyListing.type}</strong>
                </div>
                <div className="property-field">
                  <span className="label">Availability</span>
                  <strong>{propertyListing.availability}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Card className="comparison-card shadow-sm">
              <Card.Body>
                <h2 className="h5 mb-4">Match Comparison</h2>
                <div className="table-responsive">
                  <table className="comparison-table table table-borderless align-middle">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Student</th>
                        <th>Listing</th>
                        <th>Match</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row) => (
                        <tr key={row.field}>
                          <td>{row.field}</td>
                          <td>{row.student}</td>
                          <td>{row.listing}</td>
                          <td>
                            <Badge bg={row.match ? 'success' : 'secondary'}>
                              {row.match ? 'Yes' : 'No'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4 gx-4 gy-3">
          <Col md={6}>
            <Card className="action-card shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <h3 className="h6">Student</h3>
                  <p className="text-muted">Confirm your interest in this match.</p>
                </div>
                <Button
                  variant={studentConfirmed ? 'success' : 'outline-primary'}
                  onClick={() => setStudentConfirmed(true)}
                  disabled={studentConfirmed}
                >
                  I&apos;m Interested ✓
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="action-card shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <h3 className="h6">Owner</h3>
                  <p className="text-muted">Confirm your interest in this match.</p>
                </div>
                <Button
                  variant={ownerConfirmed ? 'success' : 'outline-primary'}
                  onClick={() => setOwnerConfirmed(true)}
                  disabled={ownerConfirmed}
                >
                  I&apos;m Interested ✓
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4 gx-4 gy-3">
          <Col md={12}>
            <Link href="/chat">
              <Button variant="outline-secondary" className="w-100">
                💬 Open Chat
              </Button>
            </Link>
          </Col>
        </Row>

        <Row className="mt-4 gx-4 gy-3">
          <Col md={6}>
            <Link href="/SVisit">
              <Button variant="info" className="w-100">
                📅 Request Visit (Student)
              </Button>
            </Link>
          </Col>
          <Col md={6}>
            <Link href="/OVisit">
              <Button variant="info" className="w-100">
                📅 Review Visit Request (Owner)
              </Button>
            </Link>
          </Col>
        </Row>

        <Row className="mt-4 gx-4 gy-3">
          <Col md={12}>
            <Link href="/appointment">
              <Button variant="warning" className="w-100">
                ✅ View Appointment Confirmation
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
