import { NextResponse } from "next/server";

export let users: any[] = [];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const fullName = String(formData.get("fullName") || "");

    const nationality = String(formData.get("nationality") || "");
    const gender = String(formData.get("gender") || "");
    const phone = String(formData.get("phone") || "");
    const userType = String(formData.get("userType") || "");

    const university = formData.get("university")?.toString() || null;
    const studyField = formData.get("studyField")?.toString() || null;
    const studyYear = formData.get("studyYear")?.toString() || null;

    const profilePhoto = formData.get("profilePhoto");

    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
      fullName,
      nationality,
      gender,
      phone,
      userType,
      university,
      studyField,
      studyYear,
      profilePhoto: profilePhoto ? true : false,
    };

    users.push(newUser);

    console.log("Registered users:", users);

    return NextResponse.json({
      message: "User created",
      user: newUser,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}