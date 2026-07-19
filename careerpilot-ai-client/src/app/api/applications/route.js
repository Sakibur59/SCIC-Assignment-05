import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Application failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('❌ Apply error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}