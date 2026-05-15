import { NextResponse } from 'next/server';

const matchDetail = {
  id: 1,
  studentProfile: {
    name: 'John Doe',
    university: 'West University of Timisoara',
    budget: '€450-700',
    area: 'City Center',
    moveInDate: '2026-06-01',
  },
  propertyListing: {
    photo: 'https://via.placeholder.com/420x260?text=Property+Photo',
    address: '123 Main St, City Center',
    price: '€650/month',
    type: 'Room in shared flat',
    availability: '2026-06-01',
  },
  comparisonRows: [
    { field: 'Budget', student: '€450-700', listing: '€650/month', match: true },
    { field: 'Preferred area', student: 'City Center', listing: 'City Center', match: true },
    { field: 'Move-in date', student: '2026-06-01', listing: '2026-06-01', match: true },
    { field: 'Room type', student: 'Room in shared flat', listing: 'Room in shared flat', match: true },
    { field: 'Availability', student: '2026-06-01', listing: '2026-06-01', match: true },
  ],
  status: 'waiting',
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (id && Number(id) !== matchDetail.id) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }

  return NextResponse.json({ match: matchDetail });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body as { id?: number; action?: string };

    if (!id || Number(id) !== matchDetail.id) {
      return NextResponse.json({ error: 'Invalid match id' }, { status: 400 });
    }

    if (action === 'confirmStudent') {
      return NextResponse.json({
        message: 'Student confirmed',
        match: {
          ...matchDetail,
          status: 'studentConfirmed',
        },
      });
    }

    if (action === 'confirmOwner') {
      return NextResponse.json({
        message: 'Owner confirmed',
        match: {
          ...matchDetail,
          status: 'ownerConfirmed',
        },
      });
    }

    return NextResponse.json({
      message: 'No action performed',
      match: matchDetail,
    });
  } catch (error) {
    console.error('Match API error:', error);
    return NextResponse.json({ error: 'Failed to process match request' }, { status: 500 });
  }
}
