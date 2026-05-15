import { NextResponse } from 'next/server';

const sampleRequests = [
  {
    id: 1,
    listingTitle: 'Studio near university',
    propertyType: 'Studio',
    address: '123 Main St, City Center',
    preferredArea: 'City Center',
    price: '€600',
    maxTenants: 1,
    availableFrom: '2025-06-01',
    preferredGender: 'Any',
    utilitiesIncluded: true,
    furnished: true,
    insuranceRequired: false,
    internationalStudents: true,
    smokersAllowed: false,
    petsAllowed: false,
    description: 'Cozy studio close to campus with good transportation links.',
  },
];

export async function GET(request: Request) {
  return NextResponse.json({ requests: sampleRequests });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('Received owner request:', body);

    return NextResponse.json(
      { message: 'Listing created successfully', data: body },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Failed to process request' },
      { status: 500 }
    );
  }
}
