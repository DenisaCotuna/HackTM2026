import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

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
}