import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnippets } from './SnippetContext';

const ViewSnippet = () => {
    const { snippetId } = useParams();
    const navigate = useNavigate();
    const { snippets, deleteSnippet } = useSnippets();
    const snippet = snippets.find(s => s.id === parseInt(snippetId));

    const copyToClipboard = () => {
        navigator.clipboard.writeText(snippet.content);
    };

    const handleDelete = () => {
        deleteSnippet(parseInt(snippetId));
        navigate('/');
    };

    if (!snippet) return null;

    return (
        <div className="view-snippet">
            <div className="header">
                <button onClick={() => navigate('/')} className="back-button">←</button>
                <h2>Snippet</h2>
            </div>
            <div className="snippet-content">{snippet.content}</div>
            <div className="tags-container">
                {snippet.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                ))}
            </div>
            <div className="actions">
                <button onClick={() => navigate(`/edit/${snippetId}`)} className="edit-button">Edit snippet</button>
                <button onClick={copyToClipboard} className="copy-button">Copy to clipboard</button>
                <button onClick={handleDelete} className="delete-button">Delete snippet</button>
            </div>
        </div>
    );
};

export default ViewSnippet;