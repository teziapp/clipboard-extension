import React from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import AddOrEditSnippet from './AddOrEditSnippet';
import Navbar from './Navbar';
import Settings from './Settings';
import { SnippetProvider, useSnippets } from './SnippetContext';
import SnippetList from './SnippetList';
import TagManager from './TagManager';

const Popup = () => {
  const snippetContext = useSnippets();
  const isDarkMode = snippetContext ? snippetContext.isDarkMode : false;

  return (
    <SnippetProvider>
      <Router>
        <div className={`w-[300px] h-[500px] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-md flex flex-col`}>
          <div className="flex-grow overflow-y-auto">
            <Routes>
              <Route path="/" element={<SnippetList />} />
              <Route path="/add" element={<AddOrEditSnippet />} />
              <Route path="/edit/:snippetId" element={<AddOrEditSnippet />} />
              <Route path="/tags" element={<TagManager />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
          <Navbar />
        </div>
      </Router>
    </SnippetProvider>
  );
};

export default Popup;