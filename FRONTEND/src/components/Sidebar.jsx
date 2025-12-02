import React from 'react';
import { Plus, Settings, Layers, Menu, Search } from 'lucide-react';

const Sidebar = ({ onNewChat, chatHistory = [], activeChatId, onSelectChat, isOpen, toggleSidebar }) => {
  return (
    <div 
      className={`${
        isOpen ? 'w-64' : 'w-16'
      } bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out`}
    >
      {/* Sidebar Header */}
      <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} p-4`}>
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="text-gray-500 hover:bg-gray-100 p-1 rounded">
            <Menu className="w-5 h-5" />
          </button>
          {isOpen && <span className="text-xl font-semibold text-gray-900">Chromat</span>}
        </div>
        {isOpen && <Search className="w-5 h-5 text-gray-400 cursor-pointer" />}
      </div>

      {/* New Chat Button */}
      <div className="px-3 pb-4">
        <button 
          onClick={onNewChat}
          className={`flex items-center gap-2 text-gray-700 hover:bg-gray-100 w-full p-2 rounded-md transition-colors ${!isOpen && 'justify-center'}`}
          title="New Chat"
        >
          <Plus className="w-5 h-5" />
          {isOpen && <span className="font-medium whitespace-nowrap">New chat</span>}
        </button>
      </div>

      {/* Explore Gems (Mock) */}
      <div className="px-3 pb-4">
        <button 
          className={`flex items-center gap-2 text-gray-700 hover:bg-gray-100 w-full p-2 rounded-md transition-colors ${!isOpen && 'justify-center'}`}
          title="Explore Gems"
        >
          <Layers className="w-5 h-5 text-orange-500" />
          {isOpen && <span className="font-medium whitespace-nowrap">Explore Gems</span>}
        </button>
      </div>

      {/* Recent Chats List */}
      <div className="flex-1 overflow-y-auto px-2 scrollbar-hide">
        {isOpen && <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase whitespace-nowrap">Recent</div>}
        <div className="mt-1 space-y-1">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat && onSelectChat(chat.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                chat.id === activeChatId 
                  ? 'bg-orange-50 text-gray-900 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              } ${!isOpen && 'justify-center'}`}
              title={chat.title}
            >
              {/* We could add an icon for chats if we wanted, for now just text or truncated text */}
              {isOpen ? (
                <span className="truncate">{chat.title}</span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-400"></span> // Dot for history item when collapsed
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Settings */}
      <div className="p-4 border-t border-gray-200">
        <button 
          className={`flex items-center gap-2 text-gray-600 hover:text-gray-900 w-full p-2 rounded-md hover:bg-gray-100 transition-colors ${!isOpen && 'justify-center'}`}
          title="Settings"
        >
          <Settings className="w-4 h-4" />
          {isOpen && <span className="text-sm whitespace-nowrap">Settings and help</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;