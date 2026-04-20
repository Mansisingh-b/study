// import React from 'react';
import './App.css';

// Simple test component to verify rendering
function App() {
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Inter, sans-serif',
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      <h1 style={{ color: '#0f172a', marginBottom: '1rem' }}>
        Student Planner Pro - Testing
      </h1>
      <p style={{ color: '#64748b' }}>
        If you can see this message, React is rendering correctly!
      </p>
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <p>✅ React is working</p>
        <p>✅ Vite dev server is running</p>
        <p>✅ CSS is loading</p>
      </div>
    </div>
  );
}

export default App;
