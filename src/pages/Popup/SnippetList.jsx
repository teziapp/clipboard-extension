import { Clipboard, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnippets } from './SnippetContext';

const SnippetList = () => {
    const { snippets, tags } = useSnippets();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredSnippets = snippets.filter(snippet =>
        snippet.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const copyToClipboard = (content) => {
        navigator.clipboard.writeText(content).then(() => {
            console.log('Copied to clipboard');
        });
    };

    const handleAddNewSnippet = () => {
        navigate('/add', { state: { initialContent: searchTerm } });
    };

    const handleSnippetClick = (snippetId) => {
        navigate(`/edit/${snippetId}`);
    };

    return (
        <div className="w-full h-full font-sans bg-gray-100 flex flex-col">
            <div className="flex justify-between items-center p-4">
                <h1 className="text-xl font-semibold text-gray-800">Snippets</h1>
                <button
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => navigate('/add')}
                >
                    <Plus size={24} />
                </button>
            </div>
            <div className="w-full px-4 pb-4">
                <input
                    type="text"
                    placeholder="Search snippets"
                    className="w-full p-3 rounded-lg bg-gray-200 text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex-grow overflow-y-auto px-4">
                {filteredSnippets.length > 0 ? (
                    filteredSnippets.map((snippet) => (
                        <div 
                            key={snippet.id} 
                            className="bg-white rounded-lg p-4 mb-4 relative shadow cursor-pointer"
                            onClick={() => handleSnippetClick(snippet.id)}
                        >
                            <div className="text-sm text-gray-700 mb-2 leading-relaxed">{snippet.content}</div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <div className="flex flex-wrap gap-1">
                                    {snippet.tags.map((tagName, index) => {
                                        const tagInfo = tags.find(t => t.name === tagName);
                                        return (
                                            <span 
                                                key={index} 
                                                className="px-2 py-1 rounded" 
                                                style={{ backgroundColor: tagInfo ? tagInfo.color : '#e2e8f0', color: tagInfo ? getContrastColor(tagInfo.color) : '#1a202c' }}
                                            >
                                                {tagName}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                            <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-blue-500"
                                onClick={() => copyToClipboard(snippet.content)}
                            >
                                <Clipboard size={16} />
                            </button>
                        </div>
                    ))
                ) : searchTerm.trim() !== '' ? (
                    <div className="bg-white rounded-lg p-4 mb-4 shadow">
                        <p className="text-gray-700 mb-2">No snippets found for "{searchTerm}"</p>
                        <button
                            className="flex items-center text-blue-500 hover:text-blue-600"
                            onClick={handleAddNewSnippet}
                        >
                            <Plus size={16} className="mr-1" />
                            Add new snippet
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg p-4 mb-4 shadow">
                        <p className="text-gray-700">No Snippets Available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper function to determine text color based on background color
function getContrastColor(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
}

export default SnippetList;