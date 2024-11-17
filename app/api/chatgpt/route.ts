import OpenAI from 'openai';
import { NextResponse } from 'next/server';
/* eslint-disable @typescript-eslint/no-explicit-any */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ "role": "user", "content": prompt }],
      max_tokens: 500,
      temperature: 0.7
    });

    if (!completion.choices[0].message.content) {
      return NextResponse.json({ success: false, error: 'No response from OpenAI' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      question: completion.choices[0].message.content
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error processing request'
    }, { status: 500 });
  }
}