// import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import prisma from '@/lib/prisma';
import { Context, UserRole } from '@/types/auth';

interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export async function createContext({ req }: { req: Request }): Promise<Context> {
  try {
    const authHeader = req.headers.get('authorization') || '';

    const token = authHeader.split(' ')[1]; // Get the token part from "Bearer <token>"

    if (!token) {
      return { user: null };
    }

    const decoded = jwtDecode<JwtPayload>(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return { user: null };
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  } catch (error) {
    console.error('Error in createContext:', error);
    return { user: null };
  }
} 