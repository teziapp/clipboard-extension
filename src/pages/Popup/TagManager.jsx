import React, { useEffect, useState } from 'react';
import { useSnippets } from './SnippetContext';

const TagManager = () => {
  const { tags, updateTag, deleteTag, addTag, loadTags } = useSnippets();
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState(null);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  const handleAddTag = () => {
    if (newTag.trim()) {
      if (tags.some(tag => tag.name.toLowerCase() === newTag.trim().toLowerCase())) {
        setError('Tag already exists');
      } else {
        addTag({ name: newTag.trim(), color: '#000000', isDefault: false });
        setNewTag('');
        setError('');
      }
    }
  };

  const handleEditTag = (tag, newName) => {
    if (newName.trim() === tag.name) {
      setEditingTag(null);
      return;
    }
    if (tags.some(t => t.name.toLowerCase() === newName.trim().toLowerCase())) {
      setError('Tag already exists');
    } else {
      updateTag({ ...tag, name: newName.trim() });
      setEditingTag(null);
      setError('');
    }
  };

  const handleDeleteTag = (tagName) => {
    setConfirmDelete(tagName);
  };

  const confirmDeleteTag = () => {
    if (confirmDelete) {
      deleteTag(confirmDelete);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h4 className="text-lg font-semibold mb-3">Manage Tags</h4>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {tags.map((tag) => (
          <div key={tag.name} className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
            <input
              type="color"
              value={tag.color}
              onChange={(e) => updateTag({ ...tag, color: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer"
            />
            {editingTag === tag.name ? (
              <input
                type="text"
                value={tag.name}
                onChange={(e) => handleEditTag(tag, e.target.value)}
                onBlur={() => setEditingTag(null)}
                className="flex-grow p-1 border rounded"
                autoFocus
              />
            ) : (
              <span
                className="flex-grow cursor-pointer"
                onClick={() => setEditingTag(tag.name)}
              >
                {tag.name}
              </span>
            )}
            <button
              onClick={() => updateTag({ ...tag, isDefault: !tag.isDefault })}
              className={`px-2 py-1 rounded text-xs ${
                tag.isDefault ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              {tag.isDefault ? 'Default' : 'Set Default'}
            </button>
            <button onClick={() => handleDeleteTag(tag.name)} className="text-red-500 hover:text-red-700">
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex mt-3">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New tag"
          className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTag}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition duration-200"
        >
          Add
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete the tag "{confirmDelete}"? This will remove it from all attached snippets.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTag}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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

export default TagManager;