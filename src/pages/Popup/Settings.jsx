import { Moon, Sun } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnippets } from './SnippetContext';

const ExportIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="currentColor"/>
    <path d="M12 16V8M12 16L9 13M12 16L15 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ImportIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="currentColor"/>
    <path d="M12 8V16M12 8L9 11M12 8L15 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Settings = () => {
  const navigate = useNavigate();
  const { snippets, tags, setSnippets, setTags, toggleDarkMode, isDarkMode } = useSnippets();
  const [importError, setImportError] = useState(null);

  const handleExport = () => {
    // Create CSV content
    const csvContent = [
      // CSV header
      ['Content', 'Tags', 'Created At', 'Updated At'].join(','),
      // CSV rows
      ...snippets.map(snippet => [
        `"${snippet.content.replace(/"/g, '""')}"`, // Escape quotes in content
        `"${snippet.tags.join(',')}"`, // Join tags with comma
        snippet.createdAt,
        snippet.updatedAt
      ].join(','))
    ].join('\n');

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'snippets_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvData = e.target.result;
          const lines = csvData.split('\n').filter(line => line.trim() !== '');
          const importedSnippets = lines.slice(1).map(line => {
            const [content, tagsString, createdAt, updatedAt] = line.split(',').map(item => item.trim().replace(/^"|"$/g, ''));
            const snippetTags = tagsString.split(',').map(tag => tag.trim());
            return { 
              id: Math.random().toString(36).substr(2, 9), // Generate a new ID
              content, 
              tags: snippetTags,
              createdAt: createdAt || new Date().toISOString(),
              updatedAt: updatedAt || new Date().toISOString()
            };
          });

          // Update tags
          const newTags = new Set(tags);
          importedSnippets.forEach(snippet => {
            snippet.tags.forEach(tag => newTags.add(tag));
          });

          setSnippets([...snippets, ...importedSnippets]);
          setTags(Array.from(newTags));
          setImportError(null);
        } catch (error) {
          setImportError('Invalid file format or data');
        }
      };
      reader.readAsText(file);
    } else {
      setImportError('Please select a valid CSV file');
    }
  };

  return (
    <div className={`p-4 h-full flex flex-col overflow-y-auto ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className="flex items-center mb-4">
        <button className="mr-2 text-2xl" onClick={() => navigate('/')}>←</button>
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>

      <h3 className="text-lg font-semibold mt-4 mb-2">Import and export</h3>
      <div className="flex items-center justify-between mb-2">
        <span>Export data</span>
        <button
          className="text-blue-500 hover:text-blue-600"
          onClick={handleExport}
          aria-label="Export data"
        >
          <ImportIcon />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span>Import data</span>
        <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
          <ExportIcon />
          <input
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
            aria-label="Import data"
          />
        </label>
      </div>
      {importError && <p className="text-red-500 mt-2">{importError}</p>}

      <h3 className="text-lg font-semibold mt-4 mb-2">Other settings</h3>
      <div className="flex items-center justify-between">
        <span className="mr-2">{isDarkMode ? 'Dark mode' : 'Light mode'}</span>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
            <div className={`w-14 h-7 bg-gray-300 rounded-full transition-colors ${
              isDarkMode ? 'bg-blue-500' : ''
            }`}>
              <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 flex items-center justify-center ${
                isDarkMode ? 'translate-x-7' : ''
              }`}>
                {isDarkMode ? (
                  <Moon size={12} className="text-blue-500" />
                ) : (
                  <Sun size={12} className="text-yellow-500" />
                )}
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default Settings;