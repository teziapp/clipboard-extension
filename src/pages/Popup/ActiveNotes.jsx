import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSnippets } from './SnippetContext';
import { useNavigate, useParams } from 'react-router-dom';
import { dexieStore } from '../../Dexie/DexieStore';
import { formatDate } from './utils/formatDate';
import cuid from 'cuid';


const ActiveNotes = () => {

    const { isDarkMode } = useSnippets();
    const [noteContent, setNoteContent] = useState('');
    const [activeNotes, setActiveNotes] = useState([])
    const activeSymbol = JSON.parse(useParams().activeSymbol)

    const navigate = useNavigate()

    //scrolls to the bottom when the component loads initially and when new note is added 
    useEffect(() => {
        document.getElementById('notes-container').scrollTo({
            top: document.getElementById('notes-container').scrollHeight,
            behavior: "smooth",
        });
    }, [activeNotes])

    useEffect(() => {
        (async () => {
            const storedActiveNotes = await dexieStore.getActiveNotes(activeSymbol.symId)
            setActiveNotes(storedActiveNotes)
        })()
    }, [activeSymbol.symId])

    const notes = activeNotes
    notes.sort((a, b) => a.date - b.date)
    let groupedNotes = {}
    notes.forEach((i) => {
        const date = new Date(i.date)
        const formattedDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
        if (!groupedNotes[formattedDate]) {
            groupedNotes[formattedDate] = [i]
            return
        }
        groupedNotes[formattedDate] = [...groupedNotes[formattedDate], i]
    })

    //Notes functions
    const addNote = (content) => {
        const localMilliseconds = Date.now() - (new Date().getTimezoneOffset() * 60000); //timeZoneOffset compares local time-zone with default UTC value and returns no. of minutes ahead/behind
        console.log(localMilliseconds)
        const newNote = { noteId: cuid(), content, symId: activeSymbol.symId, date: localMilliseconds, title: activeSymbol.title };
        const updatedNotes = [...activeNotes, newNote];
        setActiveNotes(updatedNotes);
        dexieStore.addNote(newNote);
    };

    const deleteNote = (noteId) => {
        const updatedNotes = activeNotes.filter(note => note.noteId !== noteId);
        setActiveNotes(updatedNotes);
        dexieStore.deleteNote(noteId);
    };


    return (

        <div className={`w-full h-full font-sans flex flex-col ${isDarkMode ? 'bg-[#111b21]' : 'bg-[#eae6df]'}`}>

            {/* Header Section */}
            <div className={`flex items-center gap-3 px-4 py-3 shadow-md ${isDarkMode ? 'bg-[#202c33]' : 'bg-[#f0f2f5]'}`}>
                <ArrowLeft
                    className={`cursor-pointer ${isDarkMode ? 'text-[#00a884] hover:text-[#009172]' : 'text-[#008069] hover:text-[#006d57]'}`}
                    size={24}
                    onClick={() => navigate('/noteList')}
                />
                <h1 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {activeSymbol.title}
                </h1>
            </div>

            {/* Notes Section */}
            <div id="notes-container" className="flex-grow overflow-y-auto px-4 py-3">
                {notes.length > 0 ? (
                    Object.keys(groupedNotes).map((date) => (
                        <div key={date}>
                            {/* Date Separator */}
                            <div className="flex justify-center my-3">
                                <span
                                    className={`text-xs px-3 py-1 rounded-md ${isDarkMode ? 'bg-[#233239] text-gray-300' : 'bg-[#d1d7d9] text-gray-700'}`}
                                >
                                    {formatDate(groupedNotes[date][0].date)}
                                </span>
                            </div>

                            {/* Notes */}
                            {groupedNotes[date].map((note) => (
                                <div
                                    key={note.noteId}
                                    className={`flex ${isDarkMode ? 'bg-[#234a40]' : 'bg-[#d0ffc7]'} rounded-lg p-3 mb-3 shadow`}
                                >
                                    <div className="flex-grow">
                                        <div
                                            className={`overflow-auto text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
                                        >
                                            {note.content}
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {new Date(note.date).toISOString().split('T')[1].substring(0, 5)}
                                            </span>
                                            <button
                                                className={`text-gray-400 hover:text-red-500`}
                                                onClick={() => deleteNote(note.noteId)}
                                                aria-label="Delete note"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No notes available.</p>
                    </div>
                )}
            </div>

            {/* Input Section */}
            <div
                className={`flex items-center px-4 py-3 border-t ${isDarkMode ? 'bg-[#202c33]' : 'bg-[#f0f2f5]'} ${isDarkMode ? 'border-gray-700' : 'border-gray-300'
                    }`}
            >
                <input
                    type="text"
                    placeholder="Take a note"
                    className={`flex-grow px-3 py-2 rounded-full text-sm outline-none ${isDarkMode ? 'bg-[#3c484f] text-gray-200 placeholder-gray-400' : 'bg-[#ffffff] text-gray-800 placeholder-gray-500'
                        }`}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                />
                <button
                    className={`ml-4 ${isDarkMode ? 'text-[#00a884] hover:text-[#009172]' : 'text-[#008069] hover:text-[#006d57]'}`}
                    onClick={() => {
                        if (noteContent) addNote(noteContent)
                        setNoteContent('');
                    }}
                    aria-label="Send message"
                >
                    <Plus size={24} />
                </button>
            </div>
        </div>



    );
};

export default ActiveNotes;
