import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import Select from 'react-select';
import './ORequest.css';
import { Link } from 'react-router-dom';

const propertyTypes = [
  { value: 'Room in shared flat', label: 'Room in shared flat' },
  { value: 'Studio', label: 'Studio' },
  { value: 'Full apartment', label: 'Full apartment' }
];

const areaOptions = [
    { value: 'City Center', label: 'City Center' },
    { value: 'Student Complex', label: 'Student Complex' },
    { value: 'Iulius Town', label: 'Iulius Town' },
    { value: 'Buziasului', label: 'Buziasului' },
    { value: 'Mehala', label: 'Mehala' },
    { value: 'Freidorf', label: 'Freidorf' },
    { value: 'Ghiroda', label: 'Ghiroda' },
    { value: 'Dumbravita', label: 'Dumbravita' },
    { value: 'Lipovei', label: 'Lipovei' },
    { value: 'Calea Sagului', label: 'Calea Sagului' },
    { value: 'Calea Aradului', label: 'Calea Aradului' },
    { value: 'Calea Lugojului', label: 'Calea Lugojului' },
    { value: 'Calea Martirilor', label: 'Calea Martirilor' },
    { value: 'Calea Torontalului', label: 'Calea Torontalului' },
    { value: 'Calea Stan Vidrighin', label: 'Calea Stan Vidrighin' },
    { value: 'Other', label: 'Other' }
];
const tenantGenders = [
  'Any',
  'Male',
  'Female',
  'Non-binary'
];

function ORequest() {
  const navigate = useNavigate();
  const [listingTitle, setListingTitle] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [address, setAddress] = useState('');
  const [preferredArea, setPreferredArea] = useState(null);
  const [price, setPrice] = useState('');
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [insuranceRequired, setInsuranceRequired] = useState(false);
  const [maxTenants, setMaxTenants] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableUntil, setAvailableUntil] = useState('');
  const [preferredGender, setPreferredGender] = useState('Any');
  const [internationalStudents, setInternationalStudents] = useState(false);
  const [smokersAllowed, setSmokersAllowed] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const validationErrors = {};

    if (!listingTitle.trim()) validationErrors.listingTitle = 'Listing title is required';
    if (!propertyType) validationErrors.propertyType = 'Property type is required';
    if (!address.trim()) validationErrors.address = 'Address is required';
    if (!preferredArea) {
        validationErrors.preferredArea = 'Please select a preferred area';
    }
    if (!price) validationErrors.price = 'Price per month is required';
    else if (isNaN(price) || Number(price) <= 0) validationErrors.price = 'Enter a valid monthly price';
    if (!maxTenants) validationErrors.maxTenants = 'Maximum tenants is required';
    else if (!Number.isInteger(Number(maxTenants)) || Number(maxTenants) <= 0) validationErrors.maxTenants = 'Enter a valid number of tenants';
    if (!availableFrom) validationErrors.availableFrom = 'Available from date is required';
    if (availableUntil && availableFrom && new Date(availableUntil) < new Date(availableFrom)) {
      validationErrors.availableUntil = 'Available until must be after available from';
    }
    if (!preferredGender) validationErrors.preferredGender = 'Preferred tenant gender is required';

    return validationErrors;
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    setPhotos((prevPhotos) => [...prevPhotos, ...files]);
    event.target.value = null;
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});
    setSubmitted(true);

    console.log('Posted listing:', {
      listingTitle,
      propertyType,
      address,
      preferredArea: preferredArea ? preferredArea.value : null,
      price,
      utilitiesIncluded,
      furnished,
      insuranceRequired,
      maxTenants,
      availableFrom,
      availableUntil,
      preferredGender,
      internationalStudents,
      smokersAllowed,
      petsAllowed,
      description,
      photos
    });
  };

  const handleCancel = () => {
    navigate('/Odashboard');
  };

  return (
    <Container className="o-request-page py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="o-request-card p-4 shadow-sm bg-white rounded">
            <h2 className="mb-4">Post a Property Listing</h2>

            {submitted && (
              <Alert variant="success" onClose={() => setSubmitted(false)} dismissible>
                Your listing form has been submitted successfully.
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="listingTitle">
                <Form.Label>Listing title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter listing title"
                  value={listingTitle}
                  onChange={(e) => setListingTitle(e.target.value)}
                  isInvalid={!!errors.listingTitle}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.listingTitle}
                </Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="propertyType">
                    <Form.Label>Property type</Form.Label>
                    <Form.Select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      isInvalid={!!errors.propertyType}
                    >
                      <option value="">Select property type</option>
                      {propertyTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.propertyType}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPreferredArea">
                        <Form.Label>Preferred Area/Zone</Form.Label>
                            <Select
                                options={areaOptions}
                                value={preferredArea}
                                onChange={setPreferredArea}
                                placeholder="Select preferred area"
                                isSearchable
                                className={errors.preferredArea ? 'is-invalid' : ''}
                            />
                            {errors.preferredArea && (
                                <div className="invalid-feedback d-block">
                                    {errors.preferredArea}
                                </div>
                                )}
                    </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  isInvalid={!!errors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address}
                </Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="price">
                    <Form.Label>Price per month (€)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="e.g. 650"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      isInvalid={!!errors.price}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.price}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="maxTenants">
                    <Form.Label>Max number of tenants</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      placeholder="e.g. 3"
                      value={maxTenants}
                      onChange={(e) => setMaxTenants(e.target.value)}
                      isInvalid={!!errors.maxTenants}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.maxTenants}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="availableFrom">
                    <Form.Label>Available from</Form.Label>
                    <Form.Control
                      type="date"
                      value={availableFrom}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                      isInvalid={!!errors.availableFrom}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.availableFrom}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="availableUntil">
                    <Form.Label>Available until (optional)</Form.Label>
                    <Form.Control
                      type="date"
                      value={availableUntil}
                      onChange={(e) => setAvailableUntil(e.target.value)}
                      min={availableFrom || undefined}
                      isInvalid={!!errors.availableUntil}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.availableUntil}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="preferredGender">
                    <Form.Label>Preferred tenant gender</Form.Label>
                    <Form.Select
                      value={preferredGender}
                      onChange={(e) => setPreferredGender(e.target.value)}
                      isInvalid={!!errors.preferredGender}
                    >
                      <option value="">Select gender preference</option>
                      {tenantGenders.map((gender) => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.preferredGender}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6} className="d-flex flex-column justify-content-end">
                  <Form.Text className="text-muted">
                    Leave gender as Any if you have no preference.
                  </Form.Text>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Check
                    type="checkbox"
                    id="utilitiesIncluded"
                    label="Utilities included"
                    checked={utilitiesIncluded}
                    onChange={(e) => setUtilitiesIncluded(e.target.checked)}
                  />
                </Col>
                <Col md={4}>
                  <Form.Check
                    type="checkbox"
                    id="furnished"
                    label="Furnished"
                    checked={furnished}
                    onChange={(e) => setFurnished(e.target.checked)}
                  />
                </Col>
                <Col md={4}>
                  <Form.Check
                    type="checkbox"
                    id="insuranceRequired"
                    label="Insurance required from tenant"
                    checked={insuranceRequired}
                    onChange={(e) => setInsuranceRequired(e.target.checked)}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Check
                    type="checkbox"
                    id="internationalStudents"
                    label="Accepts international students"
                    checked={internationalStudents}
                    onChange={(e) => setInternationalStudents(e.target.checked)}
                  />
                </Col>
                <Col md={4}>
                  <Form.Check
                    type="checkbox"
                    id="smokersAllowed"
                    label="Smokers allowed"
                    checked={smokersAllowed}
                    onChange={(e) => setSmokersAllowed(e.target.checked)}
                  />
                </Col>
                <Col md={4}>
                  <Form.Check
                    type="checkbox"
                    id="petsAllowed"
                    label="Pets allowed"
                    checked={petsAllowed}
                    onChange={(e) => setPetsAllowed(e.target.checked)}
                  />
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Describe the property, surroundings, amenities, and tenant preferences"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="photos">
                <Form.Label>Property photos</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {photos.length > 0 && (
                  <div className="photo-list mt-2">
                    {photos.map((photo, index) => (
                      <div key={index} className="photo-chip">
                        <span className="photo-name">{photo.name}</span>
                        <button
                          type="button"
                          className="photo-remove"
                          onClick={() => handleRemovePhoto(index)}
                          aria-label={`Remove ${photo.name}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>

              <div className="d-flex justify-content-between gap-2">
                <Button variant="secondary" onClick={handleCancel} className="flex-grow-1">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="flex-grow-1">
                  Post Listing
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ORequest;
