import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentProfileID = searchParams.get('studentProfileID');

  const res = await fetch(`${API}/student-requests/by-student/${studentProfileID}`);
  const data = await res.json();

  if (!res.ok) return NextResponse.json({ error: data.message }, { status: res.status });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${API}/student-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.message }, { status: res.status });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const res = await fetch(`${API}/student-requests/${id}`, { method: 'DELETE' });
  if (!res.ok) return NextResponse.json({ error: 'Failed to delete' }, { status: res.status });
  return NextResponse.json({ message: 'Deleted successfully' });
}