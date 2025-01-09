import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service is not properly configured' },
        { status: 500 }
      );
    }

    const { prompt } = await request.json();

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    // Extract text content from the response
    const content = message.content[0];
    if ('text' in content) {
      return NextResponse.json({ response: content.text });
    } else {
      console.error('Unexpected content type in Claude response');
      return NextResponse.json(
        { error: 'Invalid response format from AI service' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Claude API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 