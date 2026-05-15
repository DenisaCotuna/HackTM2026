"use client";

import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import type { FormEvent } from "react";

import Link from "next/link";
import Image from "next/image";

import { getData } from "country-list";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

import "./register.css";
import RegisterLogo from "./logo.png";

const countryOptions = getData().map((country) => ({
  value: country.code,
  label: country.name,
}));

const universityYears: Record<string, string[]> = {
  uvt: ["1st", "2nd", "3rd", "4th", "Masters", "PhD"],
  upt: ["1st", "2nd", "3rd", "4th", "5th", "Masters", "PhD"],
  umft: [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "Masters",
    "PhD",
  ],
  usabtm: ["1st", "2nd", "3rd", "4th", "Masters", "PhD"],
};

const areaOptions = [
  { value: "City Center", label: "City Center" },
  { value: "Student Complex", label: "Student Complex" },
  { value: "Iulius Town", label: "Iulius Town" },
  { value: "Buziasului", label: "Buziasului" },
  { value: "Mehala", label: "Mehala" },
  { value: "Freidorf", label: "Freidorf" },
  { value: "Ghiroda", label: "Ghiroda" },
  { value: "Dumbravita", label: "Dumbravita" },
  { value: "Lipovei", label: "Lipovei" },
  { value: "Calea Sagului", label: "Calea Sagului" },
  { value: "Calea Aradului", label: "Calea Aradului" },
  { value: "Calea Lugojului", label: "Calea Lugojului" },
  { value: "Calea Martirilor", label: "Calea Martirilor" },
  {
    value: "Calea Torontalului",
    label: "Calea Torontalului",
  },
  {
    value: "Calea Stan Vidrighin",
    label: "Calea Stan Vidrighin",
  },
  { value: "Other", label: "Other" },
];

export default function RegisterPage() {
  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [phone, setPhone] = useState("");

  const [userType, setUserType] =
    useState("student");

  const [university, setUniversity] = useState("");
  const [gender, setGender] = useState("");

  const [nationality, setNationality] =
    useState<any>(null);

  const [studyField, setStudyField] = useState("");
  const [studyYear, setStudyYear] = useState("");


  const [profilePhoto, setProfilePhoto] =
    useState<File | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName) {
      newErrors.fullName =
        "Full name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (
      !/\S+@\S+\.\S+/.test(email)
    ) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password =
        "Password is required";
    } else if (password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      confirmPassword !== password
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    if (!nationality) {
      newErrors.nationality =
        "Please select nationality";
    }

    if (!gender) {
      newErrors.gender =
        "Please select gender";
    }

    if (!phone) {
      newErrors.phone =
        "Phone number is required";
    }

    if (userType === "student") {
      if (!university) {
        newErrors.university =
          "Please select university";
      }

      if (!studyField) {
        newErrors.studyField =
          "Please enter study field";
      }

      if (!studyYear) {
        newErrors.studyYear =
          "Please select study year";
      }

    }

    return newErrors;
  };

 const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  console.log("Submitting form...");
  event.preventDefault();

  const formErrors = validateForm();

  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  setErrors({});

   const formData = new FormData();

   formData.append("fullName", fullName);
   formData.append("email", email);
   formData.append("password", password);
   formData.append("nationality", nationality?.value || "");
   formData.append("gender", gender);
   formData.append("phone", phone);
   formData.append("userType", userType);

   if (userType === "student") {
     formData.append("university", university);
     formData.append("studyField", studyField);
     formData.append("studyYear", studyYear);
   }

   if (profilePhoto) {
     formData.append("profilePhoto", profilePhoto);
   }

   const res = await fetch("/api/register", {
     method: "POST",
     body: formData,
   });


  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  alert("Account created!");
};

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="text-center mb-2">
            <Image
              src={RegisterLogo}
              alt="App Logo"
              className="register-logo"
            />
          </div>

          <Card className="shadow p-4">
            <h2 className="text-center mb-4">
              Create an Account
            </h2>

            <div className="text-center mb-3">
              <p>
                Already have an account?{" "}
                <Link href="/">
                  Log in
                </Link>
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group
                className="mb-3"
              >
                <Form.Label>
                  Full Name
                </Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(
                      e.target.value
                    )
                  }
                  isInvalid={
                    !!errors.fullName
                  }
                />

                <Form.Control.Feedback type="invalid">
                  {errors.fullName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Email
                </Form.Label>

                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  isInvalid={
                    !!errors.email
                  }
                />

                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Password
                </Form.Label>

                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  isInvalid={
                    !!errors.password
                  }
                />

                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Confirm Password
                </Form.Label>

                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  isInvalid={
                    !!errors.confirmPassword
                  }
                />

                <Form.Control.Feedback type="invalid">
                  {
                    errors.confirmPassword
                  }
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Country
                </Form.Label>

                <Select
                  options={countryOptions}
                  value={nationality}
                  onChange={(option) =>
                    setNationality(
                      option
                    )
                  }
                  isSearchable
                />

                {errors.nationality && (
                  <div className="text-danger mt-1">
                    {
                      errors.nationality
                    }
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Gender
                </Form.Label>

                <Form.Select
                  value={gender}
                  onChange={(e) =>
                    setGender(
                      e.target.value
                    )
                  }
                  isInvalid={
                    !!errors.gender
                  }
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="male">
                    Male
                  </option>

                  <option value="female">
                    Female
                  </option>

                  <option value="other">
                    Other
                  </option>
                </Form.Select>

                <Form.Control.Feedback type="invalid">
                  {errors.gender}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Phone Number
                </Form.Label>

                <Form.Control
                  type="text"
                  placeholder="+40712345678"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  isInvalid={
                    !!errors.phone
                  }
                />

                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Profile Photo
                </Form.Label>

                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfilePhoto(
                      (e.target as HTMLInputElement).files?.[0] ||
                        null
                    )
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  User Type
                </Form.Label>

                <Form.Select
                  value={userType}
                  onChange={(e) =>
                    setUserType(
                      e.target.value
                    )
                  }
                >
                  <option value="student">
                    Student
                  </option>

                  <option value="landlord">
                    Landlord
                  </option>
                </Form.Select>
              </Form.Group>
              {userType === 'student' && (
  <>
    <Form.Group className="mb-3" controlId='formUniversity'>
      <Form.Label>University</Form.Label>
      <Form.Select
        value={university}
        onChange={(e) => {
          setUniversity(e.target.value);
          setStudyYear('');
        }}
        isInvalid={!!errors.university}
      >
        <option value="">Select your university</option>
        <option value="uvt">West University of Timisoara</option>
        <option value="upt">Politehnica University of Timisoara</option>
        <option value="umft">Victor Babes University of Medicine and Pharmacy</option>
        <option value="usabtm">University of Life Sciences "King Mihai I"</option>
      </Form.Select>

      <Form.Control.Feedback type="invalid">
        {errors.university}
      </Form.Control.Feedback>
    </Form.Group>

    <Form.Group className="mb-3" controlId='formStudyField'>
      <Form.Label>Field of Study</Form.Label>
      <Form.Control
        type="text"
        value={studyField}
        onChange={(e) => setStudyField(e.target.value)}
        isInvalid={!!errors.studyField}
      />
      <Form.Control.Feedback type="invalid">
        {errors.studyField}
      </Form.Control.Feedback>
    </Form.Group>

    <Form.Group className="mb-3" controlId='formStudyYear'>
      <Form.Label>Year of Study</Form.Label>
      <Form.Select
        value={studyYear}
        onChange={(e) => setStudyYear(e.target.value)}
        disabled={!university}
        isInvalid={!!errors.studyYear}
      >
        <option value="">
          {university ? 'Select your year of study' : 'First select your university'}
        </option>

        {university &&
          universityYears[university].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
      </Form.Select>

      <Form.Control.Feedback type="invalid">
        {errors.studyYear}
      </Form.Control.Feedback>
    </Form.Group>
  </>
)}

              <Button
                variant="primary"
                type="submit"
                className="submit-button"
              >
                Create Account
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}