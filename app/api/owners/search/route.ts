import { NextResponse } from 'next/server';

const sampleStudentRequests = [
  {
    id: 1,
    name: 'John Doe',
    university: 'West University of Timisoara',
    minBudget: 400,
    maxBudget: 600,
    area: 'City Center',
    nationality: 'Romanian',
    moveInDate: '2026-06-01',
    duration: '12+ months',
    roomPreference: 'Room in shared flat',
    hasRoommates: true,
  },
  {
    id: 2,
    name: 'Alice Brown',
    university: 'Politehnica University of Timisoara',
    minBudget: 350,
    maxBudget: 550,
    area: 'Student Complex',
    nationality: 'Hungarian',
    moveInDate: '2026-05-20',
    duration: '12+ months',
    roomPreference: 'Room in shared flat',
    hasRoommates: true,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    university: 'Victor Babes University',
    minBudget: 500,
    maxBudget: 800,
    area: 'Iulius Town',
    nationality: 'German',
    moveInDate: '2026-06-10',
    duration: '12+ months',
    roomPreference: 'Studio',
    hasRoommates: false,
  },
  {
    id: 4,
    name: 'Charlie Wilson',
    university: 'University of Life Sciences',
    minBudget: 300,
    maxBudget: 500,
    area: 'Mehala',
    nationality: 'Italian',
    moveInDate: '2026-05-25',
    duration: '6-12 months',
    roomPreference: 'Room in shared flat',
    hasRoommates: true,
  },
  {
    id: 5,
    name: 'Diana Prince',
    university: 'West University of Timisoara',
    minBudget: 600,
    maxBudget: 900,
    area: 'Buziasului',
    nationality: 'French',
    moveInDate: '2026-06-05',
    duration: '12+ months',
    roomPreference: 'Full apartment',
    hasRoommates: false,
  },
  {
    id: 6,
    name: 'Eva Martinez',
    university: 'Politehnica University of Timisoara',
    minBudget: 450,
    maxBudget: 650,
    area: 'City Center',
    nationality: 'Spanish',
    moveInDate: '2026-05-30',
    duration: '12+ months',
    roomPreference: 'Studio',
    hasRoommates: false,
  },
];

function filterStudentRequests(query: URLSearchParams) {
  const minBudget = query.get('minBudget');
  const maxBudget = query.get('maxBudget');
  const area = query.get('area');
  const nationality = query.get('nationality');
  const moveInDate = query.get('moveInDate');
  const duration = query.get('duration');
  const roomPreference = query.get('roomPreference');
  const hasRoommates = query.get('hasRoommates');

  return sampleStudentRequests.filter((student) => {
    const budgetMin = minBudget ? Number(minBudget) : 0;
    const budgetMax = maxBudget ? Number(maxBudget) : Infinity;
    const matchesBudget =
      (student.minBudget <= budgetMax || budgetMax === Infinity) &&
      (student.maxBudget >= budgetMin || budgetMin === 0);

    const matchesArea = area ? student.area === area : true;
    const matchesNationality = nationality ? student.nationality === nationality : true;
    const matchesDate = moveInDate ? new Date(student.moveInDate) >= new Date(moveInDate) : true;
    const matchesDuration = duration ? student.duration === duration : true;
    const matchesRoom = roomPreference ? student.roomPreference === roomPreference : true;
    const matchesRoommates =
      hasRoommates === 'true' ? student.hasRoommates === true : true;

    return (
      matchesBudget &&
      matchesArea &&
      matchesNationality &&
      matchesDate &&
      matchesDuration &&
      matchesRoom &&
      matchesRoommates
    );
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const results = filterStudentRequests(url.searchParams);
  return NextResponse.json({ students: results });
}
