import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlannerProvider } from './context/PlannerContext';
import { UIProvider, useUI } from './context/UIContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import Study from './pages/Study';
import Academics from './pages/Academics';
import Habits from './pages/Habits';
import Timetable from './pages/Timetable';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Bookmarks from './pages/Bookmarks';
import Settings from './pages/Settings';
import Help from './pages/Help';
import AddTaskModal from './components/modals/AddTaskModal';
import AddHabitModal from './components/modals/AddHabitModal';
import AddGoalModal from './components/modals/AddGoalModal';
import { usePlanner } from './context/PlannerContext';
import './App.css';

const AppContent: React.FC = () => {
  const { activeModal, closeModal } = useUI();
  const { settings } = usePlanner();

  return (
    <div className={`app ${settings.darkMode ? 'dark-mode' : ''}`}>
      <Sidebar />
      <div className="app-content">
        <TopBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/study" element={<Study />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </main>
        
        <AddTaskModal 
          isOpen={activeModal === 'task'} 
          onClose={closeModal} 
        />
        <AddHabitModal 
          isOpen={activeModal === 'habit'} 
          onClose={closeModal} 
        />
        <AddGoalModal 
          isOpen={activeModal === 'goal'} 
          onClose={closeModal} 
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <PlannerProvider>
      <UIProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </UIProvider>
    </PlannerProvider>
  );
}

export default App;
