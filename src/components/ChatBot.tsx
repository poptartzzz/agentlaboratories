"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { generateAgentResponse } from '@/utils/claude';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'I am here to assist with setting up your BOTS bot. How can I help?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context = `You are the BOTS AI Assistant, helping users set up their bots. You have access to the following documentation:

        1. Prerequisites: Users need to set up their BotFather API first:
        - Open Telegram and search for "@BotFather"
        - Send "/newbot" command
        - Choose bot name and username (must end in 'bot')
        - Save the API token securely

        2. Platform Configuration:
        - Available platforms include Discord, Telegram, and Custom API
        - Each platform has specific setup requirements
        - API keys and endpoints must be properly configured

        3. Bot Behavior Setup:
        - Features include Twitter sentiment analysis, stock trading automation, contrarian strategy implementation
        - Real-time market monitoring and automated trading systems available
        - Custom feature integration possible

        4. Trigger Configuration:
        - Set up event triggers for bot actions
        - Configure multiple condition triggers
        - Time-based executions available
        - Event-driven actions supported
        - Price movement alerts configurable

        5. Payment Information:
        - Creating a bot requires a payment of $50 worth of SXA tokens
        - Price is dynamically calculated based on current SXA/USD rate
        - Payment must be completed before bot creation

        Based on this documentation, please answer the following question: ${userMessage}

        Please provide a concise, accurate answer based solely on the information provided in the documentation. If the question is about something not covered in the documentation, politely indicate that you are an BOTS AI assistant and cannot help with that specific query.`;
      
      const response = await generateAgentResponse(context);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-black p-3 rounded-full shadow-lg border border-[#00ff00] transition-all group"
      >
        <Image 
          src="/agentlabcreation.png"
          alt="Chat"
          width={32}
          height={32}
          className="rounded-full z-10 relative"
        />
        <div className="absolute inset-0 bg-[#00ff00] rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(0,255,0,0.5)] animate-pulse" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`absolute bottom-20 right-0 w-72 h-[400px] bg-black/95 backdrop-blur-sm border border-[#00ff00] rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.15)] flex flex-col ${inter.className}`}>
          {/* Header */}
          <div className="p-3 border-b border-[#00ff00]/30 bg-[#00ff00]/10 flex items-center gap-3">
            <Image 
              src="/agentlabcreation.png"
              alt="Agent Laboratories Assistant"
              width={24}
              height={24}
              className="rounded-full"
            />
            <div>
              <div className="text-sm font-medium text-[#00ff00]">Agent Laboratories Assistant</div>
              <div className="text-[11px] text-[#00ff00]/80">Setup Guide Helper</div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="px-3 py-1.5 bg-black border-b border-[#00ff00]/30">
            <p className="text-[10px] text-[#00ff00]/70 italic">
              ⚡ AI Assistant in training - Responses are being optimized for accuracy
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-1.5 rounded-lg text-xs leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-[#00ff00]/20 text-[#00ff00] shadow-sm'
                      : 'bg-[#00ff00]/10 text-[#00ff00] shadow-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#00ff00]/20 text-[#00ff00] max-w-[85%] p-1.5 rounded-lg text-xs">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-1.5 border-t border-[#00ff00]/30">
            <div className="flex gap-1.5">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about bot setup..."
                className="flex-1 min-w-0 bg-black border border-[#00ff00]/30 rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#00ff00] text-[#00ff00] placeholder-[#00ff00]/50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-2 py-1 bg-[#00ff00]/10 border border-[#00ff00]/30 hover:bg-[#00ff00]/20 transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs whitespace-nowrap flex-shrink-0"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 