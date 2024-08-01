import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SnippetList.css';
import { useSnippets } from './SnippetContext';

const SnippetList = () => {
    const { snippets } = useSnippets();
    const navigate = useNavigate();

    return (
        <div className="snippet-list">
            <div className="header">
                <h1>Snippets</h1>
                <Link to="/add" className="add-button">+</Link>
            </div>
            <input type="text" placeholder="Search snippets" className="search-input" />
            <div className="snippets-container">
                {snippets.map((snippet) => (
                    <div key={snippet.id} className="snippet-item" onClick={() => navigate(`/view/${snippet.id}`)}>
                        <div className="snippet-content">{snippet.content.substring(0, 50)}...</div>
                        <div className="snippet-tags">{snippet.tags.join(', ')}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SnippetList;