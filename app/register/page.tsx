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


const countryMap: Record<string, number> = {
  Afghanistan: 1,
  Albania: 2,
  Algeria: 3,
  Andorra: 4,
  Angola: 5,
  "Antigua and Barbuda": 6,
  Argentina: 7,
  Armenia: 8,
  Australia: 9,
  Austria: 10,
  Azerbaijan: 11,
  Bahamas: 12,
  Bahrain: 13,
  Bangladesh: 14,
  Barbados: 15,
  Belarus: 16,
  Belgium: 17,
  Belize: 18,
  Benin: 19,
  Bhutan: 20,
  Bolivia: 21,
  "Bosnia and Herzegovina": 22,
  Botswana: 23,
  Brazil: 24,
  Brunei: 25,
  Bulgaria: 26,
  "Burkina Faso": 27,
  Burundi: 28,
  "Cabo Verde": 29,
  Cambodia: 30,
  Cameroon: 31,
  Canada: 32,
  "Central African Republic": 33,
  Chad: 34,
  Chile: 35,
  China: 36,
  Colombia: 37,
  Comoros: 38,
  "Congo (Congo-Brazzaville)": 39,
  "Costa Rica": 40,
  Croatia: 41,
  Cuba: 42,
  Cyprus: 43,
  "Czech Republic": 44,
  "Democratic Republic of the Congo": 45,
  Denmark: 46,
  Djibouti: 47,
  Dominica: 48,
  "Dominican Republic": 49,
  Ecuador: 50,
  Egypt: 51,
  "El Salvador": 52,
  "Equatorial Guinea": 53,
  Eritrea: 54,
  Estonia: 55,
  Eswatini: 56,
  Ethiopia: 57,
  Fiji: 58,
  Finland: 59,
  France: 60,
  Gabon: 61,
  Gambia: 62,
  Georgia: 63,
  Germany: 64,
  Ghana: 65,
  Greece: 66,
  Grenada: 67,
  Guatemala: 68,
  Guinea: 69,
  "Guinea-Bissau": 70,
  Guyana: 71,
  Haiti: 72,
  Honduras: 73,
  Hungary: 74,
  Iceland: 75,
  India: 76,
  Indonesia: 77,
  Iran: 78,
  Iraq: 79,
  Ireland: 80,
  Israel: 81,
  Italy: 82,
  Jamaica: 83,
  Japan: 84,
  Jordan: 85,
  Kazakhstan: 86,
  Kenya: 87,
  Kiribati: 88,
  Kuwait: 89,
  Kyrgyzstan: 90,
  Laos: 91,
  Latvia: 92,
  Lebanon: 93,
  Lesotho: 94,
  Liberia: 95,
  Libya: 96,
  Liechtenstein: 97,
  Lithuania: 98,
  Luxembourg: 99,
  Madagascar: 100,
  Malawi: 101,
  Malaysia: 102,
  Maldives: 103,
  Mali: 104,
  Malta: 105,
  "Marshall Islands": 106,
  Mauritania: 107,
  Mauritius: 108,
  Mexico: 109,
  Micronesia: 110,
  Moldova: 111,
  Monaco: 112,
  Mongolia: 113,
  Montenegro: 114,
  Morocco: 115,
  Mozambique: 116,
  Myanmar: 117,
  Namibia: 118,
  Nauru: 119,
  Nepal: 120,
  Netherlands: 121,
  "New Zealand": 122,
  Nicaragua: 123,
  Niger: 124,
  Nigeria: 125,
  "North Korea": 126,
  "North Macedonia": 127,
  Norway: 128,
  Oman: 129,
  Pakistan: 130,
  Palau: 131,
  Palestine: 132,
  Panama: 133,
  "Papua New Guinea": 134,
  Paraguay: 135,
  Peru: 136,
  Philippines: 137,
  Poland: 138,
  Portugal: 139,
  Qatar: 140,
  Romania: 141,
  Russia: 142,
  Rwanda: 143,
  "Saint Kitts and Nevis": 144,
  "Saint Lucia": 145,
  "Saint Vincent and the Grenadines": 146,
  Samoa: 147,
  "San Marino": 148,
  "Sao Tome and Principe": 149,
  "Saudi Arabia": 150,
  Senegal: 151,
  Serbia: 152,
  Seychelles: 153,
  "Sierra Leone": 154,
  Singapore: 155,
  Slovakia: 156,
  Slovenia: 157,
  "Solomon Islands": 158,
  Somalia: 159,
  "South Africa": 160,
  "South Korea": 161,
  "South Sudan": 162,
  Spain: 163,
  "Sri Lanka": 164,
  Sudan: 165,
  Suriname: 166,
  Sweden: 167,
  Switzerland: 168,
  Syria: 169,
  Taiwan: 170,
  Tajikistan: 171,
  Tanzania: 172,
  Thailand: 173,
  "Timor-Leste": 174,
  Togo: 175,
  Tonga: 176,
  "Trinidad and Tobago": 177,
  Tunisia: 178,
  Turkey: 179,
  Turkmenistan: 180,
  Tuvalu: 181,
  Uganda: 182,
  Ukraine: 183,
  "United Arab Emirates": 184,
  "United Kingdom": 185,
  "United States": 186,
  Uruguay: 187,
  Uzbekistan: 188,
  Vanuatu: 189,
  "Vatican City": 190,
  Venezuela: 191,
  Vietnam: 192,
  Yemen: 193,
  Zambia: 194,
  Zimbabwe: 195,
};

type CountryOption = {
  value: number;
  label: string;
};

const countryOptions: CountryOption[] = Object.entries(countryMap).map(
  ([countryName, id]) => ({
    value: id,
    label: countryName,
  })
);

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

 const [nationality, setNationality] = useState<CountryOption | null>(null);

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

 const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  console.log("Submitting form...");
  event.preventDefault();

  const formErrors = validateForm();

  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  setErrors({});

  //  const formData = new FormData();

  //  formData.append("fullName", fullName);
  //  formData.append("email", email);
  //  formData.append("password", password);
  //  formData.append("nationality", nationality?.value || "");
  //  formData.append("gender", gender);
  //  formData.append("phone", phone);
  //  formData.append("userType", userType);

  //  if (userType === "student") {
  //    formData.append("university", university);
  //    formData.append("studyField", studyField);
  //    formData.append("studyYear", studyYear);
  //  }

  //  if (profilePhoto) {
  //    formData.append("profilePhoto", profilePhoto);
  //  }

   const genderMap: Record<string, number> = {
  male: 1,
  female: 2,
  other: 3,
};

const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fullName,
    email,
    password,
    phoneNumber: phone,
    nationalityID: nationality?.value ?? 1,
    genderID: genderMap[gender] ?? 3,
    role: userType === "student" ? "Student" : "Owner",
    profilePhoto: null,
  }),
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
                  instanceId="nationality-select"
                  options={countryOptions}
                  value={nationality}
                  onChange={(option) => setNationality(option as CountryOption | null)}
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