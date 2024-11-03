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
  // const isFirstTimeUser = useRef(false)

  useEffect(() => {      //EDGE-CASE : need to consider synchronization between bg.Script setting userCred value and this one here reading it 
    console.log('useEffect ran')

    chrome.storage.local.get(['userCreds']).then((res) => {
      console.log('res with: ', res.userCreds.sheetId)
      setIsLoading(false)
      !res.userCreds.sheetId ? setIsFirstTimeUser(true) : null
    }).catch((rej) => {
      console.log('rej with: ', rej.userCreds.sheetId)
    })

  }, [isFirstTimeUser])



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
        {!localStorage.getItem('userCreds') ? null : <Navbar isDarkMode={isDarkMode} />}
      </div>
    </Router>
  );
};

export default Popup;
