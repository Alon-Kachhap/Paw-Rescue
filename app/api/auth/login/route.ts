import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createToken } from '@/lib/auth/jwt'
import bcrypt from 'bcrypt'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['VOLUNTEER', 'ORGANIZATION'])
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, role } = loginSchema.parse(body)

    const user = await prisma.user.findFirst({
      where: { 
        email,
        role 
      }
    })

    if (!user || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = await createToken(user)
    const response = NextResponse.json({ success: true })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}