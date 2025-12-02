import React, { useState } from 'react';
import { Send, Mic, Plus } from 'lucide-react';

const ChatInput = ({ onSendMessage, isThinking }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <button type="button" className="absolute left-3 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Plus className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Chromat to do something..."
            className="w-full pl-12 pr-24 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm text-gray-700 placeholder-gray-400"
          />
          
          <div className="absolute right-2 flex items-center gap-1">
            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Mic className="w-5 h-5" />
            </button>
            <button 
              type="submit" 
              disabled={!input.trim() || isThinking}
              className={`p-2 rounded-xl transition-all ${
                input.trim() && !isThinking
                  ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-400">Chromat can make mistakes. Please verify important information.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;