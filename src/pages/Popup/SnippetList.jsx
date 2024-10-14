import { Clipboard, Plus } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnippets } from './SnippetContext';

const SnippetList = () => {
    const { snippets, tags, isDarkMode } = useSnippets();
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();

    const filteredSnippets = snippets.filter(snippet =>
        snippet.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const copyToClipboard = useCallback((content, snippetId, event) => {
        event.stopPropagation(); // Prevent snippet edit navigation
        navigator.clipboard.writeText(content).then(() => {
            setCopiedId(snippetId);
            setIsAnimating(true);
            setTimeout(() => {
                setIsAnimating(false);
                setCopiedId(null);
            }, 1000); // Animation duration
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }, []);

    const handleAddNewSnippet = () => {
        navigate('/add', { state: { initialContent: searchTerm } });
    };

    const handleSnippetClick = (snippetId) => {
        navigate(`/edit/${snippetId}`);
    };

    return (
        <div className={`w-full h-full font-sans ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} flex flex-col`}>
            <div className="flex justify-between items-center p-4">
                <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Snippets</h1>
                <button
                    className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}
                    onClick={() => navigate('/add')}
                >
                    <Plus size={24} />
                </button>
            </div>
            <div className="w-full px-4 pb-4">
                <input
                    type="text"
                    placeholder="Search snippets"
                    className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex-grow overflow-y-auto px-4">
                {filteredSnippets.length > 0 ? (
                    filteredSnippets.map((snippet) => (
                        <div 
                            key={snippet.id} 
                            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 mb-4 relative shadow cursor-pointer`}
                            onClick={() => handleSnippetClick(snippet.id)}
                        >
                            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 leading-relaxed`}>{snippet.content}</div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <div className="flex flex-wrap gap-1">
                                    {snippet.tags.map((tagName, index) => {
                                        const tagInfo = tags.find(t => t.name === tagName);
                                        return (
                                            <span 
                                                key={index} 
                                                className="px-2 py-1 rounded" 
                                                style={{ 
                                                    backgroundColor: tagInfo ? tagInfo.color : (isDarkMode ? '#4a5568' : '#e2e8f0'), 
                                                    color: tagInfo ? getContrastColor(tagInfo.color) : (isDarkMode ? '#e2e8f0' : '#1a202c') 
                                                }}
                                            >
                                                {tagName}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                            <button
                                className={`absolute top-4 right-4 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
                                onClick={(e) => copyToClipboard(snippet.content, snippet.id, e)}
                                aria-label="Copy to clipboard"
                            >
                                <Clipboard size={16} />
                            </button>
                            {copiedId === snippet.id && (
                                <div 
                                    className={`
                                        absolute top-4 right-12 px-2 py-1 text-xs rounded 
                                        ${isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'}
                                        transition-all duration-300 ease-in-out
                                        ${isAnimating ? 'scale-110' : 'scale-100'}
                                    `}
                                >
                                    Copied!
                                </div>
                            )}
                        </div>
                    ))
                ) : searchTerm.trim() !== '' ? (
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 mb-4 shadow`}>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>No snippets found for "{searchTerm}"</p>
                        <button
                            className={`flex items-center ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}
                            onClick={handleAddNewSnippet}
                        >
                            <Plus size={16} className="mr-1" />
                            Add new snippet
                        </button>
                    </div>
                ) : (
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 mb-4 shadow`}>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>No Snippets Available.</p>
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