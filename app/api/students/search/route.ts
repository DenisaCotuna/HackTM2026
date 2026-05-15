import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const minBudget = searchParams.get('minBudget');
    const maxBudget = searchParams.get('maxBudget');
    const area = searchParams.get('area');
    const propertyType = searchParams.get('propertyType');
    const furnished = searchParams.get('furnished');

    const allListings = [
      {
        id: 1,
        photo: 'https://via.placeholder.com/320x210?text=Cozy+Room',
        title: 'Bright room near city center',
        area: 'City Center',
        price: 520,
        availableFrom: '2026-06-01',
        furnished: true,
        utilitiesIncluded: true,
        propertyType: 'Room in shared flat',
        createdAt: '2026-05-10',
      },
      {
        id: 2,
        photo: 'https://via.placeholder.com/320x210?text=Studio+Apartment',
        title: 'Modern studio with balcony',
        area: 'Student Complex',
        price: 720,
        availableFrom: '2026-05-20',
        furnished: true,
        utilitiesIncluded: false,
        propertyType: 'Studio',
        createdAt: '2026-05-12',
      },
      {
        id: 3,
        photo: 'https://via.placeholder.com/320x210?text=Full+Apartment',
        title: 'Full apartment next to university',
        area: 'Iulius Town',
        price: 950,
        availableFrom: '2026-06-10',
        furnished: false,
        utilitiesIncluded: true,
        propertyType: 'Full apartment',
        createdAt: '2026-05-05',
      },
      {
        id: 4,
        photo: 'https://via.placeholder.com/320x210?text=Student+Room',
        title: 'Shared flat room, utilities included',
        area: 'Mehala',
        price: 480,
        availableFrom: '2026-05-25',
        furnished: false,
        utilitiesIncluded: true,
        propertyType: 'Room in shared flat',
        createdAt: '2026-05-08',
      },
      {
        id: 5,
        photo: 'https://via.placeholder.com/320x210?text=Chic+Studio',
        title: 'Chic studio with quick tram access',
        area: 'Buziasului',
        price: 650,
        availableFrom: '2026-06-05',
        furnished: true,
        utilitiesIncluded: false,
        propertyType: 'Studio',
        createdAt: '2026-05-11',
      },
      {
        id: 6,
        photo: 'https://via.placeholder.com/320x210?text=Spacious+Apartment',
        title: 'Spacious full apartment, pets allowed',
        area: 'Ghiroda',
        price: 890,
        availableFrom: '2026-05-30',
        furnished: true,
        utilitiesIncluded: true,
        propertyType: 'Full apartment',
        createdAt: '2026-05-07',
      },
    ];

    let filteredListings = allListings;

    if (minBudget) {
      filteredListings = filteredListings.filter(
        (l) => l.price >= Number(minBudget)
      );
    }

    if (maxBudget) {
      filteredListings = filteredListings.filter(
        (l) => l.price <= Number(maxBudget)
      );
    }

    if (area) {
      filteredListings = filteredListings.filter((l) => l.area === area);
    }

    if (propertyType) {
      filteredListings = filteredListings.filter(
        (l) => l.propertyType === propertyType
      );
    }

    if (furnished === 'true') {
      filteredListings = filteredListings.filter((l) => l.furnished === true);
    }

    return NextResponse.json(
      { listings: filteredListings, total: filteredListings.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search listings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Search filter saved:', body);

    return NextResponse.json(
      { message: 'Search completed successfully', filters: body },
      { status: 200 }
    );
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to process search' },
      { status: 500 }
    );
  }
}
