import { NextResponse } from 'next/server';

const sampleVisitRequests = [
  {
    id: 1,
    studentName: 'John Doe',
    university: 'West University of Timisoara',
    budget: '€450-700',
    area: 'City Center',
    proposedDates: ['2026-05-20', '2026-05-22', '2026-05-25'],
    note:
      'Hi! I am very interested in this property. I have flexibility with these dates and would like to schedule a viewing.',
    status: 'pending',
  },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (id) {
    const visit = sampleVisitRequests.find((item) => String(item.id) === id);
    if (!visit) {
      return NextResponse.json({ error: 'Visit request not found' }, { status: 404 });
    }

    return NextResponse.json({ visit });
  }

  return NextResponse.json({ visits: sampleVisitRequests });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, selectedDate } = body;

    if (!id || !selectedDate) {
      return NextResponse.json(
        { error: 'Missing id or selectedDate in request body' },
        { status: 400 }
      );
    }

    const visit = sampleVisitRequests.find((item) => item.id === Number(id));
    if (!visit) {
      return NextResponse.json({ error: 'Visit request not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Visit confirmed',
      visit: {
        ...visit,
        confirmedDate: selectedDate,
        status: 'confirmed',
      },
    });
  } catch (error) {
    console.error('Visit API error:', error);
    return NextResponse.json({ error: 'Failed to process visit request' }, { status: 500 });
  }
}
