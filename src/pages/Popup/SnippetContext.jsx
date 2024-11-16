import React, { createContext, useContext, useEffect, useState } from 'react';
import dexieStore from '../../Dexie/DexieStore';

const SnippetContext = createContext();

export const useSnippets = () => useContext(SnippetContext);

export const SnippetProvider = ({ children }) => {
    const [activeSymbol, setActiveSymbol] = useState({})
    const [notes, setNotes] = useState([])
    const [snippets, setSnippets] = useState([]);
    const [tags, setTags] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });



    useEffect(() => {
        const storedSnippets = JSON.parse(localStorage.getItem('snippets') || '[]');
        setSnippets(storedSnippets);
        loadTags();
        (async () => {
            const storedNotes = await dexieStore.getItem('notes')
            setNotes(storedNotes)
        })()

    }, []);

    //Notes functions
    const addNote = (content) => {
        const newNote = { noteId: Date.now(), content, symId: activeSymbol.symId, date: Date.now(), title: activeSymbol.title };
        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);
        dexieStore.setItem('currentNotes', { notes: updatedNotes, activeSymbol });
    };

    const deleteNote = (noteId) => {
        const updatedNotes = notes.filter(note => note.noteId !== noteId);
        setNotes(updatedNotes);
        dexieStore.setItem('currentNotes', { notes: updatedNotes, activeSymbol });
    };




    const addSnippet = (newSnippet) => {
        const updatedSnippets = [...snippets, { ...newSnippet, id: Date.now() }];
        setSnippets(updatedSnippets);
        localStorage.setItem('snippets', JSON.stringify(updatedSnippets));
    };

    const updateSnippet = (updatedSnippet) => {
        const updatedSnippets = snippets.map(snippet =>
            snippet.id === updatedSnippet.id ? updatedSnippet : snippet
        );
        setSnippets(updatedSnippets);
        localStorage.setItem('snippets', JSON.stringify(updatedSnippets));
    };

    const deleteSnippet = (snippetId) => {
        const updatedSnippets = snippets.filter(snippet => snippet.id !== snippetId);
        setSnippets(updatedSnippets);
        localStorage.setItem('snippets', JSON.stringify(updatedSnippets));
    };

    const addTag = (newTag) => {
        setTags(prevTags => {
            const updatedTags = [...prevTags, newTag];
            localStorage.setItem('tags', JSON.stringify(updatedTags));
            return updatedTags;
        });
    };

    const updateTag = (updatedTag) => {
        setTags(prevTags => {
            const updatedTags = prevTags.map(tag =>
                tag.name === updatedTag.name ? updatedTag : tag
            );
            localStorage.setItem('tags', JSON.stringify(updatedTags));
            return updatedTags;
        });
    };

    const deleteTag = (tagName) => {
        setTags(prevTags => {
            const updatedTags = prevTags.filter(tag => tag.name !== tagName);
            localStorage.setItem('tags', JSON.stringify(updatedTags));
            return updatedTags;
        });
        setSnippets(prevSnippets => {
            const updatedSnippets = prevSnippets.map(snippet => ({
                ...snippet,
                tags: snippet.tags.filter(tag => tag !== tagName)
            }));
            localStorage.setItem('snippets', JSON.stringify(updatedSnippets));
            return updatedSnippets;
        });
    };

    const loadTags = () => {
        const storedTags = JSON.parse(localStorage.getItem('tags') || '[]');
        setTags(storedTags);
    };

    const exportData = () => {
        const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
        console.log('Snippets data:', snippets);
        const csvContent = snippets.map(snippet => {
            const text = snippet.content ?? '';
            const tags = Array.isArray(snippet.tags) ? snippet.tags.join('::') : '';
            return `"${text}","${tags}"`;
        }).join('\n');
        return `Snippet,Tags\n${csvContent}`;
    };

    const importData = (csvData) => {
        try {
            const { snippets: importedSnippets, tags: importedTags } = JSON.parse(csvData);
            setSnippets(importedSnippets);
            setTags(importedTags);
        } catch (error) {
            throw new Error('Invalid import data');
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    return (
        <SnippetContext.Provider value={{ snippets, addSnippet, updateSnippet, deleteSnippet, tags, addTag, updateTag, deleteTag, loadTags, exportData, importData, isDarkMode, toggleDarkMode, addNote, deleteNote, activeSymbol, setActiveSymbol, notes }}>
            {children}
        </SnippetContext.Provider>
    );
};