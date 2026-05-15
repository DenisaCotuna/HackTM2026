'use client';

import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Select, { MultiValue } from 'react-select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './request.css';

type SelectOption = {
  value: string;
  label: string;
};

type Errors = {
  title?: string;
  preferredArea?: string;
  minBudget?: string;
  maxBudget?: string;
  moveInDate?: string;
  moveOutDate?: string;
  propertyType?: string;
};

const areaOptions: SelectOption[] = [
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
  { value: 'Other', label: 'Other' },
];

const propertyTypes: SelectOption[] = [
  { value: 'Room', label: 'Room' },
  { value: 'Apartment', label: 'Apartment' },
  { value: 'Studio', label: 'Studio' },
  { value: 'Any', label: 'Any' },
];

const SRequest: React.FC = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [title, setTitle] = useState('');
  const [preferredArea, setPreferredArea] = useState<MultiValue<SelectOption>>([]);
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [moveOutDate, setMoveOutDate] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [furnished, setFurnished] = useState('');
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [smokerFriendly, setSmokerFriendly] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!preferredArea.length) {
      newErrors.preferredArea = 'Please select a preferred area';
    }
    if (!minBudget) {
      newErrors.minBudget = 'Minimum budget is required';
    } else if (isNaN(Number(minBudget)) || Number(minBudget) <= 0) {
      newErrors.minBudget = 'Please enter a valid minimum budget';
    }
    if (!maxBudget) {
      newErrors.maxBudget = 'Maximum budget is required';
    } else if (isNaN(Number(maxBudget)) || Number(maxBudget) <= 0) {
      newErrors.maxBudget = 'Please enter a valid maximum budget';
    }
    if (minBudget && maxBudget && Number(minBudget) > Number(maxBudget)) {
      newErrors.maxBudget = 'Maximum budget must be greater than minimum budget';
    }
    if (!moveInDate) {
      newErrors.moveInDate = 'Move-in date is required';
    } else if (new Date(moveInDate) < new Date()) {
      newErrors.moveInDate = 'Move-in date cannot be in the past';
    }
    if (moveOutDate && new Date(moveOutDate) <= new Date(moveInDate)) {
      newErrors.moveOutDate = 'Move-out date must be after move-in date';
    }
    if (!propertyType) {
      newErrors.propertyType = 'Please select a property type';
    }

    return newErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTimeout(() => {
        const firstErrorField = document.querySelector('.is-invalid');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      setErrors({});
      console.log('Request posted:', {
        title,
        preferredArea: preferredArea.map((item) => item.value),
        minBudget,
        maxBudget,
        moveInDate,
        moveOutDate,
        propertyType,
        furnished,
        utilitiesIncluded,
        petsAllowed,
        smokerFriendly,
        additionalNotes,
      });
    }
  };

  const handleCancel = (): void => {
    router.push('/students/dashboard');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="request-form-container">
            <h2 className="text-center mb-4">Post a Student Request</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Looking for a room near UPT"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPreferredArea">
                <Form.Label>Preferred Area/Zone</Form.Label>
                <Select
                  options={areaOptions}
                  value={preferredArea}
                  onChange={(value) => setPreferredArea(value as MultiValue<SelectOption>)}
                  placeholder="Select preferred area"
                  isSearchable
                  isMulti
                  className={errors.preferredArea ? 'is-invalid' : ''}
                />
                {errors.preferredArea && (
                  <div className="invalid-feedback d-block">
                    {errors.preferredArea}
                  </div>
                )}
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formMinBudget">
                    <Form.Label>Min Budget (€)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                      isInvalid={!!errors.minBudget}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.minBudget}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formMaxBudget">
                    <Form.Label>Max Budget (€)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      isInvalid={!!errors.maxBudget}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.maxBudget}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formMoveInDate">
                    <Form.Label>Move-in Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={moveInDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      isInvalid={!!errors.moveInDate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.moveInDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formMoveOutDate">
                    <Form.Label>Move-out Date (Optional)</Form.Label>
                    <Form.Control
                      type="date"
                      value={moveOutDate}
                      min={moveInDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setMoveOutDate(e.target.value)}
                      isInvalid={!!errors.moveOutDate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.moveOutDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="formPropertyType">
                <Form.Label>Property Type Preferred</Form.Label>
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

              <Form.Group className="mb-3" controlId="formFurnished">
                <Form.Label>Furnished?</Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Yes"
                    name="furnished"
                    type="radio"
                    checked={furnished === 'yes'}
                    onChange={() => setFurnished('yes')}
                  />
                  <Form.Check
                    inline
                    label="No"
                    name="furnished"
                    type="radio"
                    checked={furnished === 'no'}
                    onChange={() => setFurnished('no')}
                  />
                  <Form.Check
                    inline
                    label="No preference"
                    name="furnished"
                    type="radio"
                    checked={furnished === 'no_preference'}
                    onChange={() => setFurnished('no_preference')}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Utilities must be included"
                  checked={utilitiesIncluded}
                  onChange={(e) => setUtilitiesIncluded(e.target.checked)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Pets allowed"
                  checked={petsAllowed}
                  onChange={(e) => setPetsAllowed(e.target.checked)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Smoker friendly"
                  checked={smokerFriendly}
                  onChange={(e) => setSmokerFriendly(e.target.checked)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAdditionalNotes">
                <Form.Label>Additional Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any additional requirements or notes..."
                />
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={handleCancel} type="button">
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Post Request
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SRequest;