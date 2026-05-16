import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });

    // Expect a multipart/form-data request with a `file` field
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No audio file provided" }, { status: 400 });

    // Forward the file to OpenAI Whisper API
    const forward = new FormData();
    forward.append("file", file as any, (file as any).name || "recording.webm");
    forward.append("model", "whisper-1");

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
      },
      body: forward as any,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json({ error: "Whisper API error", details: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ text: data.text });
  } catch (err) {
    console.error("Transcription error:", err);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
