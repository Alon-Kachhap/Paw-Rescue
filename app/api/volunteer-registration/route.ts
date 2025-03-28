import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      street,
      city,
      state,
      zip,
      aboutYourself,
      referral,
    } = data;

    // ✅ 1. Basic validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ 2. Check if email already exists
    const existing = await prisma.volunteerRegistration.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // ✅ 3. Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 4. Store in database
    const newVolunteer = await prisma.volunteerRegistration.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        street,
        city,
        state,
        zip,
        aboutYourself,
        referral,
        verified: false,
      },
    });

    // ✅ 5. Respond with success
    return NextResponse.json(
      { message: "Volunteer registered successfully", volunteer: newVolunteer },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error in registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
