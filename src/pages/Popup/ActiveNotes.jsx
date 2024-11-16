import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSnippets } from './SnippetContext';
import { useNavigate } from 'react-router-dom';

const ActiveNotes = () => {

    const { notes, addNote, deleteNote, isDarkMode, activeSymbol } = useSnippets();
    const [noteContent, setNoteContent] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        document.getElementById('notes-container').scrollTo({
            top: document.getElementById('notes-container').scrollHeight,
            behavior: "smooth",
        });
    }, [notes])

    const filteredNotes = notes.filter((note) => note.symId == activeSymbol.symId)
    filteredNotes.sort((a, b) => a.date - b.date)
    let groupedNotes = {}
    filteredNotes.forEach((i) => {
        const date = new Date(i.date)
        const formattedDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
        if (!groupedNotes[formattedDate]) {
            groupedNotes[formattedDate] = [i]
            return
        }
        groupedNotes[formattedDate] = [...groupedNotes[formattedDate], i]
    })

    const handleAddNote = () => {
        if (noteContent.trim() !== '') {
            addNote(noteContent);
            setNoteContent('');
        }
    };

    const handleDeleteNote = (noteId) => {
        deleteNote(noteId);
    };

    return (

        <div className={`w-full h-full font-sans ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} flex flex-col`}>
            <div className="flex items-center gap-3 p-4">
                <ArrowLeft className={`cursor-pointer ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}
                    onClick={() => {
                        navigate('/noteList')
                    }} />

                <h1 className={` text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {activeSymbol.title}
                </h1>
            </div>

            <div id='notes-container' className="flex-grow overflow-y-auto px-4">
                {Object.keys(groupedNotes).length > 0 ? (
                    Object.keys(groupedNotes).map((date) => {
                        return (<>
                            <hr className={`${isDarkMode ? 'border-gray-700' : 'border-gray-300'} mb-0.2`} />
                            <span
                                className={`block w-full text-right text-sm font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-400'
                                    }`}
                            >
                                {date}
                            </span>
                            {groupedNotes[date].map((note) => (
                                <div
                                    key={note.noteId}
                                    className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 mb-4 shadow relative`}
                                >
                                    <div className={`mr-3.5 overflow-auto text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {note.content}
                                    </div>
                                    <button
                                        className={`absolute top-3 right-3 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'}`}
                                        onClick={() => handleDeleteNote(note.noteId)}
                                        aria-label="Delete note"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </>
                        )
                    })

                ) : (
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 mb-4 shadow`}>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>No Notes Available.</p>
                    </div>
                )}
            </div>
            <div className="w-full p-4 flex items-center border-t">
                <input
                    type="text"
                    placeholder="Add a new note"
                    className={`flex-grow p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                />
                <button
                    className={`ml-4 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}
                    onClick={() => {
                        handleAddNote()
                    }}
                    aria-label="Add note"
                >
                    <Plus size={24} />
                </button>
            </div>
        </div>


    );
};

export default ActiveNotes;
