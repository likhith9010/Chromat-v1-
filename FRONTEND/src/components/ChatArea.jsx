import React, { useRef, useEffect } from 'react';
import { Bot, User, Loader2 } from 'lucide-react';

const ChatArea = ({ messages, onSendMessage, isThinking }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="bg-orange-100 p-4 rounded-full mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">How can I help you today?</h2>
            <p className="text-gray-500 max-w-md">
              I can browse the web, use apps, and help you complete tasks automatically.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 w-full max-w-2xl">
              {['Open YouTube and play a song', 'Find the best price for iPhone 15', 'Check my emails', 'Research AI trends'].map((suggestion, i) => (
                <button 
                  key={i}
                  onClick={() => onSendMessage(suggestion)}
                  className="p-3 text-sm text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-gray-100 text-gray-900' : 'bg-white'} rounded-2xl px-5 py-3`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">C</div>
                      <span className="text-sm font-semibold text-gray-900">Chromat</span>
                    </div>
                  )}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  
                  {/* Action Status Card (Mock) */}
                  {msg.actionStatus && (
                    <div className="mt-3 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs">✓</div>
                        <span className="text-sm font-medium">Action Completed</span>
                      </div>
                      <ul className="space-y-1 pl-7">
                        {msg.actionStatus.steps.map((step, idx) => (
                          <li key={idx} className="text-xs text-gray-600 list-disc">{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Thinking Indicator */}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-5 py-3 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>


    </div>
  );
};

export default ChatArea;