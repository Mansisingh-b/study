import React, { useState, useEffect } from 'react';
import { Plus, FolderPlus, Globe, FileText, Film, Music, File, Trash2, Edit2, ExternalLink, Folder, ChevronRight, ArrowLeft, X } from 'lucide-react';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import './Bookmarks.css';

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  type: 'link' | 'pdf' | 'mp4' | 'mp3' | 'timetable' | 'other';
  folderId: string | null;
  createdAt: string;
}

interface BookmarkFolder {
  id: string;
  name: string;
  color: string;
  parentId: string | null;
}

const typeIcons: Record<string, React.ReactNode> = {
  link: <Globe size={18} />,
  pdf: <FileText size={18} />,
  mp4: <Film size={18} />,
  mp3: <Music size={18} />,
  timetable: <FileText size={18} />,
  other: <File size={18} />,
};

const typeColors: Record<string, string> = {
  link: '#3b82f6',
  pdf: '#ef4444',
  mp4: '#8b5cf6',
  mp3: '#f59e0b',
  timetable: '#10b981',
  other: '#64748b',
};

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => loadFromStorage('bookmarks', []));
  const [folders, setFolders] = useState<BookmarkFolder[]>(() => loadFromStorage('bookmarkFolders', []));
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BookmarkItem | null>(null);
  const [editingFolder, setEditingFolder] = useState<BookmarkFolder | null>(null);

  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', type: 'link' as BookmarkItem['type'] });
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#6366f1');

  // Persist
  useEffect(() => { saveToStorage('bookmarks', bookmarks); }, [bookmarks]);
  useEffect(() => { saveToStorage('bookmarkFolders', folders); }, [folders]);

  const currentFolderObj = folders.find(f => f.id === currentFolder) || null;
  const filteredBookmarks = bookmarks.filter(b => b.folderId === currentFolder);
  const filteredFolders = folders.filter(f => f.parentId === currentFolder);

  const handleAddBookmark = () => {
    if (!newBookmark.title.trim() || !newBookmark.url.trim()) return;
    if (editingItem) {
      setBookmarks(prev => prev.map(b => b.id === editingItem.id ? { ...b, ...newBookmark } : b));
      setEditingItem(null);
    } else {
      setBookmarks(prev => [...prev, {
        ...newBookmark,
        id: Date.now().toString(),
        folderId: currentFolder,
        createdAt: new Date().toISOString(),
      }]);
    }
    setNewBookmark({ title: '', url: '', type: 'link' });
    setShowAddModal(false);
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    if (editingFolder) {
      setFolders(prev => prev.map(f => f.id === editingFolder.id ? { ...f, name: newFolderName, color: newFolderColor } : f));
      setEditingFolder(null);
    } else {
      setFolders(prev => [...prev, {
        id: Date.now().toString(),
        name: newFolderName,
        color: newFolderColor,
        parentId: currentFolder,
      }]);
    }
    setNewFolderName('');
    setNewFolderColor('#6366f1');
    setShowFolderModal(false);
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const handleDeleteFolder = (id: string) => {
    // Delete folder and all its contents
    setBookmarks(prev => prev.filter(b => b.folderId !== id));
    setFolders(prev => prev.filter(f => f.id !== id && f.parentId !== id));
  };

  const openEditBookmark = (item: BookmarkItem) => {
    setEditingItem(item);
    setNewBookmark({ title: item.title, url: item.url, type: item.type });
    setShowAddModal(true);
  };

  const openEditFolder = (folder: BookmarkFolder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setNewFolderColor(folder.color);
    setShowFolderModal(true);
  };

  const openResource = (item: BookmarkItem) => {
    window.open(item.url, '_blank');
  };

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-header">
        <div>
          <h1 className="page-title">Bookmarks</h1>
          <p className="page-subtitle">Quick access to your study resources</p>
        </div>
        <div className="bookmarks-actions">
          <button className="btn btn-secondary" onClick={() => { setEditingFolder(null); setNewFolderName(''); setShowFolderModal(true); }}>
            <FolderPlus size={18} /> Add Folder
          </button>
          <button className="btn btn-primary" onClick={() => { setEditingItem(null); setNewBookmark({ title: '', url: '', type: 'link' }); setShowAddModal(true); }}>
            <Plus size={18} /> Add Bookmark
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      {currentFolder && (
        <div className="bookmark-breadcrumb">
          <button className="breadcrumb-btn" onClick={() => setCurrentFolder(null)}>
            <ArrowLeft size={16} /> All Bookmarks
          </button>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">{currentFolderObj?.name}</span>
        </div>
      )}

      {/* Content */}
      <div className="bookmarks-content card">
        {filteredFolders.length === 0 && filteredBookmarks.length === 0 ? (
          <div className="empty-state">
            <Globe size={48} style={{ opacity: 0.3 }} />
            <p className="empty-state-text" style={{ marginTop: '1rem' }}>No bookmarks yet. Add your first resource!</p>
          </div>
        ) : (
          <div className="bookmarks-grid">
            {/* Folders */}
            {filteredFolders.map(folder => (
              <div key={folder.id} className="bookmark-card folder-card" onClick={() => setCurrentFolder(folder.id)}>
                <div className="bookmark-card-icon" style={{ background: folder.color + '20', color: folder.color }}>
                  <Folder size={24} />
                </div>
                <div className="bookmark-card-info">
                  <span className="bookmark-card-title">{folder.name}</span>
                  <span className="bookmark-card-meta">{bookmarks.filter(b => b.folderId === folder.id).length} items</span>
                </div>
                <div className="bookmark-card-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-icon" onClick={() => openEditFolder(folder)}><Edit2 size={14} /></button>
                  <button className="btn-icon" onClick={() => handleDeleteFolder(folder.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}

            {/* Bookmarks */}
            {filteredBookmarks.map(item => (
              <div key={item.id} className="bookmark-card" onClick={() => openResource(item)}>
                <div className="bookmark-card-icon" style={{ background: typeColors[item.type] + '20', color: typeColors[item.type] }}>
                  {typeIcons[item.type]}
                </div>
                <div className="bookmark-card-info">
                  <span className="bookmark-card-title">{item.title}</span>
                  <span className="bookmark-card-meta">{item.type.toUpperCase()} • {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="bookmark-card-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-icon" onClick={() => openResource(item)}><ExternalLink size={14} /></button>
                  <button className="btn-icon" onClick={() => openEditBookmark(item)}><Edit2 size={14} /></button>
                  <button className="btn-icon" onClick={() => handleDeleteBookmark(item.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Bookmark Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingItem ? 'Edit Bookmark' : 'Add Bookmark'}</h3>
              <button className="btn-icon" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="input" placeholder="Resource title" value={newBookmark.title} onChange={e => setNewBookmark(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">URL / Path</label>
              <input className="input" placeholder="https://... or file path" value={newBookmark.url} onChange={e => setNewBookmark(p => ({ ...p, url: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="input" value={newBookmark.type} onChange={e => setNewBookmark(p => ({ ...p, type: e.target.value as BookmarkItem['type'] }))}>
                <option value="link">🌐 Website Link</option>
                <option value="pdf">📄 PDF</option>
                <option value="mp4">🎬 Video (MP4)</option>
                <option value="mp3">🎵 Audio (MP3)</option>
                <option value="timetable">📋 Timetable</option>
                <option value="other">📁 Other</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddBookmark}>{editingItem ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Folder Modal */}
      {showFolderModal && (
        <div className="modal-overlay" onClick={() => setShowFolderModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingFolder ? 'Edit Folder' : 'Add Folder'}</h3>
              <button className="btn-icon" onClick={() => setShowFolderModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Folder Name</label>
              <input className="input" placeholder="My Notes" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker">
                {['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'].map(c => (
                  <button key={c} className={`color-option ${newFolderColor === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setNewFolderColor(c)} />
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowFolderModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddFolder}>{editingFolder ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
