import React, { createContext, useContext, useEffect, useState } from 'react';

const SnippetContext = createContext();

export const useSnippets = () => useContext(SnippetContext);

export const SnippetProvider = ({ children }) => {
    const [snippets, setSnippets] = useState([]);
    const [tags, setTags] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedSnippets = JSON.parse(localStorage.getItem('snippets') || '[]');
        setSnippets(storedSnippets);
        loadTags();
    }, []);

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
        const data = JSON.stringify({ snippets, tags });
        const blob = new Blob([data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'snippets_export.csv';
        a.click();
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
        setIsDarkMode(prev => !prev);
    };

    return (
        <SnippetContext.Provider value={{ snippets, addSnippet, updateSnippet, deleteSnippet, tags, addTag, updateTag, deleteTag, loadTags, exportData, importData, isDarkMode, toggleDarkMode }}>
            {children}
        </SnippetContext.Provider>
    );
};