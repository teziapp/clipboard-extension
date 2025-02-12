import { DownloadCloudIcon, Moon, RefreshCcw, RefreshCcwIcon, Sun, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnippets } from './SnippetContext';
import { InitialUserSetup } from './utils/auth/InitialUserSetup';
import { deleteUnsynced, loadUnsynced } from '../../Dexie/utils/sheetSyncHandlers';
import { dexieStore } from '../../Dexie/DexieStore';
import { Loading } from './utils/Loading';

const ExportIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="currentColor" />
    <path d="M12 16V8M12 16L9 13M12 16L15 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ImportIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="currentColor" />
    <path d="M12 8V16M12 8L9 11M12 8L15 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Settings = () => {
  const navigate = useNavigate();
  const { snippets, tags, setSnippets, setTags, toggleDarkMode, isDarkMode, userCreds, setUserCreds } = useSnippets();
  const [importError, setImportError] = useState(null);
  const [sheetUrlInput, setSheetUrlInput] = useState("")
  const [loading, setLoading] = useState(false)

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


  async function generateSheetUrl() {
    setLoading(true)

    const setup = await InitialUserSetup()
    if (setup == 'doneSetup') {
      alert('Registration successful!')
      chrome.storage.local.get(["userCreds"]).then((val) => {
        setUserCreds(val.userCreds)
      })
    } else { alert('Oops.. something went wrong!') }

    setLoading(false)
  }

  async function registerSheetUrl() {
    if (!sheetUrlInput) return alert('Enter a valid URL.');
    const sheetId = sheetUrlInput.match(/\/d\/([a-zA-Z0-9-_]+)\//) ? sheetUrlInput.match(/\/d\/([a-zA-Z0-9-_]+)\//)[1] : null
    if (!sheetId) return alert('Enter a valid URL.');

    setLoading(true)

    chrome.storage.local.set({ userCreds: { sheetId: sheetId } }).then(() => {
      setUserCreds({ sheetId })
    })

    setLoading(false)
  }

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
            <div className={`w-14 h-7 bg-gray-300 rounded-full transition-colors ${isDarkMode ? 'bg-blue-500' : ''
              }`}>
              <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 flex items-center justify-center ${isDarkMode ? 'translate-x-7' : ''
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

      <div className={`w-full mt-3 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>

        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-black"}`}>
          Sheet Settings
        </h3>


        {userCreds.sheetId ? <div className={`flex flex-row justify-between mb-3 items-center p-2 rounded-md ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}>
          <span>
            <a className={`underline font-semibold text-sm ${isDarkMode ? "text-[#00a884] hover:text-[#009172]" : "text-green-700 hover:text-blue-500"}`}
              href={`https://docs.google.com/spreadsheets/d/${userCreds.sheetId}`}
              target="_blank"
              rel="noopener noreferrer">
              Current-Sheet
            </a>
          </span>
          <button className={`hover:text-red-500 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            onClick={() => {
              chrome.storage.local.remove("userCreds").then(() => {
                setUserCreds({})
              })
            }}>
            <Trash2 size={20} />
          </button>
        </div>

          : <div className={`flex flex-col items-center p-3 mb-3 rounded-md ${isDarkMode ? "bg-[#2a3942]" : "bg-gray-100"}`}>

            <button
              className={`w-full py-2 rounded-md font-medium transition duration-200 ${isDarkMode
                ? "bg-[#007c65] hover:bg-[#00a884] text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              onClick={() => generateSheetUrl()}
            >
              Create New
            </button>

            <span className="my-2 text-sm text-gray-500">or</span>

            <div className="flex flex-row w-full gap-1">
              <input
                type="text"
                value={sheetUrlInput}
                onChange={(e) => setSheetUrlInput(e.target.value)}
                placeholder="Enter existing sheet URL"
                className={`flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition duration-200 ${isDarkMode
                  ? "bg-gray-600 text-white border-none focus:ring-[#00a884] placeholder-gray-300"
                  : "bg-white text-black border border-gray-300 focus:ring-blue-500 placeholder-gray-500"
                  }`}
              />

              <button
                className={`px-2 py-2 rounded-md font-medium transition duration-200 ${isDarkMode
                  ? "bg-[#007c65] hover:bg-[#00a884] text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                onClick={() => registerSheetUrl()}
              >
                Register
              </button>
            </div>

          </div>
        }




        <div className='flex flex-row justify-between items-center mb-3'>
          <span className='flex flex-row' title='Loads un-synced data to sheet'>Backup Un-synced data to sheet</span>
          <button className={`px-2 py-1 rounded-md font-medium ${isDarkMode
            ? "bg-[#007c65] hover:bg-[#00a884] text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            onClick={async () => {
              setLoading(true)

              await loadUnsynced().then((res1) => {
                if (!res1 || res1 == 'networkError') {
                  alert('something went wrong while backing up - check your coonection!!')
                  return
                }

                deleteUnsynced().then((res2) => {
                  if (!res2 || res2 == 'networkError') {
                    alert('something went wrong while backing up - check your connection!')
                    return
                  }

                  alert('synced data successfully')
                })
              }).catch(err => console.log(err))

              setLoading(false)
            }}>{<RefreshCcwIcon size={18}></RefreshCcwIcon>}</button>
        </div>

        <div className='flex flex-row justify-between items-center'>
          <span className='flex flex-row' title='Loads un-synced data to sheet'>Load data from sheet to local</span>
          <button className={`px-2 py-1 rounded-md font-medium ${isDarkMode
            ? "bg-[#007c65] hover:bg-[#00a884] text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            onClick={async () => {
              setLoading(true)
              await dexieStore.populateLocal().then((res) => {
                res ? alert("Loaded Data to Local Successfully!") : alert("Oops.. something went wrong!")
              })
              setLoading(false)
            }}>{<DownloadCloudIcon size={18}></DownloadCloudIcon>}</button>
        </div>
      </div>

      <Loading show={loading}></Loading>
    </div>
  );
};

export default Settings;