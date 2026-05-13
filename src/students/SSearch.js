import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import './SSearch.css';

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

const propertyTypes = [
  'Room in shared flat',
  'Studio',
  'Full apartment'
];

const sortOptions = [
  'Price low-high',
  'Price high-low',
  'Newest'
];

const sampleListings = [
  {
    id: 1,
    photo: 'https://via.placeholder.com/320x210?text=Cozy+Room',
    title: 'Bright room near city center',
    area: 'City Center',
    price: 520,
    availableFrom: '2026-06-01',
    furnished: true,
    utilitiesIncluded: true,
    propertyType: 'Room in shared flat',
    createdAt: '2026-05-10'
  },
  {
    id: 2,
    photo: 'https://via.placeholder.com/320x210?text=Studio+Apartment',
    title: 'Modern studio with balcony',
    area: 'Student Complex',
    price: 720,
    availableFrom: '2026-05-20',
    furnished: true,
    utilitiesIncluded: false,
    propertyType: 'Studio',
    createdAt: '2026-05-12'
  },
  {
    id: 3,
    photo: 'https://via.placeholder.com/320x210?text=Full+Apartment',
    title: 'Full apartment next to university',
    area: 'Iulius Town',
    price: 950,
    availableFrom: '2026-06-10',
    furnished: false,
    utilitiesIncluded: true,
    propertyType: 'Full apartment',
    createdAt: '2026-05-05'
  },
  {
    id: 4,
    photo: 'https://via.placeholder.com/320x210?text=Student+Room',
    title: 'Shared flat room, utilities included',
    area: 'Mehala',
    price: 480,
    availableFrom: '2026-05-25',
    furnished: false,
    utilitiesIncluded: true,
    propertyType: 'Room in shared flat',
    createdAt: '2026-05-08'
  },
  {
    id: 5,
    photo: 'https://via.placeholder.com/320x210?text=Chic+Studio',
    title: 'Chic studio with quick tram access',
    area: 'Buziasului',
    price: 650,
    availableFrom: '2026-06-05',
    furnished: true,
    utilitiesIncluded: false,
    propertyType: 'Studio',
    createdAt: '2026-05-11'
  },
  {
    id: 6,
    photo: 'https://via.placeholder.com/320x210?text=Spacious+Apartment',
    title: 'Spacious full apartment, pets allowed',
    area: 'Ghiroda',
    price: 890,
    availableFrom: '2026-05-30',
    furnished: true,
    utilitiesIncluded: true,
    propertyType: 'Full apartment',
    createdAt: '2026-05-07'
  }
];

function SSearch() {
  const fallbackPhoto = 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="210"><rect width="100%" height="100%" fill="%23dee2e6"/><text x="50%" y="50%" fill="%23666" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>';
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [areaZone, setAreaZone] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [furnishedOnly, setFurnishedOnly] = useState(false);
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(false);
  const [sortBy, setSortBy] = useState('Price low-high');
  const [filteredListings, setFilteredListings] = useState(sampleListings);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 4;

  const handleSearch = () => {
    const minValue = minBudget ? Number(minBudget) : 0;
    const maxValue = maxBudget ? Number(maxBudget) : Infinity;

    const results = sampleListings.filter((listing) => {
      const matchesBudget = listing.price >= minValue && listing.price <= maxValue;
      const matchesArea = areaZone ? listing.area === areaZone : true;
      const matchesDate = availableFrom ? new Date(listing.availableFrom) >= new Date(availableFrom) : true;
      const matchesType = propertyType ? listing.propertyType === propertyType : true;
      const matchesFurnished = furnishedOnly ? listing.furnished === true : true;
      const matchesUtilities = utilitiesIncluded ? listing.utilitiesIncluded === true : true;
      return matchesBudget && matchesArea && matchesDate && matchesType && matchesFurnished && matchesUtilities;
    });

    const sorted = [...results].sort((a, b) => {
      if (sortBy === 'Price low-high') return a.price - b.price;
      if (sortBy === 'Price high-low') return b.price - a.price;
      if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

    setFilteredListings(sorted);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setMinBudget('');
    setMaxBudget('');
    setAreaZone('');
    setAvailableFrom('');
    setPropertyType('');
    setFurnishedOnly(false);
    setUtilitiesIncluded(false);
    setSortBy('Price low-high');
    setFilteredListings(sampleListings);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / listingsPerPage));
  const pageItems = filteredListings.slice((currentPage - 1) * listingsPerPage, currentPage * listingsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'prev') {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    } else {
      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    }
  };

  return (
    <Container className="s-search-page py-5">
      <Row>
        <Col xs={12} className="mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h2>Search Listings</h2>
              <p className="text-muted mb-0">Find the best student housing offers with filters and sorting.</p>
            </div>
            <Link to="/Sdashboard">
              <Button variant="outline-secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </Col>
      </Row>
      <Row className="g-4">
        <Col lg={4}>
          <Card className="filter-panel shadow-sm">
            <Card.Body>
              <Card.Title>Filter Listings</Card.Title>
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
                  <Form.Label>Area/Zone</Form.Label>
                  <Form.Select value={areaZone} onChange={(e) => setAreaZone(e.target.value)}>
                    <option value="">Any area</option>
                    {areaZones.map((zone) => (
                      <option key={zone} value={zone}>{zone}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="availableFrom">
                  <Form.Label>Available from</Form.Label>
                  <Form.Control
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="propertyType">
                  <Form.Label>Property type</Form.Label>
                  <Form.Select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                    <option value="">Any type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2" controlId="furnishedOnly">
                  <Form.Check
                    type="checkbox"
                    label="Furnished only"
                    checked={furnishedOnly}
                    onChange={(e) => setFurnishedOnly(e.target.checked)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="utilitiesIncluded">
                  <Form.Check
                    type="checkbox"
                    label="Utilities included"
                    checked={utilitiesIncluded}
                    onChange={(e) => setUtilitiesIncluded(e.target.checked)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="sortBy">
                  <Form.Label>Sort by</Form.Label>
                  <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    {sortOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <div className="d-flex gap-2 flex-wrap">
                  <Button variant="primary" onClick={handleSearch} className="flex-grow-1">
                    Search
                  </Button>
                  <Button variant="outline-secondary" onClick={handleReset} className="flex-grow-1">
                    Reset filters
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <div className="results-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
            <div>
              <h4 className="mb-1">{filteredListings.length} results found</h4>
              <p className="text-muted mb-0">Showing page {currentPage} of {totalPages}</p>
            </div>
          </div>

          {pageItems.length === 0 ? (
            <Card className="p-4 text-center">
              <p className="mb-0">No listings match your filters yet.</p>
            </Card>
          ) : (
            <Row className="g-4">
              {pageItems.map((listing) => (
                <Col md={6} key={listing.id}>
                  <Card className="listing-card h-100 shadow-sm">
                    <div className="listing-image-wrapper">
                      <Card.Img
                        variant="top"
                        src={listing.photo || fallbackPhoto}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackPhoto;
                        }}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                        <Card.Title className="mb-0">{listing.title}</Card.Title>
                        <Badge bg={listing.furnished ? 'success' : 'secondary'}>
                          {listing.furnished ? 'Furnished' : 'Unfurnished'}
                        </Badge>
                      </div>
                      <Card.Text className="mb-2">
                        <strong>Area:</strong> {listing.area}<br />
                        <strong>Price:</strong> €{listing.price}/month<br />
                        <strong>Available from:</strong> {listing.availableFrom}
                      </Card.Text>
                      <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
                        <span className="text-muted small">{listing.utilitiesIncluded ? 'Utilities included' : 'Utilities not included'}</span>
                        <Button variant="outline-primary" size="sm">
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <div className="pagination-controls d-flex justify-content-between align-items-center mt-4 gap-2">
            <Button variant="outline-secondary" onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
              Previous
            </Button>
            <div className="text-muted">Page {currentPage} of {totalPages}</div>
            <Button variant="outline-secondary" onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SSearch;
