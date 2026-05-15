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
When all information is collected, return ONLY valid JSON.
Don't write in markdown
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Build user message from structured fields if present, else fallback to message
    let userMessage = "";
    if (body.title || body.preferredAreas || body.minBudget || body.maxBudget || body.movingIn || body.movingOut || body.furnished !== undefined || body.utilitiesIncluded !== undefined || body.roommatesPreferred !== undefined || body.petsAllowed !== undefined || body.smokerFriendly !== undefined || body.additionalNotes) {
      userMessage =
        `title: ${body.title ?? ""}\n` +
        `preferred areas: ${Array.isArray(body.preferredAreas) ? body.preferredAreas.join(", ") : (body.preferredAreas ?? "")}\n` +
        `minimum budget: ${body.minBudget ?? ""}\n` +
        `maximum budget: ${body.maxBudget ?? ""}\n` +
        `moving in: ${body.movingIn ?? ""}\n` +
        `moving out: ${body.movingOut ?? ""}\n` +
        `furnished: ${body.furnished ? "yes" : "no"}\n` +
        `utilities included: ${body.utilitiesIncluded ? "yes" : "no"}\n` +
        `roommates preferred: ${body.roommatesPreferred ? "yes" : "no"}\n` +
        `pets allowed: ${body.petsAllowed ? "yes" : "no"}\n` +
        `smoker friendly: ${body.smokerFriendly ? "yes" : "no"}\n` +
        `additional notes: ${body.additionalNotes ?? ""}`;
    } else {
      userMessage = body.message || "";
    }

    const apiUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      console.error("NVIDIA_API_KEY not set in environment");
      return NextResponse.json({ error: "NVIDIA API key not configured" }, { status: 500 });
    }
    // Include system prompt only for the first message (when no history provided)
    const history = body.history && Array.isArray(body.history) ? body.history : [];
    // Some providers don't accept a `system` role; include the system prompt
    // as prepended text to the first user message instead.
    const messages = (history.length > 0)
      ? [...history, { role: "user", content: userMessage }]
      : [{ role: "user", content: systemPrompt + "\n\n" + userMessage }];

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-2-2b-it",
        messages,
        temperature: 0.7,
        top_p: 0.8,
        max_tokens: 4096,
        stream: true,
      }),
    });

    console.log("NVIDIA API status", res.status, "headers:", Array.from(res.headers.entries()));
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let details: any = text;
      try { details = JSON.parse(text); } catch (e) { /* keep text */ }
      console.error("NVIDIA API error:", res.status, details);
      return NextResponse.json({ error: "NVIDIA API error", status: res.status, details }, { status: res.status });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) { controller.close(); return; }
        try {
          let buffered = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunkText = decoder.decode(value, { stream: true });
            buffered += chunkText;
            const parts = buffered.split("\n");
            // keep the last partial line in buffer
            buffered = parts.pop() ?? "";
            for (const line of parts) {
              if (!line) continue;
              // log raw line for debugging
              console.debug("SSE line:", line.slice(0, 1000));
              // Handle SSE-style lines starting with "data: "
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
                  } catch (e) {
                    console.debug("Malformed JSON in SSE line", e);
                  }
                }
                continue;
              }

              // If the provider returned a plain JSON chunk (non-SSE), try parse whole line
              const trimmed = line.trim();
              if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
                try {
                  const chunk = JSON.parse(trimmed);
                  const choice = chunk?.choices?.[0];
                  const textChunk = choice?.message?.content ?? choice?.delta?.content ?? choice?.text ?? chunk?.text;
                  if (typeof textChunk === "string" && textChunk.length > 0) {
                    controller.enqueue(new TextEncoder().encode(textChunk));
                  }
                } catch (e) {
                  // not JSON or malformed; ignore
                }
              }
            }
          }
          // process any remaining buffered data
          if (buffered) {
            const line = buffered;
            if (line.startsWith("data: ")) {
              const jsonStr = line.replace(/^data: /, "").trim();
              if (jsonStr && jsonStr !== "[DONE]") {
                try {
                  const chunk = JSON.parse(jsonStr);
                  const choice = chunk?.choices?.[0];
                  let textChunk: string | undefined;
                  if (choice) textChunk = choice.delta?.content ?? choice.message?.content ?? choice.text;
                  if (typeof textChunk === "string" && textChunk.length > 0) {
                    controller.enqueue(new TextEncoder().encode(textChunk));
                  }
                } catch (e) {
                  console.debug("Malformed JSON in final buffered SSE line", e);
                }
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