import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePlanner } from '../../context/PlannerContext';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose }) => {
  const { addGoal } = usePlanner();
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState(10);
  const [type, setType] = useState<'mini' | 'boss'>('mini');
  const [category, setCategory] = useState('Personal');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addGoal({
        title,
        target,
        type,
        category,
        progress: 0,
        icon: type === 'mini' ? '🎯' : '⚡',
        color: type === 'mini' ? '#10b981' : '#f59e0b',
        xpReward: type === 'mini' ? 50 : 200,
      });
      onClose();
      setTitle('');
      setTarget(10);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add New Goal</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Goal Title</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g., Read 10 Books" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select 
                className="input" 
                value={type}
                onChange={e => setType(e.target.value as 'mini' | 'boss')}
              >
                <option value="mini">Mini Monster (Small)</option>
                <option value="boss">Boss Monster (Big)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Target Amount</label>
              <input 
                type="number" 
                className="input" 
                min="1"
                value={target}
                onChange={e => setTarget(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="input" 
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Finance">Finance</option>
              <option value="Health">Health</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;
