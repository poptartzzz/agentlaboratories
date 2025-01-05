import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
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
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 