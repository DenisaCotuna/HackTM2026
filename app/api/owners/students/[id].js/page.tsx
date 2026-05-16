'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Card, Button, Row, Col, Badge, Spinner } from 'react-bootstrap';

export default function StudentProfilePage() {
  const params = useParams();
  const id = params.id; // Uzima ID iz URL-a
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    // Simulacija povlačenja podataka na osnovu ID-ja
    // Ovde bi kasnije išao tvoj: fetch(`/api/students/${id}`)
    const mockStudents = [
      { id: "1", name: "John Doe", university: "West University", budget: "€500-700", area: "City Center", email: "john@example.com", bio: "Tražim miran stan." },
      { id: "2", name: "Alice Brown", university: "Politehnica", budget: "€400-600", area: "Student Complex", email: "alice@example.com", bio: "Nepušač, uredna." }
    ];

    const foundStudent = mockStudents.find(s => s.id === id);
    
    // Ako ne nađemo studenta u mock podacima, stavljamo generičke podatke da stranica ne bude prazna
    if (foundStudent) {
      setStudent(foundStudent);
    } else {
      setStudent({
        id: id,
        name: "Student " + id,
        university: "University of Timisoara",
        budget: "N/A",
        area: "TBD",
        email: "student@email.com",
        bio: "Korisnik je zainteresovan za vaš oglas."
      });
    }
  }, [id]);

  if (!student) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-5">
      <Button variant="outline-primary" onClick={() => router.back()} className="mb-4">
        ← Nazad na pretragu
      </Button>
      
      <Card className="shadow border-0 p-4">
        <Row className="align-items-center">
          <Col md={4} className="text-center mb-4 mb-md-0">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                 style={{ width: '120px', height: '120px', fontSize: '2.5rem', fontWeight: 'bold' }}>
              {student.name.charAt(0)}
            </div>
          </Col>
          <Col md={8}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h2 className="mb-1">{student.name}</h2>
                <p className="text-muted mb-3">{student.university}</p>
              </div>
              <Badge bg="success" pill className="px-3 py-2">Aktivan Student</Badge>
            </div>
            
            <Row className="mb-4">
              <Col sm={6}>
                <p className="mb-1 text-secondary">Preferirana zona:</p>
                <p className="fw-bold">{student.area}</p>
              </Col>
              <Col sm={6}>
                <p className="mb-1 text-secondary">Budžet:</p>
                <p className="fw-bold text-success">{student.budget}</p>
              </Col>
            </Row>

            <h5>O meni</h5>
            <p className="text-dark mb-4">{student.bio}</p>
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <Button 
                variant="primary" 
                size="lg" 
                className="px-5"
                onClick={() => window.location.href = `mailto:${student.email}?subject=Upit za stan`}
              >
                Kontaktiraj studenta
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}