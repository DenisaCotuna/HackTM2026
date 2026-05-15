import { NextResponse } from 'next/server';

const initialMessages = [
  { id: 1, sender: 'Owner', text: 'Hi! I saw your request and this room looks like a great fit.', time: '09:12 AM' },
  { id: 2, sender: 'Student', text: 'Thanks! Can you tell me more about the utilities and house rules?', time: '09:15 AM' },
];

let currentMessages = [...initialMessages];

export async function GET(request: Request) {
  return NextResponse.json({ messages: currentMessages });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sender, text } = body as { sender?: string; text?: string };

    if (!sender || !text || !text.trim()) {
      return NextResponse.json({ error: 'sender and text are required' }, { status: 400 });
    }

    const nextMessage = {
      id: currentMessages.length + 1,
      sender,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    currentMessages = [...currentMessages, nextMessage];

    return NextResponse.json({ message: nextMessage }, { status: 201 });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
  }
}
