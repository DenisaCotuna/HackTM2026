import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    const visitsData = {
      propertyId,
      address: '123 Main St, City Center',
      ownerName: 'Anna Popescu',
      visits: [
        {
          id: 1,
          date: '2024-10-15',
          studentName: 'Maria Ionescu',
          status: 'Confirmed',
        },
        {
          id: 2,
          date: '2024-10-20',
          studentName: 'Alex Popescu',
          status: 'Pending',
        },
      ],
    };

    return NextResponse.json(visitsData, { status: 200 });
  } catch (error) {
    console.error('Visit API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newVisit = {
      id: Math.random(),
      date: body.dates,
      studentName: body.studentName || 'Guest Student',
      note: body.note,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    console.log('New visit request created:', newVisit);

    return NextResponse.json(
      { message: 'Visit request sent successfully', data: newVisit },
      { status: 201 }
    );
  } catch (error) {
    console.error('Visit API error:', error);
    return NextResponse.json(
      { error: 'Failed to create visit request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Visit updated:', body);

    return NextResponse.json(
      { message: 'Visit updated successfully', data: body },
      { status: 200 }
    );
  } catch (error) {
    console.error('Visit API error:', error);
    return NextResponse.json(
      { error: 'Failed to update visit' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitId = searchParams.get('id');

    console.log('Visit deleted:', visitId);

    return NextResponse.json(
      { message: 'Visit cancelled successfully', id: visitId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Visit API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete visit' },
      { status: 500 }
    );
  }
}
