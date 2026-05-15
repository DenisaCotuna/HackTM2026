import { NextResponse } from "next/server";
import { users } from "../register/route"; // adjust path if needed

export async function POST(req: Request) {
  console.log(users);
  const { email, password } = await req.json();

  const user = users.find((u) => u.email === email);

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  if (user.password !== password) {
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
  });
}