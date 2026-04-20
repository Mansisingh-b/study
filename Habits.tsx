import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { useUI } from '../context/UIContext';
import './Habits.css';

const Habits: React.FC = () => {
  const { habits, goals, incrementGoalProgress, deleteGoal, completeHabit, deleteHabit } = usePlanner();
  const { openModal } = useUI();
  const [activeTab, setActiveTab] = React.useState<'habits' | 'goals'>('goals');
  
  const miniGoals = goals.filter(g => g.type === 'mini');
  const bossGoals = goals.filter(g => g.type === 'boss');

  return (
    <div className="habits-page">
      <div className="page-header">
        <div>
          <h2>Habits & Goals</h2>
          <p className="text-sm text-secondary">Build daily habits and track your goals</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => openModal('habit')}>
            <Plus size={18} />
            Add Habit
          </button>
          <button className="btn btn-primary" onClick={() => openModal('goal')}>
            <Plus size={18} />
            Add Goal
          </button>
        </div>
      </div>

      <div className="habits-tabs">
        <button 
          className={`habits-tab ${activeTab === 'habits' ? 'active' : ''}`}
          onClick={() => setActiveTab('habits')}
        >
          Habits ({habits.length})
        </button>
        <button 
          className={`habits-tab ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          Goals ({goals.length})
        </button>
      </div>

      {activeTab === 'habits' ? (
        <div className="habits-section">
          {habits.length === 0 ? (
            <div className="empty-state">
              <p>No habits yet. Start small!</p>
            </div>
          ) : (
            <div className="habits-list">
              {habits.map(habit => (
                <div key={habit.id} className="habit-card card">
                  <div className="habit-header">
                    <div className="habit-icon" style={{ background: habit.color + '22', color: habit.color }}>
                      {habit.icon}
                    </div>
                    <div className="habit-info">
                      <h4 className="habit-title">{habit.title}</h4>
                      <p className="habit-meta">{habit.frequency} • {habit.streak} day streak</p>
                    </div>
                    <div className="habit-actions">
                      <button className="btn-icon" onClick={() => completeHabit(habit.id)}>✅</button>
                      <button className="btn-icon" onClick={() => deleteHabit(habit.id)}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="goals-section">
            <h3 className="section-header">
              <span className="section-icon success">🎯</span>
              Mini Monsters (Small Goals)
            </h3>
            
            {miniGoals.length === 0 ? (
              <div className="empty-state">
                <p>No mini goals yet. Start small!</p>
              </div>
            ) : (
              <div className="goals-grid">
                {miniGoals.map(goal => (
                  <div key={goal.id} className="goal-card">
                    <div className="goal-header">
                      <div className="goal-icon" style={{ background: goal.color }}>
                        {goal.icon}
                      </div>
                      <div className="goal-actions">
                        <button className="btn-icon" onClick={() => openModal('goal')}><Edit2 size={16} /></button>
                        <button className="btn-icon" onClick={() => deleteGoal(goal.id)}><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <h4 className="goal-title">{goal.title}</h4>
                    <p className="goal-category text-xs text-secondary">{goal.category}</p>
                    <div className="goal-progress-section">
                      <div className="progress-header">
                        <span className="text-sm text-secondary">Progress</span>
                        <span className="progress-percentage">{Math.round((goal.progress / goal.target) * 100)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill success" 
                          style={{ width: `${(goal.progress / goal.target) * 100}%`, background: goal.color }}
                        />
                      </div>
                      <div className="progress-footer">
                        <span className="text-sm text-secondary">{goal.progress}/{goal.target}</span>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => incrementGoalProgress(goal.id, 1)}
                        >
                          +1
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="goals-section">
            <h3 className="section-header">
              <span className="section-icon warning">⚡</span>
              Boss Monsters (Big Goals)
            </h3>
            
            {bossGoals.length === 0 ? (
              <div className="empty-state">
                <p>No boss goals yet. Dream big!</p>
              </div>
            ) : (
              <div className="goals-grid">
                {bossGoals.map(goal => (
                  <div key={goal.id} className="goal-card">
                    <div className="goal-header">
                      <div className="goal-icon" style={{ background: goal.color }}>
                        {goal.icon}
                      </div>
                      <div className="goal-actions">
                        <button className="btn-icon" onClick={() => openModal('goal')}><Edit2 size={16} /></button>
                        <button className="btn-icon" onClick={() => deleteGoal(goal.id)}><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <h4 className="goal-title">{goal.title}</h4>
                    <p className="goal-category text-xs text-secondary">{goal.category}</p>
                    <div className="goal-progress-section">
                      <div className="progress-header">
                        <span className="text-sm text-secondary">Progress</span>
                        <span className="progress-percentage">{Math.round((goal.progress / goal.target) * 100)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill success" 
                          style={{ width: `${(goal.progress / goal.target) * 100}%`, background: goal.color }}
                        />
                      </div>
                      <div className="progress-footer">
                        <span className="text-sm text-secondary">{goal.progress}/{goal.target}</span>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => incrementGoalProgress(goal.id, 1)}
                        >
                          +1
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Habits;
