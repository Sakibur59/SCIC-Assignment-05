import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume/${id}/report`, {
      headers: {
        'Authorization': `Bearer ${session.user.token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: data.message || 'Failed to generate report' },
        { status: response.status }
      );
    }

    // Get the blob
    const blob = await response.blob();
    
    // Return the blob with proper headers
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Resume_Analysis_Report.pdf"`,
      },
    });

  } catch (error) {
    console.error('❌ Report error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}