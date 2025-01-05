import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const { prompt } = await req.json();

    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Check if the content exists and is of type text
    const textContent = message.content.find(
      (block): block is { type: 'text'; text: string } => 
      block.type === 'text'
    );

    if (!textContent) {
      throw new Error('No text content in response');
    }

    return NextResponse.json({
      response: textContent.text
    });

  } catch (error) {
    console.error('Claude API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from Claude' },
      { status: 500 }
    );
  }
} 