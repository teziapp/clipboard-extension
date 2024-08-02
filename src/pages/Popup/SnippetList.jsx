import React, { useState } from 'react';
import { Clipboard } from 'lucide-react';
import './SnippetList.css';
import { useSnippets } from './SnippetContext';
import { Link } from 'react-router-dom';

const SnippetList = () => {
    const { snippets } = useSnippets();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSnippets = snippets.filter(snippet =>
        snippet.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const copyToClipboard = (content) => {
        navigator.clipboard.writeText(content).then(() => {
            console.log('Copied to clipboard');
        });
    };

    return (
        <div className="snippet-list">
            <div className="header">
                <h1>Snippets</h1>
                <Link to="/add" className="add-button">+</Link>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search snippets"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="snippets-container">
                {filteredSnippets.map((snippet) => (
                    <div key={snippet.id} className="snippet-item">
                        <div className="quote-icon">"</div>
                        <div className="snippet-content">{snippet.content}</div>
                        <div className="snippet-meta">
                            <div className="snippet-tags">
                                {snippet.tags.map((tag, index) => (
                                    <span key={index} className="snippet-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <button
                            className="clipboard-button"
                            onClick={() => copyToClipboard(snippet.content)}
                        >
                            <Clipboard size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="bottom-nav">
                <button className="nav-item active">
                    <span className="nav-icon">📚</span>
                    <span className="nav-text">Snippets</span>
                </button>
                <button className="nav-item">
                    <span className="nav-icon">🏷️</span>
                    <span className="nav-text">Tags</span>
                </button>
                <button className="nav-item">
                    <span className="nav-icon">⚙️</span>
                    <span className="nav-text">Settings</span>
                </button>
            </div>
        </div>
    );
};

export default SnippetList;