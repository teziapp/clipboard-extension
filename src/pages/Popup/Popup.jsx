import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './Popup.css';
import SnippetList from './SnippetList';
import AddSnippet from './AddSnippet';
import ViewSnippet from './ViewSnippet';
import { SnippetProvider } from './SnippetContext';

const Popup = () => {
  return (
    <SnippetProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<SnippetList />} />
            <Route path="/add" element={<AddSnippet />} />
            <Route path="/view/:snippetId" element={<ViewSnippet />} />
          </Routes>
        </div>
      </Router>
    </SnippetProvider>
  );
};

export default Popup;