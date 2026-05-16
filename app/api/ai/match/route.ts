import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Array of apartment options to randomly select from
    const apartments = [
      {
        id: "apt-001",
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
      },
      {
        id: "apt-002",
        title: "Modern Studio in Downtown",
        area: "Downtown",
        priceEuros: 650,
        bedrooms: 1,
        furnished: true,
        utilitiesIncluded: true,
        petsAllowed: false,
        smokerFriendly: false,
        description: "Contemporary studio with high ceilings, exposed brick, and natural lighting. Walking distance to cafes and restaurants.",
        image: "https://images.unsplash.com/photo-1664817550969-5e76adc4a3fe?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: "apt-003",
        title: "Spacious 3-bedroom Family Home",
        area: "Timisoara North",
        priceEuros: 750,
        bedrooms: 3,
        furnished: false,
        utilitiesIncluded: false,
        petsAllowed: true,
        smokerFriendly: true,
        description: "Large family apartment with separate living areas, updated kitchen, and balcony. Great neighborhood with schools nearby.",
        image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1180&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: "apt-004",
        title: "Luxury 1-bedroom Downtown Loft",
        area: "Central",
        priceEuros: 900,
        bedrooms: 1,
        furnished: true,
        utilitiesIncluded: true,
        petsAllowed: true,
        smokerFriendly: false,
        description: "Premium loft apartment with smart home features, premium appliances, and stunning city views from the terrace.",
        image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: "apt-005",
        title: "Budget-friendly 1-bedroom Apartment",
        area: "Suburb",
        priceEuros: 380,
        bedrooms: 1,
        furnished: false,
        utilitiesIncluded: false,
        petsAllowed: false,
        smokerFriendly: true,
        description: "Simple but comfortable 1-bedroom apartment perfect for students. Quiet neighborhood with easy access to public transport.",
        image: "https://images.unsplash.com/photo-1595599512948-b9831e5fc11c?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: "apt-006",
        title: "Shared House with 4 Bedrooms",
        area: "East Timisoara",
        priceEuros: 450,
        bedrooms: 1,
        furnished: true,
        utilitiesIncluded: true,
        petsAllowed: true,
        smokerFriendly: false,
        description: "Shared student house with common areas, kitchen, and living room. Great for meeting roommates and making friends.",
        image: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&q=80"
      },
      {
        id: "apt-007",
        title: "Renovated 2-bedroom Victorian Apartment",
        area: "Historic Center",
        priceEuros: 680,
        bedrooms: 2,
        furnished: true,
        utilitiesIncluded: false,
        petsAllowed: false,
        smokerFriendly: false,
        description: "Beautiful historic apartment with original features, high ceilings, and parquet floors. Located in the charming historic district.",
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: "apt-008",
        title: "Sunny Studio with Balcony",
        area: "West Quarter",
        priceEuros: 420,
        bedrooms: 1,
        furnished: false,
        utilitiesIncluded: false,
        petsAllowed: true,
        smokerFriendly: true,
        description: "Cozy studio with a private south-facing balcony perfect for relaxation. Close to shops, restaurants, and the tram station.",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
    ];

    // Return a random apartment
    const randomApartment = apartments[Math.floor(Math.random() * apartments.length)];

    return NextResponse.json(randomApartment);
  } catch (err) {
    console.error("Match route error:", err);
    return NextResponse.json({ error: "Match failed" }, { status: 500 });
  }
}
