import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddSnippet.css';
import { useSnippets } from './SnippetContext';

const AddSnippet = () => {
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const { addSnippet } = useSnippets();
    const navigate = useNavigate();

    const handleSave = () => {
        addSnippet({ content, tags });
        navigate('/');
    };

    return (
        <div className="add-snippet">
            <div className="header">
                <button className="cancel-button" onClick={() => navigate('/')}>×</button>
                <h2>Add snippet</h2>
            </div>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write or paste your snippet"
                className="snippet-input"
            />
            <div className="tags-section">
                <h3>Tags</h3>
                <div className="tags-container">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Add tag"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            setTags([...tags, e.target.value]);
                            e.target.value = '';
                        }
                    }}
                    className="tag-input"
                />
            </div>
            <button onClick={handleSave} className="save-button">Save snippet</button>
        </div>
    );
};

export default AddSnippet;