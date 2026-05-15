import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const requestsData = {
      requests: [
        {
          id: 1,
          area: 'City Center',
          budget: '€500-700',
          moveInDate: '2024-10-01',
          status: 'Active',
        },
        {
          id: 2,
          area: 'Student Complex',
          budget: '€400-600',
          moveInDate: '2024-09-15',
          status: 'Matched',
        },
        {
          id: 3,
          area: 'Iulius Town',
          budget: '€600-800',
          moveInDate: '2024-11-01',
          status: 'Closed',
        },
      ],
    };

    return NextResponse.json(requestsData, { status: 200 });
  } catch (error) {
    console.error('Request API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newRequest = {
      id: Math.random(),
      area: body.area,
      budget: `€${body.minBudget}-${body.maxBudget}`,
      moveInDate: body.moveInDate,
      status: 'Active',
      ...body,
    };

    console.log('New request created:', newRequest);

    return NextResponse.json(
      { message: 'Request created successfully', data: newRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error('Request API error:', error);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('id');

    console.log('Request deleted:', requestId);

    return NextResponse.json(
      { message: 'Request deleted successfully', id: requestId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Request API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete request' },
      { status: 500 }
    );
  }
}
