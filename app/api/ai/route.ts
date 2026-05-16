import { NextResponse } from "next/server";

const systemPrompt = `
You are an AI assistant for a student housing platform.
Everything is in the city of TIMISOARA, ROMANIA.

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
When all information is collected, return ONLY valid JSON.

DO NOT use markdown
DO NOT repeat what did the user already enter or say, keep messages short!
DO NOT output ANY JSON to the user, you may only output JSON on the last message of the session
DO NOT skip any fields, DO NOT assume anything, ask the user for everything
DO NOT say anything to the user like "you previously mentioned"
DO NOT repeat your question if user answered accordingly, if not, ask the user a more precise question, and explain to him how he should answer more precisely
DO NOT ask the user for confirmation
BEFORE asking the user CHECK if you already asked him the same question
DO NOT QUESTION ANYTHING TAKE DATA AS IS
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userMessage = body.message || "";
    const rawHistory = body.history && Array.isArray(body.history) ? body.history : [];
    const history = rawHistory;

    const historyText = history
      .map((h: any) => `${h?.role ?? "unknown"}: ${typeof h?.content === "string" ? h.content : JSON.stringify(h?.content ?? "")}`)
      .join("\n");

    const combinedPrompt =
      systemPrompt.trim() +
      "\n\nthis is the chat history:\n" +
      (historyText ? historyText + "\n\n" : "") +
      "this is the user prompt:\n" +
      userMessage;

    const messages = [{ role: "user", content: combinedPrompt }];

    const apiUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      console.error("NVIDIA_API_KEY not set in environment");
      return NextResponse.json({ error: "NVIDIA API key not configured" }, { status: 500 });
    }

    let res: Response;
    try {
      res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages,
          temperature: 0.7,
          top_p: 0.8,
          max_tokens: 1024,
          stream: true,
        }),
      });
    } catch (fetchErr) {
      console.error("Fetch to NVIDIA API failed:", fetchErr);
      return NextResponse.json({ error: "Fetch failed", details: String(fetchErr) }, { status: 502 });
    }

    console.log("NVIDIA API status", res.status);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let details: any = text;
      try {
        details = JSON.parse(text);
      } catch (e) {}
      console.error("NVIDIA API error:", res.status, details);
      return NextResponse.json({ error: "NVIDIA API error", status: res.status, details }, { status: res.status });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) {
          controller.close();
          return;
        }
        try {
          let buffered = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunkText = decoder.decode(value, { stream: true });
            buffered += chunkText;
            const parts = buffered.split("\n");
            buffered = parts.pop() ?? "";
            for (const line of parts) {
              if (!line) continue;
              if (line.startsWith("data: ")) {
                const jsonStr = line.replace(/^data: /, "").trim();
                if (jsonStr && jsonStr !== "[DONE]") {
                  try {
                    const chunk = JSON.parse(jsonStr);
                    const choice = chunk?.choices?.[0];
                    const textChunk = choice?.delta?.content ?? choice?.message?.content ?? choice?.text;
                    if (typeof textChunk === "string" && textChunk.length > 0) {
                      controller.enqueue(new TextEncoder().encode(textChunk));
                    }
                  } catch (e) {}
                }
                continue;
              }
              const trimmed = line.trim();
              if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
                try {
                  const chunk = JSON.parse(trimmed);
                  const choice = chunk?.choices?.[0];
                  const textChunk = choice?.message?.content ?? choice?.delta?.content ?? choice?.text ?? chunk?.text;
                  if (typeof textChunk === "string" && textChunk.length > 0) {
                    controller.enqueue(new TextEncoder().encode(textChunk));
                  }
                } catch (e) {}
              }
            }
          }
          if (buffered) {
            const line = buffered;
            if (line.startsWith("data: ")) {
              const jsonStr = line.replace(/^data: /, "").trim();
              if (jsonStr && jsonStr !== "[DONE]") {
                try {
                  const chunk = JSON.parse(jsonStr);
                  const choice = chunk?.choices?.[0];
                  const textChunk = choice?.delta?.content ?? choice?.message?.content ?? choice?.text;
                  if (typeof textChunk === "string" && textChunk.length > 0) {
                    controller.enqueue(new TextEncoder().encode(textChunk));
                  }
                } catch (e) {}
              }
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    console.error("AI ERROR:", err);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}