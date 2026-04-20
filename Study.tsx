import React, { useState, useEffect } from 'react';
import { 
  Play, Plus, Video, CheckCircle2, X, Edit2, Trash2, Folder
} from 'lucide-react';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import type { StudyFolder, StudyTopic } from '../types';
import './Study.css';

/* ===== COMPONENTS ===== */
const PriorityBadge: React.FC<{ priority?: StudyTopic['priority'] }> = ({ priority = 'medium' }) => {
  const p = priority || 'medium';
  const colors = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
  return (
    <span className="priority-badge" style={{ background: colors[p] + '20', color: colors[p], padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 }}>
      {p.toUpperCase()}
    </span>
  );
};

/* ===== MAIN COMPONENT ===== */
const Study: React.FC = () => {

  // Storage Keys
  const [folders, setFolders] = useState<StudyFolder[]>(() => loadFromStorage('studyPlaylistsByFolder_folders', [
    { id: 'f1', name: 'Mathematics', color: '#6366f1', createdAt: new Date().toISOString() },
    { id: 'f2', name: 'Physics', color: '#10b981', createdAt: new Date().toISOString() }
  ]));
  const [topics, setTopics] = useState<StudyTopic[]>(() => loadFromStorage('studyPlaylistsByFolder_topics', []));

  const [activeFolderId, setActiveFolderId] = useState<string>(folders[0]?.id || '');
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null);
  const [videoInput, setVideoInput] = useState('');

  // UI State
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [editingTopic, setEditingTopic] = useState<StudyTopic | null>(null);
  const [editingFolder, setEditingFolder] = useState<StudyFolder | null>(null);

  // Form States
  const [topicForm, setTopicForm] = useState({ title: '', url: '', folderId: '', priority: 'medium' as StudyTopic['priority'], timestamp: '' });
  const [folderForm, setFolderForm] = useState({ name: '', color: '#6366f1' });

  // Persistence
  useEffect(() => saveToStorage('studyPlaylistsByFolder_folders', folders), [folders]);
  useEffect(() => saveToStorage('studyPlaylistsByFolder_topics', topics), [topics]);

  const currentTopic = topics.find(t => t.id === currentTopicId);
  const folderTopics = topics.filter(t => t.folderId === activeFolderId);
  const progress = folderTopics.length > 0 
    ? Math.round((folderTopics.filter(t => t.completed).length / folderTopics.length) * 100)
    : 0;

  /* ===== HANDLERS ===== */
  const handleAddTopic = () => {
    if (!topicForm.title || !topicForm.url) return;
    if (editingTopic) {
      setTopics(prev => prev.map(t => t.id === editingTopic.id ? { ...t, ...topicForm } : t));
      setEditingTopic(null);
    } else {
      const newTopic: StudyTopic = {
        id: Date.now().toString(),
        ...topicForm,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTopics(prev => [...prev, newTopic]);
      if (!currentTopicId) setCurrentTopicId(newTopic.id);
    }
    setTopicForm({ title: '', url: '', folderId: activeFolderId, priority: 'medium', timestamp: '' });
    setShowAddTopic(false);
  };

  const handleAddFolder = () => {
    if (!folderForm.name) return;
    if (editingFolder) {
      setFolders(prev => prev.map(f => f.id === editingFolder.id ? { ...f, ...folderForm } : f));
      setEditingFolder(null);
    } else {
      const newFolder: StudyFolder = {
        id: Date.now().toString(),
        ...folderForm,
        createdAt: new Date().toISOString()
      };
      setFolders(prev => [...prev, newFolder]);
      setActiveFolderId(newFolder.id);
    }
    setFolderForm({ name: '', color: '#6366f1' });
    setShowAddFolder(false);
  };

  const handleDeleteFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm("Are you sure you want to delete this folder and all its videos?")) {
      setFolders(prev => prev.filter(f => f.id !== id));
      setTopics(prev => prev.filter(t => t.folderId !== id));
      if (activeFolderId === id) setActiveFolderId(folders[0]?.id || '');
    }
  };

  const handlePlayInput = () => {
    if (!videoInput) return;
    // See if it exists, if not just play it temporarily
    const existing = topics.find(t => t.url === videoInput);
    if (existing) {
      setCurrentTopicId(existing.id);
      setActiveFolderId(existing.folderId);
    } else {
      // Create temporary topic
      const tempTopic: StudyTopic = {
        id: 'temp_video',
        title: 'Quick Video Playback',
        url: videoInput,
        folderId: activeFolderId,
        priority: 'medium',
        completed: false,
        createdAt: new Date().toISOString()
      };
      setCurrentTopicId(tempTopic.id);
    }
  };

  const handleOpenAddPlaylist = () => {
    setEditingTopic(null);
    setTopicForm({ title: '', url: videoInput, folderId: activeFolderId, priority: 'medium', timestamp: '' });
    setShowAddTopic(true);
  };

  // Video URL logic
  let targetUrl = videoInput;
  if (currentTopic && currentTopic.id !== 'temp_video') {
    targetUrl = currentTopic.url;
  }
  
  const ytIdMatch = targetUrl ? targetUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|.*[?&]v=))((\w|-){11})/) : null;
  const ytId = ytIdMatch ? ytIdMatch[1] : null;
  const videoUrl = ytId ? `https://www.youtube.com/embed/${ytId}?start=${currentTopic?.timestamp || 0}&autoplay=1` : targetUrl;

  return (
    <div className="study-page" style={{ padding: '1rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 1. Video Player Section */}
      <div 
        className="video-player-wrapper" 
        style={{ 
          width: '100%', 
          aspectRatio: '21/9', 
          background: '#0f172a', 
          borderRadius: '16px', 
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {videoUrl ? (
          <iframe 
            src={videoUrl}
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#64748b' }}>
            <Video size={48} style={{ margin: '0 auto 1rem' }} />
            <p>Paste a YouTube link below or select from your Playlist to start</p>
          </div>
        )}
      </div>

      {/* 2. Controls Section */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
        <input 
          type="text" 
          className="input" 
          style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} 
          placeholder="https://youtu.be/..."
          value={videoInput}
          onChange={e => setVideoInput(e.target.value)}
        />
        <button 
          className="btn btn-primary" 
          style={{ padding: '12px 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }} 
          onClick={handlePlayInput}
        >
          <Play size={16} fill="white" />
          Play
        </button>
        <button 
          className="btn" 
          style={{ padding: '12px 16px', borderRadius: '8px', background: 'transparent', color: '#1e293b', fontWeight: 600, border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }} 
          onClick={handleOpenAddPlaylist}
        >
          <Plus size={18} />
          Add to Playlist
        </button>
      </div>

      {/* 3. Resources Section */}
      <div className="card" style={{ marginTop: '24px', padding: 0, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ background: '#fff', minHeight: '400px' }}>
          <div style={{ padding: '24px' }}>
            <div className="playlist-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Folder size={20} color="#4f46e5" /> Playlist Resources
                </h3>
              </div>
              
              {/* Folders Row */}
              <div className="folder-navigation" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {folders.map(f => (
                    <button 
                      key={f.id} 
                      style={{
                        padding: '8px 16px', borderRadius: '999px', border: '1px solid',
                        borderColor: activeFolderId === f.id ? f.color : '#e2e8f0',
                        background: activeFolderId === f.id ? f.color + '15' : '#fff',
                        color: activeFolderId === f.id ? f.color : '#475569',
                        fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center'
                      }}
                      onClick={() => setActiveFolderId(f.id)}
                    >
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: f.color }} />
                      {f.name}
                      <Edit2 size={12} color="#64748b" onClick={(e) => { e.stopPropagation(); setEditingFolder(f); setFolderForm({ name: f.name, color: f.color }); setShowAddFolder(true); }} style={{ marginLeft: '4px' }}/>
                      <Trash2 size={12} color="#dc2626" onClick={(e) => handleDeleteFolder(f.id, e)} />
                    </button>
                  ))}
                  <button 
                    style={{ padding: '8px 16px', borderRadius: '999px', border: '1px dashed #cbd5e1', background: '#f8fafc', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => { setEditingFolder(null); setFolderForm({ name: '', color: '#4f46e5' }); setShowAddFolder(true); }}
                  >
                    <Plus size={14} /> New Folder
                  </button>
                </div>
              </div>

              {/* Topics List */}
              <div className="playlist-list">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>
                    Topics in {folders.find(f => f.id === activeFolderId)?.name || 'Folder'} ({progress}% Done)
                  </span>
                  <button className="btn btn-primary btn-sm" onClick={() => { setEditingTopic(null); setTopicForm({ title: '', url: videoInput, folderId: activeFolderId, priority: 'medium', timestamp: '' }); setShowAddTopic(true); }}>
                    <Plus size={14} /> Add Resource
                  </button>
                </div>

                {folderTopics.map(topic => (
                  <div 
                    key={topic.id} 
                    onClick={() => { setCurrentTopicId(topic.id); setVideoInput(topic.url); }} 
                    style={{ 
                      padding: '1rem', background: currentTopicId === topic.id ? '#e0e7ff' : '#f8fafc', 
                      borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '1rem', 
                      border: currentTopicId === topic.id ? '1px solid #818cf8' : '1px solid #e2e8f0', cursor: 'pointer' 
                    }}
                  >
                    <div onClick={(e) => { e.stopPropagation(); setTopics(prev => prev.map(t => t.id === topic.id ? { ...t, completed: !t.completed } : t)); }}>
                      {topic.completed ? <CheckCircle2 size={20} color="#10b981" /> : <Play size={20} color="#64748b" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem', color: topic.completed ? '#94a3b8' : '#1e293b', textDecoration: topic.completed ? 'line-through' : 'none' }}>{topic.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{topic.url.split('v=')[1]?.slice(0, 11) || 'URL Link'}</span>
                        <PriorityBadge priority={topic.priority} />
                      </div>
                    </div>
                    <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-btn" onClick={() => { setEditingTopic(topic); setTopicForm({ title: topic.title, url: topic.url, folderId: topic.folderId, priority: topic.priority, timestamp: topic.timestamp || '' }); setShowAddTopic(true); }}><Edit2 size={16} /></button>
                      <button className="icon-btn danger" onClick={() => setTopics(prev => prev.filter(t => t.id !== topic.id))}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                {folderTopics.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}><Video size={36} style={{ margin: '0 auto 12px' }} /><p>No resources found in this folder.</p></div>}
              </div>
            </div>
        </div>
      </div>

      {/* ===== MODALS ===== */}
      {showAddTopic && (
        <div className="modal-overlay" onClick={() => setShowAddTopic(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTopic ? 'Edit Resource' : 'Add Resource'}</h3>
              <button className="icon-btn" onClick={() => setShowAddTopic(false)}><X size={20} /></button>
            </div>
            <div className="form-group"><label>Title</label><input className="input" value={topicForm.title} onChange={e => setTopicForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="form-group"><label>Link (URL)</label><input className="input" value={topicForm.url} onChange={e => setTopicForm(p => ({ ...p, url: e.target.value }))} /></div>
            
            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}><label>Folder Selection</label><select className="input" value={topicForm.folderId} onChange={e => setTopicForm(p => ({ ...p, folderId: e.target.value }))}>
                {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select></div>
              <div className="form-group" style={{ width: '120px' }}><label>Priority</label><select className="input" value={topicForm.priority} onChange={e => setTopicForm(p => ({ ...p, priority: e.target.value as StudyTopic['priority'] }))}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select></div>
              <div className="form-group" style={{ width: '110px' }}><label>Start Time (s)</label>
                <input type="number" className="input" placeholder="e.g. 120" value={topicForm.timestamp} onChange={e => setTopicForm(p => ({ ...p, timestamp: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer"><button className="btn btn-ghost" onClick={() => setShowAddTopic(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAddTopic}>{editingTopic ? 'Save Changes' : 'Add Resource'}</button></div>
          </div>
        </div>
      )}

      {showAddFolder && (
        <div className="modal-overlay" onClick={() => setShowAddFolder(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>{editingFolder ? 'Rename Folder' : 'New Folder'}</h3><button className="icon-btn" onClick={() => setShowAddFolder(false)}><X size={20} /></button></div>
            <div className="form-group"><label>Folder Name</label><input className="input" value={folderForm.name} onChange={e => setFolderForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="modal-footer"><button className="btn btn-ghost" onClick={() => setShowAddFolder(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAddFolder}>{editingFolder ? 'Rename' : 'Create'}</button></div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Study;