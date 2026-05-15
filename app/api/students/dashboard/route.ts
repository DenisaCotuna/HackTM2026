import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const dashboardData = {
      userName: 'John Doe',
      unreadNotifications: 3,
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
      perfectMatches: [
        {
          id: 1,
          photo: 'https://via.placeholder.com/150',
          location: 'City Center',
          price: '€600/month',
          owner: 'John Smith',
          score: 95,
        },
        {
          id: 2,
          photo: 'https://via.placeholder.com/150',
          location: 'Student Complex',
          price: '€500/month',
          owner: 'Jane Doe',
          score: 92,
        },
      ],
      suggestions: [
        {
          id: 1,
          photo: 'https://via.placeholder.com/150',
          location: 'Iulius Town',
          price: '€700/month',
          owner: 'Bob Johnson',
          score: 78,
        },
        {
          id: 2,
          photo: 'https://via.placeholder.com/150',
          location: 'Mehala',
          price: '€450/month',
          owner: 'Alice Brown',
          score: 85,
        },
      ],
      appointments: [
        {
          id: 1,
          date: '2024-10-15',
          address: '123 Main St, City Center',
          owner: 'John Smith',
          status: 'Pending',
        },
        {
          id: 2,
          date: '2024-10-20',
          address: '456 Elm St, Student Complex',
          owner: 'Jane Doe',
          status: 'Confirmed',
        },
        {
          id: 3,
          date: '2024-10-25',
          address: '789 Oak St, Iulius Town',
          owner: 'Bob Johnson',
          status: 'Pending',
        },
      ],
    };

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Dashboard action:', body);

    return NextResponse.json(
      { message: 'Dashboard action completed successfully', data: body },
      { status: 200 }
    );
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to process dashboard action' },
      { status: 500 }
    );
  }
}