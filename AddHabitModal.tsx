import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePlanner } from '../../context/PlannerContext';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose }) => {
  const { addHabit } = usePlanner();
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [frequency, setFrequency] = useState('Daily');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addHabit({
        title,
        color,
        frequency,
        icon: '✨',
        streak: 0,
      });
      onClose();
      setTitle('');
    }
  };

  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add New Habit</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Habit Title</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g., Read 30 mins" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Frequency</label>
            <select 
              className="input"
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-picker" style={{ display: 'flex', gap: '0.5rem' }}>
              {colors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: c,
                    border: color === c ? '2px solid var(--text-primary)' : '2px solid transparent',
                    cursor: 'pointer'
                  }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;
