import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Star, MoreVertical, X, Plus, Search, Lock } from 'lucide-react';

const BrowserView = ({ url, onUrlChange, tabs, activeTabId, onTabsChange, onActiveTabChange }) => {
  const [inputUrl, setInputUrl] = useState(url || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setInputUrl(url || '');
  }, [url]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    let targetUrl = inputUrl;
    if (!targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl;
    }
    
    // Update the active tab's URL
    const updatedTabs = tabs.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, url: targetUrl, title: new URL(targetUrl).hostname }
        : tab
    );
    onTabsChange(updatedTabs);
    onUrlChange(targetUrl);
    setIsLoading(true);
  };

  const handleTabClick = (tabId) => {
    onActiveTabChange(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      onUrlChange(tab.url);
    }
  };

  const handleNewTab = () => {
    const newTab = {
      id: Date.now(),
      url: 'https://www.google.com',
      title: 'New Tab'
    };
    const updatedTabs = [...tabs, newTab];
    onTabsChange(updatedTabs);
    onActiveTabChange(newTab.id);
    onUrlChange(newTab.url);
  };

  const handleCloseTab = (tabId, e) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Don't close last tab
    
    const updatedTabs = tabs.filter(t => t.id !== tabId);
    onTabsChange(updatedTabs);
    
    // If closing active tab, switch to first remaining tab
    if (tabId === activeTabId && updatedTabs.length > 0) {
      onActiveTabChange(updatedTabs[0].id);
      onUrlChange(updatedTabs[0].url);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Helper to convert YouTube watch URLs to embed URLs for the demo
  const getDisplayUrl = (srcUrl) => {
    if (!srcUrl) return '';
    
    // If running in Electron, use the real URL (no embed needed)
    if (/Electron/.test(navigator.userAgent)) {
      return srcUrl;
    }

    if (srcUrl.includes('youtube.com/watch?v=')) {
      const videoId = srcUrl.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return srcUrl;
  };

  // Robust Electron detection
  const isElectron = /Electron/.test(navigator.userAgent);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 m-4 mb-0">
      {/* Debug Info - Helpful for troubleshooting */}
      <div className="bg-yellow-100 text-xs p-1 text-center border-b border-yellow-200 text-yellow-800">
        System: {isElectron ? 'Desktop App (Electron)' : 'Web Browser'} | URL: {url || 'None'}
      </div>

      {/* Browser Chrome (Header) */}
      <div className="bg-gray-100 border-b border-gray-200">
        {/* Tabs */}
        <div className="flex items-center px-2 pt-2 gap-2 overflow-x-auto">
          {tabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-lg shadow-sm border-t border-x min-w-[150px] max-w-[240px] cursor-pointer transition-colors ${
                tab.id === activeTabId 
                  ? 'bg-white border-gray-200' 
                  : 'bg-gray-200 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <img src={`https://www.google.com/s2/favicons?domain=${tab.url}`} alt="Icon" className="w-4 h-4" />
              <span className="text-xs text-gray-700 truncate flex-1">{tab.title}</span>
              <button 
                onClick={(e) => handleCloseTab(tab.id, e)}
                className="p-0.5 hover:bg-gray-200 rounded-full"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          ))}
          <button onClick={handleNewTab} className="p-1 hover:bg-gray-200 rounded-full">
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Address Bar & Controls */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-gray-200">
          <div className="flex items-center gap-1 text-gray-500">
            <button className="p-1.5 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-gray-100 rounded-full"><ArrowRight className="w-4 h-4" /></button>
            <button onClick={() => setIsLoading(true)} className="p-1.5 hover:bg-gray-100 rounded-full"><RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /></button>
            <button className="p-1.5 hover:bg-gray-100 rounded-full"><Home className="w-4 h-4" /></button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full border border-transparent hover:border-gray-300 focus-within:border-orange-500 focus-within:bg-white transition-all group">
            <Lock className="w-3 h-3 text-gray-500" />
            <input 
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-700"
              placeholder="Search or enter website name"
            />
            <div className="flex items-center gap-1">
               {/* Submit button */}
               <button type="submit" className="p-1 hover:bg-gray-200 rounded-full text-gray-500">
                 <ArrowRight className="w-3.5 h-3.5" />
               </button>
            </div>
          </form>

          <div className="flex items-center gap-1 text-gray-500">
             <button className="p-1.5 hover:bg-gray-100 rounded-full"><MoreVertical className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Browser Content (Viewport) */}
      <div className="flex-1 bg-white relative group flex flex-col h-full">
        {url ? (
          isElectron ? (
            <webview 
              src={getDisplayUrl(url)} 
              style={{ display: 'inline-flex', width: '100%', height: '100%' }}
              title="Browser Content"
              allowpopups="true"
            />
          ) : (
            <iframe 
              src={getDisplayUrl(url)} 
              className="flex-1 w-full h-full border-none"
              title="Browser Content"
              onLoad={handleIframeLoad}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-gray-500 font-medium">Enter a URL to browse</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserView;