'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRobot } from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for a Bitcoin scholarship platform. Answer questions about Bitcoin, cryptocurrency, blockchain, and scholarships. Be concise and informative.'
            },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: input }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.error?.message || 'Sorry, the AI could not answer your question.';
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: errorMsg
        }]);
        console.error('Groq API error:', data);
        return;
      }
      if (!data.choices || !data.choices[0]?.message?.content) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I could not understand the response from the AI.'
        }]);
        console.error('Malformed Groq API response:', data);
        return;
      }
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Network or unexpected error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered a network error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-bento-container chatbot-white-glow">
      <div className="chatbot-bento-header flex items-center gap-3 mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 shadow-lg">
          <FaRobot className="text-white text-xl" />
        </span>
        <h3 className="chatbot-bento-title text-gray-900 font-bold text-xl tracking-tight">ASK GROQ</h3>
      </div>
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`chatbot-message ${message.role}`}
          >
            <div className={`chatbot-message-content ${message.role === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>{message.content}</div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="chatbot-message assistant">
            <div className="chatbot-message-content assistant-bubble">
              <div className="chatbot-loading">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chatbot-input-form mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about Bitcoin or scholarships..."
          className="chatbot-input"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="chatbot-submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Thinking...' : 'Ask AI'}
        </button>
      </form>
    </div>
  );
} 