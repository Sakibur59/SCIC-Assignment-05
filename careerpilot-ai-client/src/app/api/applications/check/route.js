import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    console.log('🔍 Checking application for job:', jobId);
    console.log('👤 User:', session.user.id);

    if (!jobId) {
      return NextResponse.json(
        { message: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Call backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/applications/check?jobId=${jobId}`,
      {
        headers: {
          'Authorization': `Bearer ${session.user.token}`,
        },
      }
    );

    const data = await response.json();
    console.log('📡 Backend response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to check application' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Check application error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}