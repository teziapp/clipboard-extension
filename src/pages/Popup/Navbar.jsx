import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="flex justify-around p-3 bg-white border-t border-gray-200">
      <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-blue-500' : 'text-gray-400'}`}>
        <span className="text-xl">📚</span>
        <span className="text-xs">Snippets</span>
      </Link>
      <Link to="/tags" className={`flex flex-col items-center ${location.pathname === '/tags' ? 'text-blue-500' : 'text-gray-400'}`}>
        <span className="text-xl">🏷️</span>
        <span className="text-xs">Tags</span>
      </Link>
      <Link to="/settings" className={`flex flex-col items-center ${location.pathname === '/settings' ? 'text-blue-500' : 'text-gray-400'}`}>
        <span className="text-xl">⚙️</span>
        <span className="text-xs">Settings</span>
      </Link>
    </div>
  );
};

export default Navbar;