import React, { useEffect, useRef, useState } from 'react';
import { useSnippets } from './SnippetContext';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dexieStore } from '../../Dexie/DexieStore';
import { formatDate } from './utils/formatDate';
import { Loading } from './utils/Loading';
import { InitialUserSetup } from './utils/auth/InitialUserSetup';

const NoteList = () => {
    const navigate = useNavigate()

    const { isDarkMode, userCreds, setUserCreds, setNotificationState } = useSnippets();

    const storedSymbols = useRef([])
    const [SymbolsDisplay, setSymbolsDisplay] = useState([])
    const [recentNotes, setRecentNotes] = useState([])
    const [sheetUrlInput, setSheetUrlInput] = useState("")
    const [searchChatsInput, setSearchChatsInput] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        (async () => {
            const symbols = await dexieStore.getSymbols()
            storedSymbols.current = symbols
            setSymbolsDisplay(symbols)

            const storedRecentNotes = await dexieStore.getRecentNotes()
            setRecentNotes(storedRecentNotes);
        })()

    }, [])

    useEffect(() => {
        if (searchChatsInput) {
            setSymbolsDisplay(() => {
                return storedSymbols.current.slice().filter((symbol) => {
                    return symbol.title.match(new RegExp(searchChatsInput.trim(), "i"))
                }) || []
            })
            return;
        }
        setSymbolsDisplay(storedSymbols.current)

        console.log(SymbolsDisplay)
    }, [searchChatsInput])

    async function registerSheetUrl() {
        if (!sheetUrlInput) return setNotificationState({ show: true, type: 'warning', text: 'Enter a valid URL!', duration: 3000 });
        const sheetId = sheetUrlInput.match(/\/d\/([a-zA-Z0-9-_]+)\//) ? sheetUrlInput.match(/\/d\/([a-zA-Z0-9-_]+)\//)[1] : null
        if (!sheetId) return setNotificationState({ show: true, type: 'warning', text: 'Oops.. something went wrong!', duration: 3000 });

        setLoading(true)

        chrome.storage.local.set({ userCreds: { sheetId: sheetId } }).then(() => {
            setUserCreds({ sheetId })
        })
        setNotificationState({ show: true, type: 'success', text: 'Registration Successful!', duration: 3000 })
        setLoading(false)
    }

    async function generateSheetUrl() {
        setLoading(true)

        const setup = await InitialUserSetup()
        if (setup == 'doneSetup') {
            setNotificationState({ show: true, type: 'success', text: 'Sheet registered!', duration: 3000 })
            chrome.storage.local.get(["userCreds"]).then((val) => {
                setUserCreds(val.userCreds)
            })
        } else { setNotificationState({ show: true, type: 'warning', text: 'Oops.. something went wrong!', duration: 3000 }) }

        setLoading(false)
    }

    return (
        <div
            className={`w-full h-full font-sans flex flex-col ${isDarkMode ? 'bg-[#101d24] text-gray-200' : 'bg-[#eae6df] text-gray-900'}`}
        >
            {/* Search Bar - Banner Style */}
            <div
                className={`w-full py-4 mb-3 px-4 shadow-md ${isDarkMode ? 'bg-[#202c33]' : 'bg-[#f0f2f5]'}`}
            >
                <div
                    className={`flex items-center w-full px-4 py-2 rounded-lg shadow-sm ${isDarkMode ? 'bg-[#2a3942]' : 'bg-[#ffffff]'}`}
                >
                    <Search
                        size={20}
                        className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    />
                    <input
                        type="text"
                        placeholder="Search chats"
                        value={searchChatsInput}
                        onChange={(e) => setSearchChatsInput(e.target.value)}
                        className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-gray-200 placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                            }`}
                    />
                </div>
            </div>

            {/* Notes List */}
            <div id="allNotes-container" className="overflow-y-auto px-3">
                {recentNotes.length > 0 ? (
                    recentNotes.map(({ symId, note }) => {
                        const currentSymbol = SymbolsDisplay.find((ele) => ele.symId == symId)
                        if (!currentSymbol) return;

                        return (
                            <div
                                onClick={async () => {
                                    navigate(`/activeNotes/${symId}`);
                                }}
                                key={symId}
                                className={`flex items-center cursor-pointer hover:${isDarkMode ? 'bg-[#394e58]' : 'bg-[#e1e8eb]'
                                    } py-2 px-3 mb-2 rounded-lg shadow ${isDarkMode ? 'bg-[#2a3942]' : 'bg-[#ffffff]'}`}
                            >
                                {/* Profile Picture */}
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center ${isDarkMode
                                        ? 'bg-gradient-to-br from-[#3c6255] to-[#0b4f40]'
                                        : 'bg-gradient-to-br from-[#85c496] to-[#1e5f2f]'
                                        }`}
                                >
                                    <span className="text-xl font-semibold text-white">
                                        {currentSymbol?.title[0].toUpperCase()}
                                    </span>
                                </div>

                                {/* Note Info */}
                                <div className="pl-2 w-20 flex-1">
                                    <div className="flex justify-between">
                                        <span className={`overflow-hidden whitespace-nowrap text-ellipsis font-semibold text-sm w-32 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                            {currentSymbol?.title}
                                        </span>
                                        <span className={`ml-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {formatDate(note.date)}
                                        </span>
                                    </div>
                                    <p
                                        className={`overflow-hidden whitespace-nowrap text-ellipsis text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}
                                    >
                                        {note.content}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className='flex flex-col justify-center'>
                        <p className={`text-center my-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            No notes available.
                        </p>

                        {userCreds.sheetId ? null : (<div className={`flex flex-col items-center p-3 mb-3 rounded-md ${isDarkMode ? "bg-[#2a3942]" : "bg-gray-100"}`}>

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

                        </div>)}


                    </div>
                )}
            </div>
            <Loading text={"Sheet is getting registered..."} show={loading}></Loading>
        </div>

    );
};

export default NoteList;
