import React, { useEffect, useState } from 'react';
import { useSnippets } from './SnippetContext';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dexieStore } from '../../Dexie/DexieStore';
import { formatDate } from './utils/formatDate';

const NoteList = () => {
    const navigate = useNavigate()

    const [recentNotes, setRecentNotes] = useState([])
    const { isDarkMode, refresh } = useSnippets();

    useEffect(() => {

        (async () => {
            const storedRecentNotes = await dexieStore.getRecentNotes()
            setRecentNotes(storedRecentNotes);
        })()

    }, [])



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
                        placeholder="Search notes"
                        className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-gray-200 placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                            }`}
                    />
                </div>
            </div>

            {/* Notes List */}
            <div id="allNotes-container" className="overflow-y-auto px-4">
                {recentNotes.length > 0 ? (
                    recentNotes.map(({ symId, note }) => (
                        <div
                            onClick={async () => {
                                const activeSymbol = await dexieStore.getSymbols().then((symbolArr) => {
                                    return symbolArr.find((item) => item.symId == symId);
                                });
                                navigate(`/activeNotes/${JSON.stringify(activeSymbol)}`);
                            }}
                            key={symId}
                            className={`flex items-center cursor-pointer hover:${isDarkMode ? 'bg-[#394e58]' : 'bg-[#e1e8eb]'
                                } py-2 px-3 mb-2 rounded-lg shadow ${isDarkMode ? 'bg-[#2a3942]' : 'bg-[#ffffff]'}`}
                        >
                            {/* Profile Picture */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode
                                    ? 'bg-gradient-to-br from-[#3c6255] to-[#0b4f40]'
                                    : 'bg-gradient-to-br from-[#85c496] to-[#1e5f2f]'
                                    }`}
                            >
                                <span className="text-xl font-semibold text-white">
                                    {note.title[0].toUpperCase()}
                                </span>
                            </div>

                            {/* Note Info */}
                            <div className="pl-2 w-20 flex-1">
                                <div className="flex justify-between">
                                    <span className={`w-20 overflow-hidden whitespace-nowrap text-ellipsis font-semibold text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                        {note.title}
                                    </span>
                                    <span className={` ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
                    ))
                ) : (
                    <p className={`text-center mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        No notes available.
                    </p>
                )}
            </div>
        </div>



    );
};

export default NoteList;
