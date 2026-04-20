import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePlanner } from '../../context/PlannerContext';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = usePlanner();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [category, setCategory] = useState('Study');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title,
      date,
      time,
      category,
      priority,
      completed: false,
    });
    onClose();
    setTitle('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add New Task</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Task title..." 
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input 
                type="date" 
                className="input" 
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input 
                type="time" 
                className="input" 
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="input" 
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="Study">Study</option>
                <option value="Assignment">Assignment</option>
                <option value="Exam">Exam</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select 
                className="input" 
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
