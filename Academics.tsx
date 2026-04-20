import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { 
  Plus, Calendar, Clock, MapPin, CheckCircle2, Circle, 
  Trash2, Edit2, Upload, FileText, X
} from 'lucide-react';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import './Academics.css';

interface TimetableFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video' | 'audio' | 'other';
  date: string;
  size: string;
}

const Academics: React.FC = () => {
  const { 
    assignments, addAssignment, updateAssignment, deleteAssignment, toggleAssignmentComplete,
    exams, addExam, updateExam, deleteExam
  } = usePlanner();

  const [activeTab, setActiveTab] = useState<'assignments' | 'exams' | 'timetable'>('assignments');
  
  // Modal states
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showAddExam, setShowAddExam] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [editingExam, setEditingExam] = useState<any>(null);

  // Forms
  const [assignmentForm, setAssignmentForm] = useState({
    title: '', course: '', dueDate: '', priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [examForm, setExamForm] = useState({
    title: '', course: '', date: '', time: '', location: ''
  });

  // Timetable Files (Persisted)
  const [timetableFiles, setTimetableFiles] = useState<TimetableFile[]>(() => 
    loadFromStorage('timetableFiles', [])
  );

  // Save timetable files
  React.useEffect(() => {
    saveToStorage('timetableFiles', timetableFiles);
  }, [timetableFiles]);

  /* Assignment Handlers */
  const handleSaveAssignment = () => {
    if (!assignmentForm.title || !assignmentForm.dueDate) return;
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, assignmentForm);
      setEditingAssignment(null);
    } else {
      addAssignment({ ...assignmentForm, completed: false });
    }
    setAssignmentForm({ title: '', course: '', dueDate: '', priority: 'medium' });
    setShowAddAssignment(false);
  };

  /* Exam Handlers */
  const handleSaveExam = () => {
    if (!examForm.title || !examForm.date) return;
    if (editingExam) {
      updateExam(editingExam.id, examForm);
      setEditingExam(null);
    } else {
      addExam(examForm);
    }
    setExamForm({ title: '', course: '', date: '', time: '', location: '' });
    setShowAddExam(false);
  };

  /* File Upload Handler (Mock) */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.includes('pdf') ? 'pdf' : 
                   file.type.includes('image') ? 'image' : 
                   file.type.includes('video') ? 'video' : 
                   file.type.includes('audio') ? 'audio' : 'other';
      
      const newFile: TimetableFile = {
        id: Date.now().toString(),
        name: file.name,
        type,
        date: new Date().toLocaleDateString(),
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      };
      setTimetableFiles(prev => [...prev, newFile]);
    }
  };

  const deleteFile = (id: string) => {
    setTimetableFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="academics-page">
      <div className="academics-header">
        <div>
          <h1 className="page-title">Academics</h1>
          <p className="page-subtitle">Manage assignments, exams, and timetables</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="academics-tabs">
        <button className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>
          Assignments
        </button>
        <button className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`} onClick={() => setActiveTab('exams')}>
          Exams
        </button>
        <button className={`tab-btn ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => setActiveTab('timetable')}>
          Timetable
        </button>
      </div>

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="tab-content fade-in">
          <div className="section-header">
            <h3>📝 Assignments</h3>
            <button className="btn btn-primary" onClick={() => { setEditingAssignment(null); setAssignmentForm({ title: '', course: '', dueDate: '', priority: 'medium' }); setShowAddAssignment(true); }}>
              <Plus size={18} /> Add Assignment
            </button>
          </div>
          <div className="assignments-grid">
            {assignments.length > 0 ? assignments.map(a => (
              <div key={a.id} className={`assignment-card ${a.completed ? 'completed' : ''} priority-${a.priority}`}>
                <div className="card-top">
                  <span className="course-badge">{a.course || 'General'}</span>
                  <div className="card-actions">
                    <button className="btn-icon" onClick={() => { setEditingAssignment(a); setAssignmentForm(a); setShowAddAssignment(true); }}><Edit2 size={16} /></button>
                    <button className="btn-icon" onClick={() => deleteAssignment(a.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
                <h4 className="card-title">{a.title}</h4>
                <div className="card-meta">
                  <div className="meta-item"><Calendar size={14} /> {new Date(a.dueDate).toLocaleDateString()}</div>
                  <div className="meta-item priority-tag">{a.priority}</div>
                </div>
                <button className="toggle-btn" onClick={() => toggleAssignmentComplete(a.id)}>
                  {a.completed ? <CheckCircle2 size={20} className="text-green" /> : <Circle size={20} />}
                  {a.completed ? 'Completed' : 'Mark as Done'}
                </button>
              </div>
            )) : (
              <div className="empty-state">No assignments added yet.</div>
            )}
          </div>
        </div>
      )}

      {/* Exams Tab */}
      {activeTab === 'exams' && (
        <div className="tab-content fade-in">
          <div className="section-header">
            <h3>🎓 Exams</h3>
            <button className="btn btn-primary" onClick={() => { setEditingExam(null); setExamForm({ title: '', course: '', date: '', time: '', location: '' }); setShowAddExam(true); }}>
              <Plus size={18} /> Add Exam
            </button>
          </div>
          <div className="exams-list">
            {exams.length > 0 ? exams.map(e => (
              <div key={e.id} className="exam-card">
                <div className="exam-date-box">
                  <span className="month">{new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                  <span className="day">{new Date(e.date).getDate()}</span>
                </div>
                <div className="exam-details">
                  <h4 className="exam-title">{e.title}</h4>
                  <div className="exam-meta">
                    <span><Clock size={14} /> {e.time || 'TBD'}</span>
                    <span><MapPin size={14} /> {e.location || 'Online'}</span>
                    <span className="exam-course">{e.course}</span>
                  </div>
                </div>
                <div className="exam-actions">
                  <button className="btn-icon" onClick={() => { setEditingExam(e); setExamForm(e); setShowAddExam(true); }}><Edit2 size={16} /></button>
                  <button className="btn-icon" onClick={() => deleteExam(e.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            )) : (
              <div className="empty-state">No upcoming exams.</div>
            )}
          </div>
        </div>
      )}

      {/* Timetable Tab */}
      {activeTab === 'timetable' && (
        <div className="tab-content fade-in">
          <div className="section-header">
            <h3>📅 Class Timetable</h3>
            <div className="file-upload-wrapper">
              <input type="file" id="timetable-upload" onChange={handleFileUpload} hidden />
              <label htmlFor="timetable-upload" className="btn btn-primary">
                <Upload size={18} /> Upload Timetable
              </label>
            </div>
          </div>
          <div className="files-grid">
            {timetableFiles.length > 0 ? timetableFiles.map(f => (
              <div key={f.id} className="file-card">
                <div className="file-icon">
                  {f.type === 'pdf' ? <FileText size={32} className="text-red" /> : 
                   f.type === 'image' ? <FileText size={32} className="text-blue" /> : 
                   <FileText size={32} className="text-gray" />}
                </div>
                <div className="file-info">
                  <span className="file-name">{f.name}</span>
                  <span className="file-meta">{f.date} • {f.size}</span>
                </div>
                <div className="file-actions">
                  <button className="btn-icon" title="Download" onClick={() => alert('Download: ' + f.name)}>⬇</button>
                  <button className="btn-icon" onClick={() => deleteFile(f.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <p>Upload your class timetable (PDF, Image, etc.) here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAddAssignment && (
        <div className="modal-overlay" onClick={() => setShowAddAssignment(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingAssignment ? 'Edit Assignment' : 'New Assignment'}</h3>
              <button className="btn-icon" onClick={() => setShowAddAssignment(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input className="input" value={assignmentForm.title} onChange={e => setAssignmentForm({...assignmentForm, title: e.target.value})} placeholder="e.g. Physics Lab Report" />
            </div>
            <div className="form-group">
              <label>Subject/Course</label>
              <input className="input" value={assignmentForm.course} onChange={e => setAssignmentForm({...assignmentForm, course: e.target.value})} placeholder="e.g. Physics" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" className="input" value={assignmentForm.dueDate} onChange={e => setAssignmentForm({...assignmentForm, dueDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select className="input" value={assignmentForm.priority} onChange={e => setAssignmentForm({...assignmentForm, priority: e.target.value as any})}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddAssignment(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveAssignment}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Modal */}
      {showAddExam && (
        <div className="modal-overlay" onClick={() => setShowAddExam(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingExam ? 'Edit Exam' : 'New Exam'}</h3>
              <button className="btn-icon" onClick={() => setShowAddExam(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label>Exam Title</label>
              <input className="input" value={examForm.title} onChange={e => setExamForm({...examForm, title: e.target.value})} placeholder="e.g. Midterm Exam" />
            </div>
            <div className="form-group">
              <label>Subject/Course</label>
              <input className="input" value={examForm.course} onChange={e => setExamForm({...examForm, course: e.target.value})} placeholder="e.g. Mathematics" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="input" value={examForm.date} onChange={e => setExamForm({...examForm, date: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="time" className="input" value={examForm.time} onChange={e => setExamForm({...examForm, time: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input className="input" value={examForm.location} onChange={e => setExamForm({...examForm, location: e.target.value})} placeholder="e.g. Room 302" />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddExam(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveExam}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academics;
