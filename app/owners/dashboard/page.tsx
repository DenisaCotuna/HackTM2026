'use client'; // Required for hooks like useState and useEffect

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Next.js router
import Link from 'next/link'; // Next.js Link component
import Image from 'next/image'; // Optimized Next.js Images
import { Navbar, Nav, Badge, Dropdown, Card, Button, Row, Col, Container, Tabs, Tab, Table } from 'react-bootstrap';
import { FaBell, FaUser, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

// Make sure to install: npm install react-bootstrap bootstrap react-icons
// Ensure bootstrap CSS is imported in your layout.js

export default function ODashboard() {
    const router = useRouter();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [userName, setUserName] = useState('Jane Smith');
    const fallbackPhoto = 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="100%" height="100%" fill="%23dee2e6"/><text x="50%" y="50%" fill="%23666" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>';
    
    const [unreadNotifications, setUnreadNotifications] = useState(2);
    const [listings, setListings] = useState([
        { id: 1, photo: 'https://via.placeholder.com/150', address: '123 Main St, City Center', price: '€600/month', status: 'Active' },
        { id: 2, photo: 'https://via.placeholder.com/150', address: '456 Elm St, Student Complex', price: '€500/month', status: 'Rented' },
        { id: 3, photo: 'https://via.placeholder.com/150', address: '789 Oak St, Iulius Town', price: '€700/month', status: 'Paused' }
    ]);
    
    const [perfectMatches] = useState([
        { id: 1, name: 'John Doe', university: 'West University of Timisoara', budget: '€500-700', area: 'City Center', score: 95 },
        { id: 2, name: 'Alice Brown', university: 'Politehnica University of Timisoara', budget: '€400-600', area: 'Student Complex', score: 92 }
    ]);

    const [suggestions] = useState([
        { id: 1, name: 'Bob Johnson', university: 'Victor Babes University', budget: '€600-800', area: 'Iulius Town', score: 78 },
        { id: 2, name: 'Charlie Wilson', university: 'University of Life Sciences', budget: '€450-650', area: 'Mehala', score: 85 }
    ]);

    const [appointments] = useState([
        { id: 1, date: '2024-10-15', student: 'John Doe', property: '123 Main St, City Center', status: 'Pending' },
        { id: 2, date: '2024-10-20', student: 'Alice Brown', property: '456 Elm St, Student Complex', status: 'Confirmed' },
        { id: 3, date: '2024-10-25', student: 'Bob Johnson', property: '789 Oak St, Iulius Town', status: 'Pending' }
    ]);

    const handleLogout = () => {
        router.push('/');
    };

    const handleEdit = (id: number) => {
        console.log('Edit listing', id);
    };

    const handleDelete = (id: number) => {
        setListings(listings.filter(listing => listing.id !== id));
    };

    const handleMarkAsRented = (id: number) => {
        setListings(listings.map(listing => listing.id === id ? { ...listing, status: 'Rented' } : listing));
    };

    const handleAddNew = () => {
        router.push('/owners/request');
    };

    const handleViewProfile = (id: number) => {
        router.push('/students/profile');
    };

    const handleViewDetails = (id: number, type: string) => {
        router.push('/match');
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Rented': return 'primary';
            case 'Paused': return 'secondary';
            case 'Pending': return 'warning';
            case 'Confirmed': return 'success';
            default: return 'primary';
        }
    };

    return (
        <div className="o-dashboard">
            <Navbar bg="light" expand="lg" className="top-bar px-4">
                <Navbar.Brand className="welcome-label">
                    Hello, {userName}
                </Navbar.Brand>
                <Nav className="ms-auto d-flex align-items-center">
                    <Nav.Item className="notification-icon me-3 position-relative">
                        <FaBell size={24} />
                        {unreadNotifications > 0 && (
                            <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                                {unreadNotifications}
                            </Badge>
                        )}
                    </Nav.Item>
                    <Nav.Item>
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="link" id="profile-dropdown" className="text-dark">
                                <FaUser size={24} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav.Item>
                </Nav>
            </Navbar>

            <Container className="dashboard-content py-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                    <h2>My Listings</h2>
                    <div className="d-flex gap-2 flex-wrap">
                        <Link href="/owners/search" passHref legacyBehavior>
                            <Button variant="outline-primary">
                                🔎 Search Students
                            </Button>
                        </Link>
                        <Button variant="primary" onClick={handleAddNew}>
                            + Add New Listing
                        </Button>
                    </div>
                </div>

                <Row>
                    {listings.map(listing => (
                        <Col md={4} key={listing.id} className="mb-4">
                            <Card className="h-100">
                                {/* Using standard img for placeholders; if using real images, use Next/Image */}
                                <Card.Img 
                                    variant="top" 
                                    src={listing.photo || fallbackPhoto} 
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <Card.Body>
                                    <Card.Title>{listing.address}</Card.Title>
                                    <Card.Text>
                                        <strong>Price:</strong> {listing.price}<br />
                                        <Badge bg={getStatusVariant(listing.status)}>{listing.status}</Badge>
                                    </Card.Text>
                                    <div className="d-grid gap-2">
                                        <div className="d-flex justify-content-between gap-2">
                                            <Button variant="outline-primary" size="sm" className="w-100" onClick={() => handleEdit(listing.id)}>
                                                <FaEdit /> Edit
                                            </Button>
                                            <Button variant="outline-danger" size="sm" className="w-100" onClick={() => handleDelete(listing.id)}>
                                                <FaTrash /> Delete
                                            </Button>
                                        </div>
                                        <Button variant="success" size="sm" onClick={() => handleMarkAsRented(listing.id)}>
                                            <FaCheck /> Mark as Rented
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Perfect Matches & Suggestions Sections */}
                <h2 className="mt-5 mb-4">My Matches</h2>
                <Tabs defaultActiveKey="perfect" id="matches-tabs" className="mb-3">
                    <Tab eventKey="perfect" title="Perfect Matches 🔥">
                        <Row>
                            {perfectMatches.map(match => (
                                <Col md={4} key={match.id} className="mb-4">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{match.name}</Card.Title>
                                            <Card.Text>
                                                <strong>University:</strong> {match.university}<br />
                                                <strong>Budget:</strong> {match.budget}<br />
                                                <strong>Match Score:</strong> {match.score}%
                                            </Card.Text>
                                            <Button variant="primary" onClick={() => handleViewProfile(match.id)}>
                                                View Profile
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Tab>
                    <Tab eventKey="suggestions" title="Suggestions 💡">
                        <Row>
                            {suggestions.map(match => (
                                <Col md={4} key={match.id} className="mb-4">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{match.name}</Card.Title>
                                            <Card.Text>
                                                <strong>University:</strong> {match.university}<br />
                                                <strong>Match Score:</strong> {match.score}%
                                            </Card.Text>
                                            <Button variant="primary" onClick={() => handleViewProfile(match.id)}>
                                                View Profile
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Tab>
                </Tabs>

                <h2 className="mt-5 mb-4">My Appointments</h2>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Student Name</th>
                            <th>Property</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(appointment => (
                            <tr key={appointment.id}>
                                <td>{appointment.date}</td>
                                <td>{appointment.student}</td>
                                <td>{appointment.property}</td>
                                <td><Badge bg={getStatusVariant(appointment.status)}>{appointment.status}</Badge></td>
                                <td>
                                    <Button variant="primary" size="sm" onClick={() => handleViewDetails(appointment.id, 'appointment')}>
                                        View Details
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}