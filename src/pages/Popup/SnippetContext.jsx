import { clearConfigCache } from 'prettier';
import React, { createContext, useState, useContext, useEffect } from 'react';

const SnippetContext = createContext();

export const useSnippets = () => useContext(SnippetContext);

export const SnippetProvider = ({ children }) => {
    const [snippets, setSnippets] = useState([]);

    useEffect(() => {
        const storedSnippets = JSON.parse(localStorage.getItem('snippets') || '[]');
        setSnippets(storedSnippets);
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

    return (
        <SnippetContext.Provider value={{ snippets, addSnippet, updateSnippet, deleteSnippet }}>
            {children}
        </SnippetContext.Provider>
    );
};
