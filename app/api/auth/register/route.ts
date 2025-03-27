import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['VOLUNTEER', 'ORGANIZATION']),
  // Add other fields based on role
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, role, ...data } = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      }
    })

    // Create role-specific profile
    if (role === 'VOLUNTEER') {
      await prisma.volunteer.create({
        data: {
          userId: user.id,
          ...data
        }
      })
    } else {
      await prisma.organization.create({
        data: {
          userId: user.id,
          ...data
        }
      })
    }

    return NextResponse.json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}