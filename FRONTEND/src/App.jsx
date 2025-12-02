import React, { useState, useEffect } from 'react';
import { Trash2, Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import BrowserView from './components/BrowserView';
import ChatInput from './components/ChatInput';
import { getChatResponse } from './utils/gemini';

function App() {
  // Load chats from LocalStorage or use default
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('chromat_chats');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "VM_Task", messages: [], browserUrl: 'https://www.google.com', tabs: [{ id: 1, url: 'https://www.google.com', title: 'Google' }], activeTabId: 1 },
      { id: 2, title: "Building AI-Powered Video Editor", messages: [], browserUrl: 'https://www.google.com', tabs: [{ id: 1, url: 'https://www.google.com', title: 'Google' }], activeTabId: 1 },
    ];
  });

  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [tempBrowserUrl, setTempBrowserUrl] = useState('https://www.google.com'); // For when no chat is active
  const [tempTabs, setTempTabs] = useState([{ id: 1, url: 'https://www.google.com', title: 'Google' }]);
  const [tempActiveTabId, setTempActiveTabId] = useState(1);

  // Save to LocalStorage whenever chats change
  useEffect(() => {
    localStorage.setItem('chromat_chats', JSON.stringify(chats));
  }, [chats]);

  // Get current chat's messages and browser state
  const activeChat = chats.find(c => c.id === activeChatId);
  const messages = activeChat ? activeChat.messages : [];
  const currentBrowserUrl = activeChat ? (activeChat.browserUrl || 'https://www.google.com') : tempBrowserUrl;
  const currentTabs = activeChat ? (activeChat.tabs || [{ id: 1, url: 'https://www.google.com', title: 'Google' }]) : tempTabs;
  const currentActiveTabId = activeChat ? (activeChat.activeTabId || 1) : tempActiveTabId;

  const handleUpdateBrowserUrl = (url) => {
    if (activeChatId) {
      setChats(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, browserUrl: url }
          : chat
      ));
    } else {
      // No active chat - use temporary state
      setTempBrowserUrl(url);
    }
  };

  const handleUpdateTabs = (tabs) => {
    if (activeChatId) {
      setChats(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, tabs }
          : chat
      ));
    } else {
      setTempTabs(tabs);
    }
  };

  const handleUpdateActiveTab = (tabId) => {
    if (activeChatId) {
      setChats(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, activeTabId: tabId }
          : chat
      ));
    } else {
      setTempActiveTabId(tabId);
    }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setIsThinking(false);
    setTempBrowserUrl('https://www.google.com'); // Reset to Google
    setTempTabs([{ id: 1, url: 'https://www.google.com', title: 'Google' }]);
    setTempActiveTabId(1);
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setIsThinking(false);
  };

  const handleDeleteChat = () => {
    if (activeChatId) {
      setChats(prev => prev.filter(chat => chat.id !== activeChatId));
      setActiveChatId(null);
    }
  };

  const handleSendMessage = async (text) => {
    const newMessage = { 
      id: Date.now(), 
      role: 'user', 
      content: text, 
      timestamp: new Date().toISOString() 
    };
    
    let currentChatId = activeChatId;

    if (!currentChatId) {
      // Create new chat if none selected
      const newId = Date.now();
      const newChat = {
        id: newId,
        title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
        messages: [newMessage],
        browserUrl: 'https://www.google.com', // Initialize with Google
        tabs: [{ id: 1, url: 'https://www.google.com', title: 'Google' }],
        activeTabId: 1,
        timestamp: new Date().toISOString()
      };
      setChats(prev => [newChat, ...prev]);
      currentChatId = newId;
      setActiveChatId(newId);
    } else {
      // Add message to existing chat
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      ));
    }

    // Get AI Response using Gemini
    setIsThinking(true);
    
    try {
      const aiResponse = await getChatResponse(text);
      setIsThinking(false);
      
      const assistantMsg = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: aiResponse.content,
        actionStatus: aiResponse.type === 'action' ? aiResponse.actionStatus : null,
        timestamp: new Date().toISOString()
      };

      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, assistantMsg] }
          : chat
      ));

      // If the AI returned a URL action, navigate the browser to it
      if (aiResponse.url) {
        handleUpdateBrowserUrl(aiResponse.url);
        
        // Update the active tab or create new tab with the URL
        const updatedTabs = currentTabs.map(tab => 
          tab.id === currentActiveTabId 
            ? { ...tab, url: aiResponse.url, title: new URL(aiResponse.url).hostname }
            : tab
        );
        handleUpdateTabs(updatedTabs);
      }
    } catch (error) {
      setIsThinking(false);
      console.error('Error getting AI response:', error);
      
      const errorMsg = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      };

      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, errorMsg] }
          : chat
      ));
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans">
      {/* Sidebar */}
      <Sidebar 
        onNewChat={handleNewChat} 
        chatHistory={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            {/* Show Title here if sidebar is collapsed */}
            {!isSidebarOpen && <h1 className="text-xl font-semibold text-gray-900">Chromat</h1>}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleDeleteChat}
              className={`p-2 text-gray-500 hover:bg-gray-100 rounded-full ${!activeChatId ? 'opacity-50 cursor-not-allowed' : ''}`} 
              title="Delete Chat"
              disabled={!activeChatId}
            >
               <Trash2 className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
               <span className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">PRO</span>
               <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                 U
               </div>
            </div>
          </div>
        </header>

        {/* Split View: Chat & Browser */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area (Left Panel) */}
          <div className="w-[400px] border-r border-gray-200 h-full flex flex-col bg-white">
            <ChatArea 
              messages={messages} 
              onSendMessage={handleSendMessage}
              isThinking={isThinking} 
            />
          </div>

          {/* Right Panel: Browser + Input */}
          <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
            <BrowserView 
              url={currentBrowserUrl}
              onUrlChange={handleUpdateBrowserUrl}
              tabs={currentTabs}
              activeTabId={currentActiveTabId}
              onTabsChange={handleUpdateTabs}
              onActiveTabChange={handleUpdateActiveTab}
            />
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isThinking={isThinking} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
