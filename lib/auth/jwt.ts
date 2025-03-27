import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { type User } from '@prisma/client'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function createToken(user: User) {
  return await new SignJWT({ 
    id: user.id,
    email: user.email,
    role: user.role 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch (err) {
    return null
  }
}

export async function getSession() {
  const token = cookies().get('token')?.value
  if (!token) return null
  return verifyToken(token)
}