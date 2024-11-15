import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isDarkMode }) => {
  const location = useLocation();

  return location.pathname === '/activeNotes' ? null : (
    <div className={`flex justify-around p-3 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border-t`}>
      <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-blue-500' : isDarkMode ? 'text-gray-300' : 'text-gray-400'}`}>
        <span className="text-xl">📚</span>
        <span className="text-xs">Snippets</span>
      </Link>
      <Link to="/tags" className={`flex flex-col items-center ${location.pathname === '/tags' ? 'text-blue-500' : isDarkMode ? 'text-gray-300' : 'text-gray-400'}`}>
        <span className="text-xl">🏷️</span>
        <span className="text-xs">Tags</span>
      </Link>
      <Link to="/noteList" className={`flex flex-col items-center ${location.pathname === '/noteList' ? 'text-blue-500' : isDarkMode ? 'text-gray-300' : 'text-gray-400'}`}>
        <span className="text-xl">📝+</span>
        <span className="text-xs">Notes</span>
      </Link>
      <Link to="/settings" className={`flex flex-col items-center ${location.pathname === '/settings' ? 'text-blue-500' : isDarkMode ? 'text-gray-300' : 'text-gray-400'}`}>
        <span className="text-xl">⚙️</span>
        <span className="text-xs">Settings</span>
      </Link>
    </div>
  );
};

export default Navbar;