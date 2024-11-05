import React, { useEffect, useRef, useState } from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import AddOrEditSnippet from './AddOrEditSnippet';
import Navbar from './Navbar';
import Settings from './Settings';
import { SnippetProvider, useSnippets } from './SnippetContext';
import SnippetList from './SnippetList';
import TagManager from './TagManager';
import InitialUserPage from './InitialUserPage';
import { InitialLoading } from './InitialLoading';




const Popup = () => {

  return (
    <SnippetProvider>
      <PopupContent />
    </SnippetProvider>
  );
};

const PopupContent = () => {
  const { isDarkMode } = useSnippets();

  const [isLoading, setIsLoading] = useState(true)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)

  //useRffect will check wether it's a first time user of not by looking for: "is the value of sheetId already present in local storage of not" 
  // and from that it will be decided which page to render as the default route path '/'


  useEffect(() => {
    console.log('useEffect ran')

    chrome.storage.local.get(['userCreds']).then((res) => {
      setIsLoading(false)
      !res.userCreds.sheetId ? setIsFirstTimeUser(true) : null
    }).catch((rej) => {
      console.log('rej with: ', rej.userCreds.sheetId)
    })

  }, [isFirstTimeUser])
  //EDGE-CASE : need to consider synchronization between bg.Script setting userCred value and this one here reading it 


  return isLoading ? <InitialLoading></InitialLoading> : (
    <Router>
      <div className={`w-[300px] h-[500px] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-md flex flex-col`}>
        <div className="flex-grow overflow-y-auto">
          <Routes>

            {isFirstTimeUser ? <Route path='/' element={<InitialUserPage setIsFirstTimeUser={setIsFirstTimeUser}></InitialUserPage>}></Route> : <Route path="/" element={<SnippetList />} />}


            <Route path="/add" element={<AddOrEditSnippet />} />
            <Route path="/edit/:snippetId" element={<AddOrEditSnippet />} />
            <Route path="/tags" element={<TagManager />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        {!isFirstTimeUser ? <Navbar isDarkMode={isDarkMode} /> : null}
      </div>
    </Router>
  );
};

export default Popup;
