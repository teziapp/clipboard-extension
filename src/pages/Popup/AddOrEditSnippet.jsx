import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSnippets } from './SnippetContext';

const AddOrEditSnippet = () => {
    const { snippets, addSnippet, updateSnippet, deleteSnippet, tags: allTags, addTag } = useSnippets();
    const navigate = useNavigate();
    const { snippetId } = useParams();
    const location = useLocation();
    const [content, setContent] = useState('');
    const [snippetTags, setSnippetTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    useEffect(() => {
        if (snippetId) {
            const snippet = snippets.find(s => s.id === parseInt(snippetId));
            if (snippet) {
                setContent(snippet.content);
                setSnippetTags(snippet.tags);
            }
        } else {
            // Apply default tags for new snippets
            const defaultTags = allTags.filter(tag => tag.isDefault).map(tag => tag.name);
            setSnippetTags(defaultTags);
            
            // Set initial content from location state if available
            if (location.state && location.state.initialContent) {
                setContent(location.state.initialContent);
            }
        }
    // Dont want to run useEffect on allTags update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snippetId, snippets, location.state]);

    const handleSave = () => {
        if (snippetId) {
            updateSnippet({ id: parseInt(snippetId), content, tags: snippetTags });
        } else {
            addSnippet({ content, tags: snippetTags });
        }
        navigate('/');
    };

    const handleAddTag = () => {
        if (newTag && !snippetTags.includes(newTag)) {
            setSnippetTags([...snippetTags, newTag]);
            if (!allTags.some(tag => tag.name === newTag)) {
                addTag({ name: newTag, color: '#000000', isDefault: false });
            }
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setSnippetTags(snippetTags.filter(tag => tag !== tagToRemove));
    };

    const handleDelete = () => {
        if (snippetId) {
            setShowDeleteConfirmation(true);
        }
    };

    const confirmDelete = () => {
        if (snippetId) {
            deleteSnippet(parseInt(snippetId));
            navigate('/');
        }
        setShowDeleteConfirmation(false);
    };

    return (
        <div className="p-4 bg-white h-full flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <button className="mr-2 text-2xl" onClick={() => navigate('/')}>←</button>
                    <h2 className="text-xl font-semibold">{snippetId ? 'Edit snippet' : 'Add snippet'}</h2>
                </div>
                <button 
                    className={`text-red-500 ${!snippetId && 'opacity-50 cursor-not-allowed'}`} 
                    onClick={handleDelete}
                    disabled={!snippetId}
                >
                    <Trash2 size={24} />
                </button>
            </div>
            <textarea
                className="w-full h-40 p-3 mb-4 bg-gray-100 rounded-lg resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write or paste your snippet"
            />
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    {snippetTags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center">
                            {tag}
                            <button
                                className="ml-2 text-gray-500 font-bold"
                                onClick={() => handleRemoveTag(tag)}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex items-center">
                    <input
                        type="text"
                        className="flex-grow p-2 bg-gray-100 rounded-l-lg"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        placeholder="Add tag"
                        list="tagSuggestions"
                    />
                    <datalist id="tagSuggestions">
                        {allTags.map((tag, index) => (
                            <option key={index} value={tag.name} />
                        ))}
                    </datalist>
                    <button
                        className="p-2 bg-gray-100 rounded-r-lg text-blue-500 text-xl h-full"
                        onClick={handleAddTag}
                    >
                        +
                    </button>
                </div>
            </div>
            <button
                className="w-full py-3 bg-blue-500 text-white rounded-lg"
                onClick={handleSave}
            >
                Save
            </button>

            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg">
                        <p className="mb-4">Are you sure you want to delete this snippet?</p>
                        <div className="flex justify-end">
                            <button 
                                className="mr-2 px-4 py-2 bg-gray-200 rounded"
                                onClick={() => setShowDeleteConfirmation(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-4 py-2 bg-red-500 text-white rounded"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddOrEditSnippet;