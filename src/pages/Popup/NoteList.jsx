import React, { useEffect } from 'react';
import { useSnippets } from './SnippetContext';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dexieStore from '../../Dexie/DexieStore';

const NoteList = () => {
    const navigate = useNavigate()

    const { notes, isDarkMode, setActiveSymbol } = useSnippets();

    useEffect(() => {
        document.getElementById('allNotes-container').scrollTo({
            top: document.getElementById('allNotes-container').scrollHeight,
            behavior: "smooth",
        });
    }, [])

    notes.sort((a, b) => a.date - b.date)
    // Group notes by their creation date
    const groupedNotes = notes.reduce((acc, note) => {
        const rawDate = new Date(note.date)
        const date = `${rawDate.getDate()}-${rawDate.getMonth()}-${rawDate.getFullYear()}`
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(note);
        return acc;
    }, {});

    return (
        <div
            className={`w-full h-full font-sans flex flex-col pr-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
        >
            {/* Search Bar (without functionality) */}

            <div className={` flex items-center mb-0 p-4 pr-2`}>
                <input
                    type="text"
                    placeholder="Search notes"
                    className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-900'
                        }`}
                />
                <Search
                    size={20}
                    className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                />
            </div>

            {/* Notes List Grouped by Date */}
            <div id='allNotes-container' className="overflow-y-auto pl-4 pr-3">
                {Object.keys(groupedNotes).length > 0 ? (
                    Object.keys(groupedNotes).map((date) => (
                        <div key={date} className="mb-6">
                            <hr className={`${isDarkMode ? 'border-gray-700' : 'border-gray-300'} mb-0.2`} />
                            <span
                                className={`block w-full text-right text-sm font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-400'
                                    }`}
                            >
                                {date}
                            </span>
                            {groupedNotes[date].map(note => (

                                <div onClick={async () => {
                                    const activeSymbol = await dexieStore.db.symbols.get({ symId: note.symId })
                                    console.log(activeSymbol)
                                    setActiveSymbol(activeSymbol)
                                    navigate('/activeNotes')
                                }}
                                    key={note.noteId}
                                    className={`cursor-pointer hover:${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                                        } p-2 mb-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                                >
                                    <span className={`block font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                        {note.title}
                                    </span>
                                    <p className={`overflow-hidden whitespace-nowrap text-ellipsis ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {note.content}
                                    </p>
                                </div>

                            ))}

                        </div>
                    ))
                ) : (
                    <p className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No notes available.
                    </p>
                )}
            </div>
        </div>
    );
};

export default NoteList;
