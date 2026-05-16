import { NextResponse } from "next/server";

// Dummy users for testing - works without database
const dummyUsers = [
  {
    id: "1",
    email: "student@example.com",
    password: "password123",
    role: "Student",
    name: "John Student"
  },
  {
    id: "2",
    email: "owner@example.com",
    password: "password123",
    role: "Owner",
    name: "Jane Owner"
  }
];

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Check against dummy users first
  const dummyUser = dummyUsers.find(u => u.email === email && u.password === password);
  if (dummyUser) {
    return NextResponse.json({
      message: "Login successful",
      user: {
        data: {
          id: dummyUser.id,
          email: dummyUser.email,
          role: dummyUser.role,
          name: dummyUser.name
        }
      }
    });
  }

  // Fallback to external API if configured (optional)
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return NextResponse.json(
          { error: data.message || "Login failed" },
          { status: res.status }
        );
      }

      return NextResponse.json({ message: "Login successful", user: data });
    } catch (err) {
      console.error("External API error:", err);
    }
  }

  return NextResponse.json(
    { error: "Invalid email or password" },
    { status: 401 }
  );
}