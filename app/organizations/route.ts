// ✅ API Route: POST /api/organization/animals/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "organization") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const form = await req.formData();
  const name = form.get("name") as string;
  const species = form.get("species") as string;
  const breed = form.get("breed") as string;
  const vaccinated = form.get("vaccinated") === "on";
  const neutered = form.get("neutered") === "on";

  try {
    const animal = await prisma.animal.create({
      data: {
        name,
        species,
        breed,
        vaccinated,
        neutered,
        createdById: session.user.id,
      },
    });

    return NextResponse.redirect(new URL("/organization/animals", req.url));
  } catch (err) {
    return NextResponse.json({ error: "Error creating animal" }, { status: 500 });
  }
}
