import { NextResponse } from "next/server";

const dashboardData = {
  user: {
    id: 1,
    fullName: "Jane Smith",
    role: "Owner",
    unreadNotifications: 2,
  },
  listings: [
    {
      id: 1,
      photo: "https://via.placeholder.com/450x300",
      address: "123 Main St, City Center",
      price: "€600/month",
      status: "Active",
    },
    {
      id: 2,
      photo: "https://via.placeholder.com/450x300",
      address: "456 Elm St, Student Complex",
      price: "€500/month",
      status: "Rented",
    },
    {
      id: 3,
      photo: "https://via.placeholder.com/450x300",
      address: "789 Oak St, Iulius Town",
      price: "€700/month",
      status: "Paused",
    },
  ],
  perfectMatches: [
    {
      id: 1,
      name: "John Doe",
      university: "West University of Timisoara",
      budget: "€500-700",
      area: "City Center",
      score: 95,
    },
    {
      id: 2,
      name: "Alice Brown",
      university: "Politehnica University of Timisoara",
      budget: "€400-600",
      area: "Student Complex",
      score: 92,
    },
  ],
  suggestions: [
    {
      id: 1,
      name: "Bob Johnson",
      university: "Victor Babes University",
      budget: "€600-800",
      area: "Iulius Town",
      score: 78,
    },
    {
      id: 2,
      name: "Charlie Wilson",
      university: "University of Life Sciences",
      budget: "€450-650",
      area: "Mehala",
      score: 85,
    },
  ],
  appointments: [
    {
      id: 1,
      date: "2024-10-15",
      student: "John Doe",
      property: "123 Main St, City Center",
      status: "Pending",
    },
    {
      id: 2,
      date: "2024-10-20",
      student: "Alice Brown",
      property: "456 Elm St, Student Complex",
      status: "Confirmed",
    },
    {
      id: 3,
      date: "2024-10-25",
      student: "Bob Johnson",
      property: "789 Oak St, Iulius Town",
      status: "Pending",
    },
  ],
};

export async function GET(req: Request) {
  return NextResponse.json(dashboardData);
}
