"use client";

import React, { useEffect, useState, use } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';

// --- HACKATHON DEMO DATABASE ---
const demoDatabase: any = {
    "1": {
        name: "John Doe",
        university: "West University of Timisoara",
        budget: "€400 - €600",
        location: "City Center",
        moveIn: "June 1, 2026",
        duration: "12+ months",
        type: "Room in shared flat",
        email: "john.doe@uvt.ro",
        bio: "I am a Law student looking for a quiet place near the city center. I am very organized, a non-smoker, and I spend most of my time studying at the library.",
        tags: ["Law Student", "Non-smoker", "Quiet"],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    },
    "2": {
        name: "Alice Brown",
        university: "Politehnica University of Timisoara",
        budget: "€350 - €550",
        location: "Student Complex",
        moveIn: "May 20, 2026",
        duration: "12+ months",
        type: "Room in shared flat",
        email: "alice.brown@student.upt.ro",
        bio: "Architecture student. I love creative spaces and I'm looking for roommates who are friendly and enjoy occasional movie nights.",
        tags: ["Architecture", "Pet Friendly", "Social"],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
    }
};

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
    // We use React.use() to unwrap the params promise safely
    const resolvedParams = use(params); 
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = () => {
            setLoading(true);
            // Ensure we are using the ID as a string to match the database keys
            const studentId = String(resolvedParams.id);
            console.log("Looking for ID:", studentId); // Debugging info in F12 console
            
            setStudent(demoDatabase[studentId] || null);
            setLoading(false);
        };
        loadData();
    }, [resolvedParams.id]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!student) {
        return (
            <Container className="text-center py-5">
                <h1 className="display-4 fw-bold text-dark">Profile Not Found</h1>
                <p className="lead text-muted">No student found with ID: {resolvedParams.id}</p>
                <Button href="/owners/search" variant="primary" className="mt-3 px-5 shadow">Back to Search</Button>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="mb-4">
                <Col md={8} lg={6} className="mx-auto">
                    <Button href="/owners/search" variant="link" className="text-decoration-none p-0 text-secondary">
                        ← Back to Search
                    </Button>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg border-0" style={{ borderRadius: '25px', overflow: 'hidden' }}>
                        <div style={{ height: '120px', background: 'linear-gradient(135deg, #0061f2 0%, #6366f1 100%)' }}></div>
                        <Card.Body className="px-4 pb-5 position-relative">
                            <div className="text-center" style={{ marginTop: '-70px' }}>
                                <img src={student.avatar} alt="Avatar" className="rounded-circle border border-5 border-white shadow-sm bg-white" style={{ width: '140px', height: '140px' }} />
                            </div>

                            <div className="text-center mt-3 mb-4">
                                <h2 className="fw-bold text-dark mb-0">{student.name}</h2>
                                <p className="text-primary fw-medium mb-3">{student.university}</p>
                                <div className="d-flex justify-content-center flex-wrap gap-2">
                                    {student.tags.map((tag: string) => (
                                        <Badge key={tag} bg="light" text="primary" className="border px-3 py-2 fw-semibold shadow-sm">{tag}</Badge>
                                    ))}
                                </div>
                            </div>

                            <hr className="my-4 opacity-10" />

                            <div className="px-2">
                                <h6 className="text-uppercase fw-bold text-muted small mb-3">Preferences</h6>
                                <Row className="g-3 mb-4">
                                    <Col xs={6}><div className="p-3 bg-light rounded-3 border h-100"><div className="text-muted small fw-bold">Budget</div><div className="fw-bold text-dark">{student.budget}</div></div></Col>
                                    <Col xs={6}><div className="p-3 bg-light rounded-3 border h-100"><div className="text-muted small fw-bold">Area</div><div className="fw-bold text-dark">{student.location}</div></div></Col>
                                </Row>
                                <h6 className="text-uppercase fw-bold text-muted small mb-2">About Me</h6>
                                <p className="text-dark mb-4">{student.bio}</p>
                                <Button variant="primary" size="lg" className="w-100 fw-bold py-3 shadow" style={{ borderRadius: '15px', background: '#0061f2', border: 'none' }} onClick={() => window.location.href = `mailto:${student.email}`}>
                                    Contact {student.name.split(' ')[0]}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}