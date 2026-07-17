import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ saved: false });
    }

    if (!session.user.token) {
      return NextResponse.json({ saved: false });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ saved: false });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/saved-jobs/check?jobId=${jobId}`,
      {
        headers: {
          'Authorization': `Bearer ${session.user.token}`,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Check saved job error:', error);
    return NextResponse.json({ saved: false });
  }
}