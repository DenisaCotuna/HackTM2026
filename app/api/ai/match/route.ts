import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // In a real implementation we'd use the parsed JSON in req.json() to find matches.
    // For now return a sample apartment object with a photo URL.
    const sample = {
      id: "sample-apt-001",
      title: "Cozy 2-bedroom near West University",
      area: "Central-Timisoara",
      priceEuros: 520,
      bedrooms: 2,
      furnished: true,
      utilitiesIncluded: false,
      petsAllowed: true,
      smokerFriendly: false,
      description: "Bright 2-bedroom apartment 10min from the university. Close to tram, shops, and parks.",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"
    };

    return NextResponse.json(sample);
  } catch (err) {
    console.error("Match route error:", err);
    return NextResponse.json({ error: "Match failed" }, { status: 500 });
  }
}
