"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {apiRequest} from "@/lib/api";

import { Form, Button } from "react-bootstrap";

import "./login.css";
import LoginLogo from "./logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  async function handleLogin(e: { preventDefault: () => void; }) {
    e.preventDefault();
    const user = await apiRequest("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    console.log(user);
  }

  const validateForm = () => {
    const newErrors: any = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("Submitting form...");
  event.preventDefault();

  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }
  console.log("BACKEND DATA:", data);

  localStorage.setItem("user", JSON.stringify(data.user));

  // Redirect based on role
  if (data.user.role === "Student") {
    window.location.href = "/students/dashboard";
  } else if (data.user.role === "Owner") {
    window.location.href = "/owners/dashboard";
  }

  alert("Logged in!");
};

  return (

    <div className="login-wrapper">
      <div className="login-form-container">
        <div className="text-center mb-2">
          <Image
            src={LoginLogo}
            alt="App Logo"
            className="login-logo"
            priority
          />
        </div>

        <h2 className="login-title">Log in</h2>

        <Form
          onSubmit={handleSubmit}
          className="login-form"
        >
          <Form.Group
            className="mb-3"
            controlId="formBasicEmail"
          >
            <Form.Label>Email address</Form.Label>

            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              isInvalid={!!errors.email}
            />

            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            className="mb-3"
            controlId="formBasicPassword"
          >
            <Form.Label>Password</Form.Label>

            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              isInvalid={!!errors.password}
            />

            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="login-button"
          >
            Log in
          </Button>

          <div className="text-center">
            <p>
              Don't have an account?{" "}
              <Link href="/register">
                Register
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}