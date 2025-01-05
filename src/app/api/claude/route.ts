import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('Missing ANTHROPIC_API_KEY in environment:', process.env);
    return NextResponse.json(
      { error: 'API configuration error - Key missing' },
      { status: 500 }
    );
  }

  try {
    const { context } = await req.json();
    
    if (!context) {
      return NextResponse.json(
        { error: 'Context is required' },
        { status: 400 }
      );
    }

    console.log('Attempting Anthropic API call with key:', apiKey.substring(0, 10) + '...');

    const anthropic = new Anthropic({
      apiKey: apiKey
    });

    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: context,
          },
        ],
        temperature: 0.7,
      });

      const textContent = message.content.find(
        (block): block is { type: 'text'; text: string } => 
        block.type === 'text'
      );

      if (!textContent) {
        throw new Error('No text content in response');
      }

      return NextResponse.json({ response: textContent.text });
      
    } catch (anthropicError) {
      console.error('Anthropic API Error:', anthropicError);
      return NextResponse.json(
        { error: 'Error communicating with AI service' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('General API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 