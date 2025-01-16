import React, { useEffect } from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import AddOrEditSnippet from './AddOrEditSnippet';
import Navbar from './Navbar';
import Settings from './Settings';
import { SnippetProvider, useSnippets } from './SnippetContext';
import SnippetList from './SnippetList';
import TagManager from './TagManager';
import NoteList from './NoteList';
import ActiveNotes from './ActiveNotes';
import SymbolConfirmationMenu from './utils/SymbolConfirmationMenu';
import { NoteSettings } from './NoteSettings';
import { SymbolConflictMenu } from './utils/SymbolConflictMenu';

const Popup = () => {

  localStorage.getItem("UserInstructions") ? null :
    localStorage.setItem("UserInstructions", JSON.stringify({
      "symbolMatchNotFound": true
    }))

  return (


    <PopupContent />


  );
};

const PopupContent = () => {



  return (
    <Router>
      <SnippetProvider>
        <div className={`w-[300px] h-[500px] shadow-md flex flex-col`}>
          <div className="flex-grow overflow-y-hidden">
            <Routes>
              <Route path="/" element={<SnippetList />} />
              <Route path='/symbolConfirmationMenu' element={<SymbolConfirmationMenu />}></Route>
              <Route path="/add" element={<AddOrEditSnippet />} />
              <Route path="/edit/:snippetId" element={<AddOrEditSnippet />} />
              <Route path="/tags" element={<TagManager />} />
              <Route path="/settings" element={<Settings />} />
              <Route path='/noteList' element={<NoteList></NoteList>} />
              <Route path='/activeNotes/:activeSymbolId' element={<ActiveNotes></ActiveNotes>} />
              <Route path='/noteSettings/:activeSymbolId' element={<NoteSettings />}></Route>
              <Route path='/symbolConflictMenu' element={<SymbolConflictMenu></SymbolConflictMenu>}></Route>
            </Routes>
          </div>
          <Navbar />
        </div>
      </SnippetProvider>
    </Router>
  );
};

export default Popup;