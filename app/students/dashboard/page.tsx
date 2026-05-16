'use client';

import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Nav,
  Badge,
  Dropdown,
  Card,
  Button,
  Row,
  Col,
  Container,
  Tabs,
  Tab,
  Table,
} from 'react-bootstrap';
import { FaBell, FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './dashboard.css'

type Request = {
  id: number;
  area: string;
  budget: string;
  moveInDate: string;
  status: string;
};

type Match = {
  id: number;
  photo: string;
  location: string;
  price: string;
  owner: string;
  score: number;
};

type Appointment = {
  id: number;
  date: string;
  address: string;
  owner: string;
  status: string;
};

const SDashboard: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [userName, setUserName] = useState<string>('John Doe');
  const fallbackPhoto =
  'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="100%25" height="100%25" fill="%23dee2e6"/><text x="50%25" y="50%25" fill="%23666" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>';
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3);
  const [requests, setRequests] = useState<Request[]>([
    { id: 1, area: 'City Center', budget: '€500-700', moveInDate: '2024-10-01', status: 'Active' },
    { id: 2, area: 'Student Complex', budget: '€400-600', moveInDate: '2024-09-15', status: 'Matched' },
    { id: 3, area: 'Iulius Town', budget: '€600-800', moveInDate: '2024-11-01', status: 'Closed' },
  ]);
  const [perfectMatches, setPerfectMatches] = useState<Match[]>([
    { id: 1, photo: 'https://images.ctfassets.net/pg6xj64qk0kh/2r4QaBLvhQFH1mPGljSdR9/39b737d93854060282f6b4a9b9893202/camden-paces-apartments-buckhead-ga-terraces-living-room-with-den_1.jpg?w=960', location: 'City Center', price: '€600/month', owner: 'John Smith', score: 95 },
    { id: 2, photo: 'https://draperandkramer.com/wp-content/uploads/2020/04/insights-what-does-a-renovated-apartment-mean-draperandkramer_20200408_header-image.png', location: 'Student Complex', price: '€500/month', owner: 'Jane Doe', score: 92 },
  ]);
  const [suggestions, setSuggestions] = useState<Match[]>([
    { id: 1, photo: 'https://via.placeholder.com/150', location: 'Iulius Town', price: '€700/month', owner: 'Bob Johnson', score: 78 },
    { id: 2, photo: 'https://via.placeholder.com/150', location: 'Mehala', price: '€450/month', owner: 'Alice Brown', score: 85 },
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, date: '2024-10-15', address: '123 Main St, City Center', owner: 'John Smith', status: 'Pending' },
    { id: 2, date: '2024-10-20', address: '456 Elm St, Student Complex', owner: 'Jane Doe', status: 'Confirmed' },
    { id: 3, date: '2024-10-25', address: '789 Oak St, Iulius Town', owner: 'Bob Johnson', status: 'Pending' },
  ]);

  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleEdit = (id: number) => {
    console.log('Edit request', id);
  };

  const handleDelete = (id: number) => {
    setRequests(requests.filter((req) => req.id !== id));
  };

  const handlePostNew = () => {
    console.log('Post new request');
  };

  

 useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/"); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "Student") { router.push("/"); return; }
    setUser(parsed);
    setUserName(parsed.fullName || "Student"); // add this
  }, []);
  if (!user) return <p>Loading...</p>;

  const handleViewDetails = (id: number, type?: 'appointment' | 'match') => {
    console.log('View details', id, type);
    router.push('/match');
  };

  const getStatusVariant = (status: string): string => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Matched':
        return 'warning';
      case 'Closed':
        return 'secondary';
      case 'Pending':
        return 'warning';
      case 'Confirmed':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <div className="s-dashboard">
      <Navbar bg="light" expand="lg" className="top-bar">
        <Navbar.Brand className="welcome-label">Hello, {userName}</Navbar.Brand>
        <Nav className="ml-auto d-flex align-items-center">
          <Nav.Item className="notification-icon">
            <FaBell size={24} />
            {unreadNotifications > 0 && (
              <Badge pill bg="danger" className="notification-badge">
                {unreadNotifications}
              </Badge>
            )}
          </Nav.Item>
          <Nav.Item>
            <Dropdown>
              <Dropdown.Toggle variant="link" id="profile-dropdown">
                <FaUser size={24} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav.Item>
        </Nav>
      </Navbar>
      <Container className="dashboard-content">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <h2>My Active Requests</h2>
          <div className="d-flex gap-2 flex-wrap dashboard-actions">
            <Link href="/students/search">
              <Button variant="outline-primary" className="dashboard-action-btn">
                🔎 Search Listings
              </Button>
            </Link>
            <Link href="/students/request">
              <Button variant="primary" className="dashboard-action-btn" onClick={handlePostNew}>
                + Post New Request
              </Button>
            </Link>
          </div>
        </div>
        <Row>
          {requests.map((request) => (
            <Col md={4} key={request.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{request.area}</Card.Title>
                  <Card.Text>
                    <strong>Budget:</strong> {request.budget}
                    <br />
                    <strong>Move-in Date:</strong> {request.moveInDate}
                    <br />
                    <Badge bg={getStatusVariant(request.status)}>{request.status}</Badge>
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(request.id)}>
                      <FaEdit /> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(request.id)}>
                      <FaTrash /> Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <h2 className="mt-5 mb-4">My Matches</h2>
        <Tabs defaultActiveKey="perfect" id="matches-tabs">
          <Tab eventKey="perfect" title="Perfect Matches 🔥">
            <Row className="mt-4">
              {perfectMatches.map((match) => (
                <Col md={4} key={match.id} className="mb-4">
                  <Card>
                    <Card.Img
                      variant="top"
                      src={match.photo || fallbackPhoto}
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackPhoto;
                      }}
                    />
                    <Card.Body>
                      <Card.Title>{match.location}</Card.Title>
                      <Card.Text>
                        <strong>Price:</strong> {match.price}
                        <br />
                        <strong>Owner:</strong> {match.owner}
                        <br />
                        <strong>Match Score:</strong> {match.score}%
                      </Card.Text>
                      <Button variant="primary" onClick={() => handleViewDetails(match.id)}>
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab>
          <Tab eventKey="suggestions" title="Suggestions 💡">
            <Row className="mt-4">
              {suggestions.map((match) => (
                <Col md={4} key={match.id} className="mb-4">
                  <Card>
                    <Card.Img
                      variant="top"
                      src={match.photo || fallbackPhoto}
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackPhoto;
                      }}
                    />
                    <Card.Body>
                      <Card.Title>{match.location}</Card.Title>
                      <Card.Text>
                        <strong>Price:</strong> {match.price}
                        <br />
                        <strong>Owner:</strong> {match.owner}
                        <br />
                        <strong>Match Score:</strong> {match.score}%
                      </Card.Text>
                      <Button variant="primary" onClick={() => handleViewDetails(match.id)}>
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab>
        </Tabs>
        <h2 className="mt-5 mb-4">My Appointments</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Property Address</th>
              <th>Owner Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.date}</td>
                <td>{appointment.address}</td>
                <td>{appointment.owner}</td>
                <td>
                  <Badge bg={getStatusVariant(appointment.status)}>{appointment.status}</Badge>
                </td>
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
};

export default SDashboard;