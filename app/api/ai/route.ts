import { NextResponse } from "next/server";
const systemPrompt = `
You are an AI assistant for a student housing platform.

Collect these fields for a request to find an apartment for a student:
- title (String)
- preferred areas (Array of Strings)
- minimum budget in euros per month (Number)
- maximum budget in euros per month (Number)
- moving in (Date)
- moving out (Date) optional
- furnished or unfurnished (boolean)
- utilities included (boolean)
- roommates preferred (boolean)
- pets allowed (boolean)
- smoker friendly (boolean)
- additional notes (String) optional

Ask questions one by one if needed. If more than one information is provided, complete the fields from what user provides. If all information is provided, confirm the details with the user before finalizing.
When all information is collected,
return ONLY valid JSON.
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen2.5:7b",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        stream: false,
      }),
    });

    const data = await res.json();

    console.log("OLLAMA RESPONSE:", data);

    return NextResponse.json({
      reply: data.message?.content ?? "No response",
    });
  } catch (err) {
    console.error("AI ERROR:", err);

    return NextResponse.json(
      { error: "Ollama request failed" },
      { status: 500 }
    );
  }
}