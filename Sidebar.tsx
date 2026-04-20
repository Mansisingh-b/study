import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, BookOpen, GraduationCap, Target, Clock,
  BarChart3, Bell, Bookmark, Settings, Menu
} from 'lucide-react';
import { loadFromStorage, saveToStorage } from '../../utils/storage';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = loadFromStorage('sidebarState', false); // Updated key
      return saved;
    } catch { return false; }
  });
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    saveToStorage('sidebarState', isCollapsed);
  }, [isCollapsed]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsCollapsed(false);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsCollapsed(true);
    }, 3000); // 3s delay
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Tasks', path: '/planner' },
    { icon: BookOpen, label: 'Study', path: '/study' },
    { icon: GraduationCap, label: 'Academics', path: '/academics' },
    { icon: Target, label: 'Habits', path: '/habits' },
    { icon: Clock, label: 'Timer', path: '/timetable' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {isMobile && !isCollapsed && (
        <div className="sidebar-overlay" onClick={() => setIsCollapsed(true)} />
      )}

      <aside 
        className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="sidebar-header">
          {!isCollapsed && <h1 className="sidebar-logo">Student Planner</h1>}
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsCollapsed(true)}
              title={isCollapsed ? item.label : ''} // Tooltip
            >
              <item.icon size={24} className="sidebar-icon" />
              {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
              {isCollapsed && <span className="tooltip">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
