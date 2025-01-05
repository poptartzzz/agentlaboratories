export const generateAgentResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data: { response: string } = await response.json();
    return data.response;
  } catch (error: unknown) {
    console.error('Error generating response:', error);
    throw error;
  }
};

interface PromptContext {
  price?: number;
  change?: number;
  volume?: number;
  marketCap?: number;
  devActivity?: string;
  message?: string;
}

export function generatePrompt(type: string, context: PromptContext) {
  switch (type) {
    case 'trading':
      return `You are an AI crypto trading agent. Given this market data: 
      Price: $${context.price}
      24h Change: ${context.change}%
      Volume: $${context.volume}
      
      Analyze this data and provide concise trading insights in a casual, chat-like tone. Include specific entry/exit points and risk management advice. Keep the response under 3 sentences.`;

    case 'researcher':
      return `You are an AI crypto research agent. Analyze this Ethereum data:
      Price: $${context.price}
      Market Cap: $${context.marketCap}
      Developer Activity: ${context.devActivity}
      
      Provide a brief but detailed market analysis in a chat-like tone. Focus on key metrics and their implications. Keep the response under 3 sentences.`;

    case 'moderator':
      return `You are an AI community moderator. A user has posted this message:
      "${context.message}"
      
      Respond to this message in a friendly but firm moderator tone. If there are rule violations, explain them clearly but kindly. Keep the response under 3 sentences.`;

    default:
      return '';
  }
} 