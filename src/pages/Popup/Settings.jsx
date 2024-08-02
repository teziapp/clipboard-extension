import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnippets } from './SnippetContext';

const Settings = () => {
  const navigate = useNavigate();
  const { exportData, importData, toggleDarkMode, isDarkMode } = useSnippets();
  const [importError, setImportError] = useState(null);

  const handleExport = () => {
    exportData();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          importData(e.target.result);
          setImportError(null);
        } catch (error) {
          setImportError('Invalid file format or data');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`p-4 h-full flex flex-col overflow-y-auto ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className="flex items-center mb-4">
        <button className="mr-2 text-2xl" onClick={() => navigate('/')}>←</button>
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>

      <h3 className="text-lg font-semibold mt-4 mb-2">Import and export</h3>
      <button
        className="w-full py-2 mb-2 bg-blue-500 text-white rounded-lg"
        onClick={handleExport}
      >
        Export data
      </button>
      <input
        type="file"
        accept=".csv"
        onChange={handleImport}
        className="w-full mb-2"
      />
      {importError && <p className="text-red-500 mb-2">{importError}</p>}

      <h3 className="text-lg font-semibold mt-4 mb-2">Other settings</h3>
      <button
        className={`w-full py-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        onClick={toggleDarkMode}
      >
        {isDarkMode ? 'Light mode' : 'Dark mode'}
      </button>
    </div>
  );
};

export default Settings;