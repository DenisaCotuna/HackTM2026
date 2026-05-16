import { NextResponse } from 'next/server';

const sampleAppointment = {
  id: 1,
  date: '2026-05-22',
  time: '14:00',
  propertyAddress: '123 Main St, City Center',
  studentName: 'John Doe',
  ownerName: 'Anna Popescu',
  status: 'confirmed',
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (id && Number(id) !== sampleAppointment.id) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  return NextResponse.json({ appointment: sampleAppointment });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body as { id?: number; action?: string };

    if (!id || Number(id) !== sampleAppointment.id) {
      return NextResponse.json({ error: 'Invalid appointment id' }, { status: 400 });
    }

    if (action === 'confirm') {
      return NextResponse.json({
        message: 'Appointment confirmed',
        appointment: {
          ...sampleAppointment,
          status: 'confirmed',
        },
      });
    }

    return NextResponse.json({
      message: 'Appointment action completed',
      appointment: sampleAppointment,
    });
  } catch (error) {
    console.error('Appointment API error:', error);
    return NextResponse.json({ error: 'Failed to process appointment request' }, { status: 500 });
  }
}
